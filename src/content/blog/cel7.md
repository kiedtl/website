+++
title = "cel7: a fantasy console-like"
draft = false
date = 2021-11-06
template = "blog.html"
+++

# cel7: a fantasy console-like

We've all seen the popular fantasy consoles like
[PICO-8](https://www.lexaloffle.com/pico-8.php) and its lesser-known ~~dumb
ripoff~~ cousin, [TIC-80](https://tic80.com/). These VM-like programs
typically run small scripts that manipulate a display and a rudimentary
sound system to create tiny games with a very retro-ish feel, in imitation
of real consoles like the SNES. To enhance this retro vibe, these consoles
have some severe limitations: a "token limit" (i.e., a limit on the number
of lexical tokens the script can contain) a maximum of 16 colors,
fixed-size pixel display, 4-channel audio, a limited number of sprites, etc.

![A TIC-80 game](/~kiedtl/images/cel7/tic80.png)

(Screenshot: [Liquid Runner
II](https://technomancy.itch.io/liquid-runner-ii) by
[technomancy](https://technomancy.itch.io))

## cel7

Which brings us to [cel7](https://rxi.itch.io/cel7). It's not really a fantasy
console; its [creator](https://github.com/rxi) describes it as a miniature
framework for creating small games. This is partly true, as cel7 has no "hard"
limits on display or code size (the display can be resized to whatever the
script writer wishes), unlike a true fantasy console. But, it still does have
some interesting limits -- the display is grid-based (i.e., not pixel-based),
with a sprite size of 7x7 {{ fn(n=1) }}; there are only 96 available "slots" for
user-defined sprites {{ fn(n=2) }}, and those sprites may only be two colors at
once (out of an available 16 colors).  Plus, the scripting is not done in Lua,
Javascript, or other garden-variety scripting languages, but with
[fe](https://github.com/rxi/fe), the cel7 author's tiny lisp language.

These unconventional but relatively severe restrictions may initially make cel7
seem like a toy, useless for writing "serious" games, but in my (brief) period
of writing small programs for fun with it, I found these limitations rather
enjoyable. But then again, I'm the one who enjoys writing
[games](/~kiedtl/blog/roguelike) for the terminal...

![Snake cel7 game.](/~kiedtl/images/cel7/snake.gif)

(`demos/snake.fe` by [rxi](https://github.com/rxi) for cel7)

## example

Here's a quick dissection of a `hello world` demo (a slightly more complex
version is bundled with cel7).

```
(= title "Hello World!")
(= scale 7)
(= width 16)
(= height 6)

(= step (fn ()
    ; clear screen
    (fill 0 0 width height " ")

    ; draw "Hello World!" text
    (color 1)
    (put 2 2 "Hello")
    (color 2)
    (put 8 2 "World!")

    ; draw divider
    (color 14)
    (put 2 3 "............")
    (color 1)
    (put (+ 2 (% (ticks) 12)) 3 ".")
))
```

Firstly, we have some *configuration values*: the `(= title ...)`, `(= scale
...)`, etc statements. When the script is run, cel7 reads these values and sets
the window's scale, size, and title to these values.

Then, we have the `step()` function. Like other orthodox fantasy consoles, cel7
also will try to run certain callbacks within the script: `init()` when cel7
starts, `keydown()` when a key is pressed, and `step()` about 30 times a second
(these callbacks aren't required to be there; if they aren't present, no action
is taken).

In this case, the `step()` function does a few things:

- Clears the screen by filling it with spaces (`(fill 0 0 width height " ")`).
- Sets the color to `1` (white) and draws `Hello` at the coords `2,2`.
- Sets the color to `2` (red) and draws `World` right after the previous text.
- Sets the color to `14` (grey) and draws some dots underneath the text.
- Redraws the nth dot with white, where `n == ticks() % num_of_dots` (the
  `(ticks)` API, provided by cel7, returns the number of times `step()` was
  called.

The result:

![hello world gif cel7.](/~kiedtl/images/cel7/hello.gif)

{% sidenote() %}

cel7 does have "memory" like PICO-8, i.e., a byte array that's manipulated to
change the screen, sprites, and other settings. This gives it a more
fantasy-console *feel* despite being a "framework". The memory layout is as
follows (addresses are in hexadecimal):

```
[ unused          | palette | sprites   | display    ...]
0000              4000      4040        52A0
```

{% end %}

## reimplementation

Unfortunately, cel7 seems to be abandoned. No updates have been posted for some
time, documentation is very sparse (there's no docs on the sprite or color
format), and worst of all, there's no source code -- just binaries for Windows
and x86_64 Linux. I had to borrow a friend's Windows machine just to try it out,
as the only computer I have access to at present is an ARM machine.

![cel7 help message](/~kiedtl/images/cel7/cel7-orig-helpmsg.png)

This project intrigued me too much to let it go, though. So, I started an open
source reimplementation termed 'cel7ce' (i.e., cel7 community edition) on
[Shithub](https://github.com/kiedtl/cel7ce). It does everything the organic cel7
does, and some more (it has support for [Janet](https://janet-lang.org), another
obscure minimalistic language) {{ fn(n=3) }}. The goal is to create a more
polished, documented version of cel7 that's (almost {{ fn(n=4) }}) completely
backwards-compatible with scripts written for the original.

Reverse-engineering cel7's undocumented implementation details turned out to be
a lot of fun. Since the default cel7 palette was unspecified, I had to `objdump`
the binary and crawl through the data section looking for specific hex values I
knew were existing colors (extracted from cel7 screenshots), hoping to find the
other colors next to it (I did). I thought I'd have to do something similar for
the sprites and fonts, but happily one of the demos had some code writing a
custom sprite to memory, from which I was able to infer the sprite format after
an hour or so of tearing out my hair.

![bonsai demo cel7ce](/~kiedtl/images/cel7/bonsai.gif)

(`demos/bonsai.fe` by myself for cel7ce)

I had also intended to write a small
[roguelike](https://github.com/kiedtl/vampyre) in Janet with cel7ce for
2021's Autumn Lisp Jam, but just before the jam started I decided to go on
a sabbatical from most of my hobby projects and all internet forums for a
few months. Of course this slowed my cel7ce work as well; but hopefully, if
I'm still around next year, I'll be able to release v1. I'm almost through
with the v1 release -- it just needs a bit more testing and a quite a bit
more documentation.

Cheers!

{{ fnsecstart() }}

{% fncont(n=1) %} Hence the name, `cel7`. {% end %}

{% fncont(n=2) %} These slots are set to the default font, so overwriting these
slots with game sprites means you have to give up that range of characters.
{% end %}

{% fncont(n=3) %} See the [README](https://github.com/kiedtl/cel7ce) for
additional list of new features. {% end %}

{% fncont(n=4) %} cel7ce has some stricter requirements (e.g., sprites cannot be
loaded into memory before init() is run). {% end %}

{{ fnsecend() }}
