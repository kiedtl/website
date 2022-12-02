+++
title = "Building an ASCII Particle Engine in Janet"
draft = false
date = 2022-12-02
template = "blog.html"
+++

# Building an ASCII Particle Engine in Janet

Over the past month, I've been busy adding a set of simple particle effects to
my hobby roguelike, [Oathbreaker](https://github.com/kiedtl/roguelike). This was
mainly to provide some visual effects to go alongside usage of monster or player
abilities, reducing dependence on the message log to notify the player in such
cases.

![](//tilde.team/~kiedtl/images/rl/particles/particle-condense.gif)
![](//tilde.team/~kiedtl/images/rl/particles/flamethrower.gif)

Many of the effects are modelled after
[Cogmind's](https://www.gridsagegames.com/blog/2014/04/making-particles/)
particle effects, and the similarities are especially pronounced in, for
example, the explosion animations. However, since Oathbreaker does not revolve
around big shooty guns firing shiny projectiles in a single direction, most of
the later effects necessarily took a more original turn.

![](//tilde.team/~kiedtl/images/rl/particles/call-undead.gif)
![](//tilde.team/~kiedtl/images/rl/particles/particle-beams2.gif)


The engine, implemented in the [Janet](https://janet-lang.org/) scripting
language, is quite small at about 450 of code, not including effect templates or
FFI glue code in the main game engine. The remaining 400 lines of code is mostly
effects definitions and effect templates. If you like, you can view the entire
thing
[here](https://github.com/kiedtl/roguelike/blob/master/data/scripts/particles.janet).

![](//tilde.team/~kiedtl/images/rl/particles/death-explosion.gif)

My implementation is as follows: The game engine first calls the Janet particle
engine, which grabs the effect definition from a table and passes an `origin`
and a `target` coordinate. Each effect definition is defined simply as a list of
emitters which are spawned in the `origin` coordinate, and each emitter has a
specific particle that it creates at its location (or any other arbitrary
location) at set intervals, before aging out and being deactivated. Particles,
in their turn, move at a set speed towards its target (which may be the same as
the initial `target` coordinate, but is usually modified by the emitter), before
dying.

This architecture would be quite inflexible, but each particle (and emitter)
also possesses a set of *triggers* that can be conditionally executed. In this
way particles can reset their speed at arbitrary points, lerp their color to
another, reset their lifetime limits, or even spawn additional emitters. With
this trigger and condition system, more complex effects can be created and
chained together.

Let's take a tour of one of the first implemented effects, the explosion.

![](//tilde.team/~kiedtl/images/rl/particles/particle-explosions.gif)

```
(new-emitter @{
  :lifetime 2
  :spawn-count      (fn [&] 180)
  :get-spawn-params (:SPAR-explosion Emitter)
  :get-spawn-speed  (Emitter :SSPD-min-sin-ticks)

  :particle (new-particle @{
    :tile (new-tile @{ :ch " " :fg 0 :bg 0xffff00 :bg-mix 0.8 })
    :speed 2
    :triggers @[
      [[:COND-reached-target? true] [:TRIG-set-explosion-expand-status 1 true]]

      [
       [:COND-explosion-still-expanding? 1] [:COND-percent? 30]
       [:TRIG-modify-color :bg "g" [:random-factor 0.70 0.72]]
      ]
      [[:COND-explosion-still-expanding? 1] [:TRIG-reset-original-tile]]

      [[:COND-explosion-done-expanding? 1] [:TRIG-reset-lifetime-once 3 0]]
      [[:COND-explosion-done-expanding? 1] [:TRIG-lerp-color :bg 0x851e00 "rgb" [:completed-lifetime 0.8] :inverse true]]

      [[:COND-explosion-done-expanding? 1] [:COND-percent? 1] [:TRIG-create-emitter (new-emitter @{
        :particle (new-particle @{
          :tile (new-tile @{ :ch " " :fg 0 :bg 0xffff00 :bg-mix 0.8 })
          :lifetime 3
          :speed 0
          :triggers @[ [[:COND-true] [:TRIG-lerp-color :bg 0x851e00 "rgb" [:completed-lifetime 2]]] ]
        })
        :lifetime 1
      })]]
    ]
  })
}))
```

{% sidenote() %}
In case you're unfamiliar with Janet's syntax, here's a quick rundown:

- `@{ :foo "bar" }` creates a mutable table with a `:foo` field set to `"bar"`.
- `{ :foo "bar" }` is the same, but the table is immutable (notice the missing
  `@`).
- `@[] and []` create arrays and tuples (immutable arrays), respectively.
- `:foo` creates an "identifier", which is basically a fancy immutable
  created-at-compile-time-only string.
- `(fn [foo bar baz &])` specifies creates a function which takes `foo`, `bar`,
  and `baz`, and then ignores any additional arguments (due to the `&`).
- `(bar :foo)` is the same as `bar.foo`.
- `(:foo bar)` is the same as `bar.foo()`.
{% end %}


Let's get some of the basic emitter stuff out of the way.
- `:lifetime` specifies that the emitter dies after creating two volleys of
  particles (i.e. inactivates after two frames).
- `:spawn-count` is simply a callback that just returns `180`, specifying that
  the emitter will create 180 particles on each frame (yes, that's slightly
  excessive for smaller explosions...); 
- `:get-spawn-params (:SPAR-explosion Emitter)` sets the `:get-spawn-params`
  callback (which is used to modify the trajectory of particles) to a preset
  callback (it's just a constant declared in the Emitter "class", equivalent to
  `Emitter.SPAR_EXPLOSION` in C-like languages). Here, `SPAR-explosion` simply
  causes each particle to shoot off at a different angle from the origin to an
  arbitrary point some distance away.
- `:get-spawn-speed (Emitter :SSPD-min-sin-ticks)` sets the `:get-spawn-speed`
  callback (which is used to modify the speed of particles) to the
  `SSPD-min-sin-ticks` preset callback. Basically, this preset causes each
  particle to be varied slightly according to `(sin(current_frame_number) + 1) /
  2`, to avoid the explosion appearing too even.

Following that, we have our particle definition which the emitter will use when
spawning new particles. It starts off by specifying an appearance (blank, with a
background of `0xffff00`, mixing with the original in-game tile's background
with a factor of 0.8) and a speed (2 tiles per turn, further modified by the
emitters `:get-spawn-speed` callback covered earlier).

The particle's triggers, as we will see, are written in a DSL-like way, with an
array of any number of condition function references (with any arguments the
function should be passed, in addition to the effect's context) and a single
trigger function reference at the end (also with any additional arguments). For
example, the first trigger
```
[[:COND-reached-target? true] [:TRIG-set-explosion-expand-status 1 true]]
```
is composed of a single condition (`[:COND-reached-target? true]`) which
indicates that the function `Particle.COND-reached-target?` should be called
with the arguments `particle`, `ticks`, `context` (the default arguments) and
`true` (the argument stated here), along with a trigger
`Particle.TRIG-set-explosion-expand-status` that will be called with the
arguments `particle`, `ticks`, `context`, `1`, and `true`.

The particle's triggers (the `:triggers` field) have three sections: one which
checks if any particle in the explosion has reached its destination, a set which
triggers if that is the case, and another which triggers otherwise.

The first section is the trigger dissected earlier, which checks if the particle
has reached its target (which may be slightly off the *initial* target, due to
the emitter randomizing it slightly), and sets a global variable in the parent
emitter if that's the case. With this method, every particle will immediately
know if any one of them has reached the target.

The second section is only executed if no particles have yet reached the target:
```
[
 [:COND-explosion-still-expanding? 1] [:COND-percent? 30]
 [:TRIG-modify-color :bg "g" [:random-factor 0.70 0.72]]
]
[[:COND-explosion-still-expanding? 1] [:TRIG-reset-original-tile]]
```
The first trigger (with the `:TRIG-modify-color` trigger) has the effect of
modifying the particle's color to a "cooler" color, by reducing the `g`
component.

The second trigger (`:TRIG-reset-original-tile`) is an implementation detail
that I won't get into, so I'll just note that it makes the transition into the
third trigger stage smoother.

Finally, we have the third stage of triggers:
```
[[:COND-explosion-done-expanding? 1] [:TRIG-reset-lifetime-once 3 0]]
[[:COND-explosion-done-expanding? 1] [:TRIG-lerp-color :bg 0x851e00 "rgb" [:completed-lifetime 0.8] :inverse true]]

[[:COND-explosion-done-expanding? 1] [:COND-percent? 1] [:TRIG-create-emitter (new-emitter @{
  :particle (new-particle @{
    :tile (new-tile @{ :ch " " :fg 0 :bg 0xffff00 :bg-mix 0.8 })
    :lifetime 3
    :speed 0
    :triggers @[ [[:COND-true] [:TRIG-lerp-color :bg 0x851e00 "rgb" [:completed-lifetime 2]]] ]
  })
  :lifetime 1
})]]
```
Here things become more interesting.

First, we reset the particle's lifetime, so that it dies three frames later
(without this the particles would die only when reached their target, which can
have the effect of making the explosion seem too even):
```
# :TRIG-reset-lifetime-once takes two arguments: the new lifetime (3), and the
# new age (0).
#
# The "-once" indicates that the lifetime/age will only be set if it's `nil`,
# preventing it from being set on each frame (resulting in the particle never
# dying).

[[:COND-explosion-done-expanding? 1] [:TRIG-reset-lifetime-once 3 0]]
```

Then, we lerp the color from whatever it was before to `0x851e00`, depending on
how close the particle is to death.
```
# :TRIG-lerp-color takes a few arguments here:
# 1. lerp the :bg or the :fg?                            (:bg)
# 2. what color to lerp to?                              (0x851e00)
# 3. what components of the color should be modified?    (all components)
# 4. based on what should the color be lerped: the
#    completed lifetime, completed journey, completed
#    *parent's* lifetime, sine(current_frame_count), or
#    something else?                                     (completed lifetime)
# 5. `:inverse true` is papering over a design mistake.

[
  [:COND-explosion-done-expanding? 1]
  [:TRIG-lerp-color :bg 0x851e00 "rgb" [:completed-lifetime 0.8] :inverse true]
]
```

Finally, we randomly (1% of the time) add a new single-particle-spawning
emitter at the particle's current position, creating an "ember" that doesn't
move and cools down at an uneven rate.

```
# Notice the presence of a second condition here: [:COND-percent? 1], which
# indicates that only if `rand(0, 100) <= 1` the ember will be created.

[[:COND-explosion-done-expanding? 1] [:COND-percent? 1] [:TRIG-create-emitter (new-emitter @{
  :particle (new-particle @{
    :tile (new-tile @{ :ch " " :fg 0 :bg 0xffff00 :bg-mix 0.8 })
    :lifetime 3
    :speed 0
    :triggers @[ [[:COND-true] [:TRIG-lerp-color :bg 0x851e00 "rgb" [:completed-lifetime 2]]] ]
  })
  :lifetime 1
})]]
```

It may seem simple in hindsight, but this effect took several days of wrangling
over the colors to get it to look just right (and realize the need for the
"embers").

Notice in particular that the effect is completely decoupled from the game
effects: in the explosion, for example, particle are not responsible for doing
the job of destroying mobs or eviscerating helpless goblins (which is done
separately, right before the particle effect), only for creating the visual
animations. This approach has both advantages and drawbacks.

- Pro: It vastly simplifies the FFI glue code (the *only* thing the FFI does
  right now is call the animation function with a string argument (specifying
  the effect to use) and a few coordinates), negating the need to allow Janet
  code to check if a certain tile is a wall, if there's a monster at a
  particular coordinate, if there are objects in the explosion which should
  create secondary explosions, etc.
- Pro: it ensures that animations are completely decoupled from gameplay, which
  is a huge help if the game allows the player to have *allies* that could
  potentially walk out of the player's line-of-sight and start fighting. If the
  particle engine were responsible for modifying game state, it would be
  necessary for the animation to play *out of the player's line-of-sight* and
  could introduce unnecessary lag.
- Con: the effects of an particular ability in-game won't match perfectly with
  the ability's animation. This is a non-issue for a simple damage-dealing bolt
  animation, but becomes extremely apparent for explosions, as you have the
  explosion expanding in *empty space* (since the explosion's radius was already
  carved out prior to running the animation). (Just as I wrote this it occurred
  to me that I could remove the "expanding" component of the explosion and
  potentially negate this issue, but I have yet to explore that possibility.)

## Why Janet?

Being my first particle engine, I was at first unsure whether writing a particle
engine in a scripting language would not incur a significant performance
penalty. My fears were unfounded, of course, since due to the nature of ASCII
even ridiculously large effects only need about 800 particles, not the thousands
that might be otherwise required in a 3D game.

But that doesn't really answer the question, after all, I could have easily have
just picked Lua, Gluon, Wren, or other ones of the vigintillions of scripting
languages in existence. My choice of Janet boiled down to a few reasons:
- I was already familiar with embedding Janet in a C program from
  [cel7ce](TODO), and felt it at the time to be more ergonomic than Lua (in
  hindsight, I was wrong, and the "ergonomics" of embedding Lua vs. Janet are
  essentially the same).
- I felt (and still do!) that Janet's prototypes are far more intuitive and less
  clumsy than Lua's metatables and whatever framework one must use in order to
  get them to work right. Janet's prototypes happen to be a massive boon where
  most of the particle engine revolves around just a few classes (`Rect`,
  `Coord`, `Emitter`, and `Particle`), at least for me. I'm sure someone learned
  in the ways of Lua could just as easily write a particle engine in that
  language, but I don't want to have to learn a new OOP framework just for a
  one-month project that I'll only touch occasionally afterwards.

So, was Janet the right choice?

On one hand, Janet's prototypes have definitely helped. Plus, having used Janet
earlier meant I was able to easily port much of the FFI-related code from a
previous C project.

On the other hand, it took some work to ensure Janet could be cross-compiled to
Windows with Zig, involving some trial and error in messing with arcane
`#ifdefs` in Janet's build system. And Janet's prototypes are not perfect, and
have some sharp corners that one must be aware of.

But more importantly, I'm not entirely sure that writing a particle engine in a
postfixed language was an especially bright idea.

To illustrate my point: which is easier to read?

```
(fn [self &]
  (+ 0.15 (/ (+ (math/sin (- (- (* 3 (:completed-journey self)) (/ math/pi 2)))) 1) 2)))

# OR

function (self ...)
  ((math.sin(-(self.completed_journey * 3) - (math.pi / 2)) + 1) / 2) + 0.15
end
```

One might argue that *neither* are, but it's still much easier to figure out
what's going on with the second one.

And this isn't a contrived example -- it's straight from the
`pulse-twice-explosion` animation. Feast your eyes on the air pouring out
scalding bolts of electricity into a helpless adventurer's veins:

![](//tilde.team/~kiedtl/images/rl/particles/elec-explosion.gif)

This isn't to say that I ever intend to rewrite the particle engine in any other
language. It works good enough, despite its flaws, and most of the effects are
write-only anyway. If I had to write it again, though, I would seriously
consider simply doing it in Lua.

But, hey, I like Janet prototypes.

![](//tilde.team/~kiedtl/images/rl/particles/statues.gif)
![](//tilde.team/~kiedtl/images/rl/particles/elec-swirly.gif)
![](//tilde.team/~kiedtl/images/rl/particles/airblast.gif)
![](//tilde.team/~kiedtl/images/rl/particles/elec-bolt.gif)
