+++
title = "Generating ASCII Trees"
draft = false
date = 2022-04-13
template = "blog.html"
+++

# Of Trees And Triggerfish

A day or so ago I spotted a screenshot of [Ultima Ratio
Regum](https://www.markrjohnsongames.com/games/ultima-ratio-regum/), and noticed
the ASCII trees and plantlife. Just look at it:

![screenshot](//tilde.team/~kiedtl/images/urr.png)

It's beautiful.

Instead of using a single symbol (`♣ `, `♠`) to represent trees like other
roguelikes (DCSS for example), it goes the route of Dwarf Fortress and makes
them multi-tile ASCII art. I think it looks better than Dwarf Fortress, though.

![Dwarf Fortress Trees](https://5sl.org/~bretscher/fbTest.001.2.png)

Naturally, I decided I wanted to add this to my roguelike. Nevermind that it's
supposed to be an taking place in an underground city (the heck would trees doing
in a subterrain fortress?). I can just pass it off as a fungal growth
(tower-caps anyone?), and anyway it's a fun way to distract myself from some
important UI work that I'm desperately trying to finish before the end of the
month.

Now, how would I go about implementing this? A pre-fabricated subroom (that can
then be placed inside other rooms at random) wouldn't be a bad choice, but then
I wouldn't be able to get overlapping trees, since the existing prefab subroom
code assumes that you never want overlapping subrooms, *and* that you only want
one subroom in any given room.

It was then that I though of procedurally generating the trees. Shouldn't be too
hard. Just drop a blob of leaves, and stick a trunk in the middle, no?

![screenshot](//tilde.team/~kiedtl/images/trees/trees-blob.png)

{% sidenote() %}

I'm using a Zig port of `createBlob`, a function I stole from
[Brogue](https://github.com/tmewett/BrogueCE)'s source (in `src/brogue/Grid.c`).
It's being used for creating the basic shape of the trees.

{% end %}

Okay... not bad, but having some trunks wouldn't be a bad idea.

We'll choose a tile in the middle of the blob as a trunk, ensuring it's
surrounded by leaves and such. Now:

![screenshot](//tilde.team/~kiedtl/images/trees/trees-trunks.png)

Better, but it's not nearly as good as URR's. Let's try adding arrows, in URR's
style. We'll do this with [Dijkstra's
algorithm](https://en.wikipedia.org/wiki/Dijkstra's_algorithm), starting from
the trunk and working our way outwards to reach all the leaves.  The arrow we
choose will depend on what direction we took to reach that location.

Now, it's looking a little better:

![screenshot](//tilde.team/~kiedtl/images/trees/trees-arrows.png)

However, notice that the clump of trees in the center really devolved into arrow
soup. Let's try putting `<`/`>` around the edges of the trees.

To do this, instead of applying the arrow change immediately, we wait to see if
Dijkstra gives us any children from that node; only then do we apply the arrow
character. In the mean time, we just use `<` and `>` as appropriate (unless it's
directly above or below the trunk, in which case it'd look weird).

Now it's looking a little better.

![screenshot](//tilde.team/~kiedtl/images/trees/trees-brackets.png)

Still, the clumping together makes it look messy. Oh, that's right, let's add
different colors for the trees:

![screenshot](//tilde.team/~kiedtl/images/trees/trees-colors.png)

That's a lot better!

It looks a bit nicer if we add branches, Dwarf Fortress style: instead of
giving an arrow character to a leaf, there's a small chance to turn it into a
branch if it has many leafy neighbors and is adjacent to the trunk.

Behold:

![screenshot](//tilde.team/~kiedtl/images/trees/trees-boughs.png)

Now this is what I'm looking for!

Of course, it doesn't really have a URR vibe to it, but that's more of a
graphics limitation since I'm using the terminal and can't use a custom font.
It's actually a pretty big limitation, as if the player's font doesn't use
right-angle lt/gt symbols or if it has thinner arrows, the results are
disastrous:

![screenshot](//tilde.team/~kiedtl/images/trees/trees-oopsie.png)

There's just not a lot I can do about that, short of creating an SDL frontend
which uses custom sprites (that *will* be done, though... eventually...).

So, if you're playing my roguelike and come across a strange equation with lots of
arrows written out in green ASCII and blocking your vision, well, sorry.

The whole code is
[here](https://github.com/kiedtl/roguelike/blob/master/misc/trees.zig) if you're
interesting in reading 700 lines of spaghetti Zig code. It's MIT licensed, so
feel free to reuse it.

Cheers!
