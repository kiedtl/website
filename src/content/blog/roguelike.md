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

The main mechanic in this game is modifying and manipulating your
environment in a prison-themed dungeon to distract, confuse, and kill your
former jailers. You can throw poisonous potions, blow up walls, place
landmines, raise corpses, quaff speed-boosters, stab paralyzed enemies,
release fellow prisoners, and do just about anything short of engaging in
what will be an almost-certainly fatal melee combat with enemies that are
simply far, far stronger than you are.

The second mechanic, stolen from Peter Harkins's 7DRL
[Ironwood](https://push.cx/2014/ironwood-a-roguelike-game-in-7-days), is
movement-based patterns to activate various combat bonuses and abilities.
I'm tying these movement patterns to rings that will be scattered throughout
the dungeon. These rings, of which four can be worn at the same time,
activate up to two movement patterns, which are the only way of utilising
magic (which is otherwise unavailable for the player's use).

The project is still in heavy development, but the first few floors are
semi-done. UI is terrible and the log messages may as well not be there,
but it's still mostly playable. Take a look at the
[GitHub](https://github.com/kiedtl/roguelike) repository, or check out
[r/roguelikedev](https://old.reddit.com/r/roguelikedev)'s weekly Sharing
Saturday threads to read updates on this (still unnamed) project.
