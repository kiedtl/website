+++
title = "A roguelike's architecture"
draft = true
date = 2022-04-06
template = "blog.html"
+++

# A roguelike's architecture

When writing my [roguelike](//tilde.team/~kiedtl/blog/roguelike), I somehow
managed to come up with a very comfortable architecture on my first try, without
reading any sort of tutorials or guides on the topic. I don't really know
whether this method is used in other roguelikes, or whether is is unique to mine
(not very likely), but it has worked well for me over the past year or so, so
I figured I'd share it in case someone is having trouble <TODO: finish sentence>

Firstly, you want to have a constant maximum width and height for your maps, so
that you can declare a global variables like so:

```
pub const HEIGHT = 100;
pub const WIDTH  = 100;
```

If you do want to have some maps that are smaller than others, you can simply
artificially limit the size with a chunk of walls around the edges. Having a
constant dimensions greatly will greatly simplify utility code.

(especially if you're
using a low-level language, since you can then use pre-allocated fixed-size
buffers).

{% sidenote() %}
If you're using a low-level language (like me) and are conscious about large
allocations, having fixed-size maps will be a huge boon indeed, as you can then
declare fixed-size, stack-allocated buffers to hold, say, your FOV or A\* state.
All my mobs have a single `[HEIGHT][WIDTH]bool` FOV field; if my maps weren't
fixed-width, I'd have to hold a vector of coordinates instead, which I'd have to
search through each time I wanted to know if a particular location was in FOV of
that mob.
{% end %}

Now's a good time to determine how many levels deep your dungeon is going to be


Next, we want our global map object to be a matrix of the `Tile` struct.

```
pub const dungeon = [HEIGHT][WIDTH]Tile{};
```


