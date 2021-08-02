+++
title = "Making a Roguelike"
draft = false
date = 2021-08-01
template = "blog.html"
+++

# Making a Roguelike

I've been working on a roguelike for the past three months (since May 1,
2021), making this sideproject the one I've worked on the longest before
losing interest. It's a reboot of my last attempt, which stalled last year
due to overengineering, bad design choices, and extremely unrealistic
goals.

> For those who don't know what a roguelike is:
>
> The definition is being stretched farther and farther each year, but for
> the most part "roguelike" remains a game genre characterized by 2D
> gameplay, simulationistic environments, and turn-based mechanics.
>
> Look up DCSS, Brogue, or Cogmind to see some examples.

![empty room](//tilde.team/~kiedtl/images/rl/jul16-mapgen-lit.png)
<br>

The main mechanic in this game is modifying and manipulating your
environment in a prison-themed dungeon to distract, confuse, and kill your
former jailers. You can sneak in unlit areas, throw poisonous potions, blow
up walls, place landmines, raise corpses, quaff speed-boosters, stab
paralyzed enemies, release fellow prisoners, and do just about anything
short of engaging in what will be an almost-certainly fatal melee combat
with enemies that are simply far, far stronger than you are.

The second mechanic, stolen from Peter Harkins's 7DRL
[Ironwood](https://push.cx/2014/ironwood-a-roguelike-game-in-7-days), is
movement-based patterns to activate various combat bonuses and abilities.
I'm tying these movement patterns to rings that will be scattered throughout
the dungeon. These rings, of which four can be worn at the same time,
activate up to two movement patterns, which are the only way of utilising
magic (which is otherwise unavailable for the player's use). To quote Peter
Harkins:

> I had also wanted to have special abilities activated by moving
> particular directions. So stepping forward against a guard, then right,
> then forward again might execute a throw or a magic attack. The player
> would sort of end up dancing around the guards to trigger various
> abilities, so the terrain or the enemy's movement patterns would limit
> what special abilities you could use on them.

![view of laboratory level](//tilde.team/~kiedtl/images/rl/jul30-lab-view.png)
<br>

The project is still in heavy development, but the first few floors are
semi-done. UI is terrible and the log messages may as well not be there,
but it's still mostly playable. Take a look at the
[GitHub](https://github.com/kiedtl/roguelike) repository, or check out
[r/roguelikedev](https://old.reddit.com/r/roguelikedev)'s weekly Sharing
Saturday threads to read updates on this (still unnamed) project. Maybe, if
I still exist by this time next year (not at all likely), this project
will be halfway done.
