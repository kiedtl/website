+++
title = "Optimizing A*"
draft = false
date = 2021-08-10
template = "blog.html"
+++

# Optimizing A\*

As I've said in my last post here, I've been working on a
[roguelike](https://github.com/kiedtl/roguelike) for the past three months.
A few days ago I had to stop my feature creep spree and do some
optimizations due to the large lag between turns that I noticed was
steadily increasing. While I knew a good deal of the lag was being caused
by the lighting system (due to the fact that I now use
[Dijkstra](https://byte-arcane.github.io/age-of-transcendence/2021/06/24/let-there-be-light/)
[^1] instead of raycasting to "spread" light around obstacles, a bit like a
poor man's raytracing), I decided to optimize the pathfinding routines
first (which I have also seen to take up a significant chunk of CPU time),
and then implement applicable optimizations in the Dijkstra module [^2].
This post attempts to highlight the optimizations I found helpful and
provide some very basic benchmarks. But first...

### A note on benchmarks

The benchmarks, taken with
[`hyperfine`](https://github.com/sharkdp/hyperfine), are not intended to be
accurate, but are only included to give a basic idea of the benefits of
adding each optimization. Basically, I'm generating a single map in my
roguelike and running A\* 100 times between random coordinates, which means
that a sizeable chunk of the benchmark times you'll see below are being
taken up by none-A\* related code, such as the map generation code.

Now with that out of the way, we can get down to business.

## What is A\*?

Basically, A\* is an algorithm used for finding a path from a starting
coordinate to a goal coordinate, using a user-provided heuristic to quickly
calculate the best path around obstacles. It's widely used in games (*which
corridor should the zombie take to find the player?*) and in many other
areas; I use it my roguelike for just about everything from
validating the generated map (to ensure there are no unreachable rooms) to
finding the best flee path for escaping prisoners.

Here's some very, very basic pseudocode, borrowed from Wikipedia, to give
you an idea of how it works:

```
// Each node has the following structure:
struct Node:
    coord: Coord
    parent: Coord           // Which node led to this node.
    g: integer              // Cost to get to this node from the start node.
    h: integer              // Estimated cost to get from here to the goal.

    method f(self):
        return self.g + self.h

// A* finds a path from start to goal.
// h is the heuristic function, and determines the h score for nodes.
//
function astar(start, goal, h):
    // The open_list holds the explored nodes.
    // These nodes will be re-explored to find available adjacent nodes,
    // and then moved to the closed list.
    //
    // Only the starting node is known at first.
    open_list := []
    open_list.append(start)

    // List of already-processed and discarded nodes.
    closed_list := []

    while open_list is not empty:
        current := the node in open_list having the lowest f score

        if current == goal:
            coords := reconstruct path using parent fields of nodes
            return coords

        open_list.remove(current)

        for each neighbor of current node:
            g_score := current.g + 1

            if neighbor is an obstacle:
                continue

            if neighbor is in the closed list:
                continue

            if neighbor is in the open list:
                open_list_node := past appearance of this node in open_list
                if neighbor's score is higher than open_list_node.g:
                    // open_list_node was reached by a more efficient path,
                    // which is why it has a lower g score. Throw the new
                    // one away.
                    continue
                else:
                    remove open_list_node

             // Record this node.
             new_node := Node {
                 coord = neighbor,
                 parent = current,
                 g = g_score,
                 h = h(neighbor),
             }

             open_list.add(new_node)

        // Now that we've processed the current node, add it to the closed
        // list so we don't process it again later
        closed_list.add(current)

    // Open set is empty, but goal was never reached
    return failure
```

See also:
- [A\* on Wikipedia](https://en.wikipedia.org/wiki/A*_search_algorithm)

## Optimization: Priority Queue for Open List

This very common optimization uses a priority queue for the list of open
nodes, ensuring that the top of the list contains the node with the least
`f` value and negating the need to search the list for the best node on
every iteration.

Old pseudocode:
```
open_list := new List<Node>
open_list.append(start_node)

while open_list.length() > 0:
    // Sort to ensure that best node is last item
    open_list.sort(sort_fn);
    current_node := open_list.pop()
    // <snip>
```

New pseudocode:
```
open_list := new PriorityQueue<Node>
open_list.append(start_node)

while open_list.length() > 0:
    current_node := open_list.remove_first_item();
    // <snip>
```

I had already implemented this ubiquitous optimization, so I'll provide no
benchmarks comparing it with an unoptimized A\* routine.

## Optimization: Matrix instead of Lists

Most basic A\* implementations have a list of closed (aka "already
explored") nodes, which is searched *every time* new nodes are reached to
determine if the new nodes were already explored (and discarded).

Searching the entire closed list is, of course, a costly operation, as the
closed list can easily end up containing the entire map (should there be no
path to the goal), which in my case is 4000 cells. And since new closed
nodes are appended to the end of the list, most of the time the entire
list must be searched.

A good optimization is to store all nodes as cells in a matrix, along with
a field storing the `Open`/`Close` status. Then, the `open_list` priority
queue can store pointers to each node (instead of the actual node
structure) and we can check if `matrix[y][x].is_closed == true` instead of
searching through the closed list.

This is two optimizations in one: we no longer search through the closed
list to determine if a node is already explored, *and* the `open_list`
priority queue needs to copy less data around when it sorts the queue (a
full `Node` structure is 80 bytes for me, but a pointer is just 8 bytes on
a 64-bit platform).

Let's test this out with a benchmark (`tmp/rl-matrix` is our
matrix-optimized version, `/tmp/rl-no-opts` is the unoptimized version):

```
Benchmark #1: tmp/rl-no-opts
  Time (mean ± σ):      3.619 s ±  0.041 s    [User: 1.595 s, System: 0.075 s]
  Range (min … max):    3.584 s …  3.682 s    5 runs

Benchmark #2: tmp/rl-matrix
  Time (mean ± σ):      2.471 s ±  0.026 s    [User: 1.047 s, System: 0.064 s]
  Range (min … max):    2.430 s …  2.494 s    5 runs

Summary
  'tmp/rl-matrix' ran
    1.46 ± 0.02 times faster than 'tmp/rl-no-opts'
```

Allow me to draw your attention to the fact that we just shaved off *more
than a second* by using a different data structure! Huzzah!

## Optimization: Overestimating Heuristic

An A\* heuristic [^3] is said to be *admissible* if it's guaranteed to
return an underestimate of the cost to the goal, and not an overestimate.
Because of the way A\* works, if the heuristic is admissible, the algorithm
will be admissible as well, guaranteed to return the cheapest path to the
goal.

Typical heuristics used are the [Euclidean
distance](https://en.wikipedia.org/wiki/Euclidean_distance) [^4] and the
[Chebyshev distance](https://en.wikipedia.org/wiki/Chebyshev_distance)
functions. Both give the exact cost (and not an overestimate or
underestimate), and are thus admissible.

However, it may be desirable to sacrifice path optimality for speed, which
can be achieved by using an overestimating heuristic. Bobby Anguelov
[explains](https://takinginitiative.wordpress.com/2011/05/02/optimizing-the-a-algorithm/)
it well, so I'll just quote him here:

> ... So what are the effects of using an overestimating heuristic? Well since
> node selection is based on the F cost, an overestimate for the H cost
> will diminish the weight of the G cost and the algorithm will explore
> nodes that have lower H values over nodes that have lower G values. This
> pushes node exploration in the direction of the goal node, rather than
> keeping it roughly centered on the start node. This figure below shows
> the difference between the two heuristic on the total exploration space
> for the A* algorithm.
>
> ![figure comparing explored nodes with admissible heuristic vs overestimating heuristic](https://takinginitiative.files.wordpress.com/2011/05/chapter-5-figures.jpg)

<br>

A good overestimating heuristic is the [Manhattan distance](https://en.wikipedia.org/wiki/Taxicab_geometry), which treats
non-cardinal moves (i.e., northwest, northeast, southeast, etc) as being
two cells away from a source coordinate, instead of being one cell away
like Chebyshev. Here's a comparison of the three distance functions
(pseudocode):

```
difference_x := max(a.x, b.x) - min(a.x, b.x)
difference_y := max(a.y, b.y) - min(a.y, b.y)
difference := Coord { x, y }

// Euclidean (see footnote, don't use)
//
// distance := sqrt(d_x² + d_y²)
distance := sqrt((difference.x  * difference.x) + (difference.y * difference.y))

// Chebyshev
//
// distance := max(d_x, d_y)
distance := max(difference.x, difference.y)

// Manhattan
//
// distance := d_x + d_y
distance := difference.x + difference.y
```

Having non-optimal paths is mostly not an issue for me, so I've implemented
this very easy optimization. Here are the benchmarks:

```
Benchmark #1: tmp/rl-no-opts
  Time (mean ± σ):      3.581 s ±  0.044 s    [User: 1.599 s, System: 0.057 s]
  Range (min … max):    3.517 s …  3.625 s    5 runs
 
Benchmark #2: tmp/rl-matrix
  Time (mean ± σ):      2.529 s ±  0.057 s    [User: 1.072 s, System: 0.063 s]
  Range (min … max):    2.446 s …  2.593 s    5 runs
 
Benchmark #3: tmp/rl-matrix-manhattan
  Time (mean ± σ):     917.9 ms ±  37.1 ms    [User: 265.4 ms, System: 60.8 ms]
  Range (min … max):   886.5 ms … 977.3 ms    5 runs
 
Summary
  'tmp/rl-matrix-manhattan' ran
    2.76 ± 0.13 times faster than 'tmp/rl-matrix'
    3.90 ± 0.16 times faster than 'tmp/rl-no-opts'
```

Nice, 1.6 seconds faster!

## Optimization: Pointers to Parent Nodes

Now for a smaller optimization: what if we stored an actual pointer to the
parent node, instead of the coordinate of the parent? (Obviously this is
only applicable if you're also storing the parent's coordinate.) Two
benefits will arise: the `Node` struct will be smaller (and thus the node
matrix will be more cache-friendly), and we won't have to touch the matrix
when recontructing the path.

So, my Node structure, which looks like this (Zig):

```
const Node = struct {
    coord: Coord,
    parent: ?Coord,      // an optional type, kinda like Option<Coord> in Rust
    g: usize,
    h: usize,
    state: NodeState,
};
```

...becomes:

```
const Node = struct {
    coord: Coord,
    parent: ?*Node,      // an optional pointer, can be null unlike normal pointers
    g: usize,
    h: usize,
    state: NodeState,
};
```

I used Zig's `@compileLog` builtin to check the sizes of the struct before
and after the change. Turns out that we save 24 bytes with this change (80
for the previous structure, 56 for the new structure).

Now for the benchmarks.

```
Benchmark #1: tmp/rl-no-opts
  Time (mean ± σ):      3.591 s ±  0.095 s    [User: 1.577 s, System: 0.054 s]
  Range (min … max):    3.486 s …  3.700 s    5 runs
 
Benchmark #2: tmp/rl-matrix
  Time (mean ± σ):      2.465 s ±  0.032 s    [User: 1.034 s, System: 0.072 s]
  Range (min … max):    2.420 s …  2.497 s    5 runs
 
Benchmark #3: tmp/rl-matrix-manhattan
  Time (mean ± σ):     897.7 ms ±  15.9 ms    [User: 266.0 ms, System: 57.3 ms]
  Range (min … max):   883.1 ms … 922.2 ms    5 runs
 
Benchmark #4: tmp/rl-matrix-manhattan-parent_ptr
  Time (mean ± σ):     871.7 ms ±  20.8 ms    [User: 256.0 ms, System: 63.0 ms]
  Range (min … max):   837.8 ms … 888.3 ms    5 runs
 
Summary
  'tmp/rl-matrix-manhattan-parent_ptr' ran
    1.03 ± 0.03 times faster than 'tmp/rl-matrix-manhattan'
    2.83 ± 0.08 times faster than 'tmp/rl-matrix'
    4.12 ± 0.15 times faster than 'tmp/rl-no-opts'
```

Meh. I'd expected more than 25ms, but it's not too bad.

## Optimization: No Iteration Over Open List

There's still one more case where we iterate over a list: when we check if
the current node is already in the open list. If we find it in the open
list, we check if its `g` value is less than the current one. If it is, it
means that the current node is reaching that coordinate via a more costly
route, and we discard the current node and continue. If the `g` value of
the node already in the open list is greater than the current node's `g`
value, we replace that node with the current node.

However, since our open list is just a priority queue of node pointers now,
we no longer need to remove and update obsolete nodes from the priority
queue, because changing the node matrix's data will do the job. And now
that we've found that we can optimize the replace-and-update operation
away, we can remove the searching operation as well, since we can just
check the matrix to see if the node is open or not.

So, we go from the following code (pseudocode):

```
if matrix[coord.y][coord.x].state == Closed:
    continue

if is_not_walkable(coord):
    continue

cost := find_cost_for_coord(coord)
new_g := current_node.g + cost

new_node := Node{
    coord: new_coord,
    parent: current_node,
    g: new_g,
    h: heuristic(new_coord),
    state: Open,
}

foreach open_list_node, index in open_list:
    if open_list_node.coord == new_node.coord:
        if open_list_node.g < new_node.g:
            continue
        else:
            open_list.remove_index(index)

open_list.add(node)
```

...to:

```
if matrix[coord.y][coord.x].state == Closed:
    continue

if is_not_walkable(coord):
    continue

cost := find_cost_for_coord(coord)
new_g := current_node.g + cost

if matrix[coord.y][coord.x].g < new_g:
    continue

new_node := Node{
    coord: new_coord,
    parent: current_node,
    g: new_g,
    h: heuristic(new_coord),
    state: Open,
}

is_already_in_open_list := matrix[coord.y][coord.x].state == .Open

matrix[coord.y][coord.x] = node;

if !is_already_in_open_list:
    open_list.add(pointer to matrix[coord.y][coord.x])
```

Benchmarks:

```
Benchmark #1: tmp/rl-no-opts
  Time (mean ± σ):      3.661 s ±  0.105 s    [User: 1.624 s, System: 0.061 s]
  Range (min … max):    3.559 s …  3.821 s    5 runs
 
Benchmark #2: tmp/rl-matrix
  Time (mean ± σ):      2.532 s ±  0.046 s    [User: 1.059 s, System: 0.073 s]
  Range (min … max):    2.464 s …  2.590 s    5 runs
 
Benchmark #3: tmp/rl-matrix-manhattan
  Time (mean ± σ):     918.2 ms ±  35.7 ms    [User: 272.8 ms, System: 59.0 ms]
  Range (min … max):   893.2 ms … 980.4 ms    5 runs
 
Benchmark #4: tmp/rl-matrix-manhattan-parent_ptr
  Time (mean ± σ):     897.2 ms ±  19.5 ms    [User: 269.3 ms, System: 57.1 ms]
  Range (min … max):   884.1 ms … 931.8 ms    5 runs
 
Benchmark #5: tmp/rl-matrix-manhattan-parent_ptr-no_ol_iter
  Time (mean ± σ):     694.6 ms ±  14.9 ms    [User: 154.7 ms, System: 62.9 ms]
  Range (min … max):   681.5 ms … 718.9 ms    5 runs
 
Summary
  'tmp/rl-matrix-manhattan-parent_ptr-no_ol_iter' ran
    1.29 ± 0.04 times faster than 'tmp/rl-matrix-manhattan-parent_ptr'
    1.32 ± 0.06 times faster than 'tmp/rl-matrix-manhattan'
    3.65 ± 0.10 times faster than 'tmp/rl-matrix'
    5.27 ± 0.19 times faster than 'tmp/rl-no-opts'
```

That's another 200ms shaved off!

## Optimization: Don't store Node's coordinate

(Added 2021-08-12)

It turns out we can remove the `coord` field from the `Node` struct, making
the node matrix smaller and more cache-friendly. (Thanks again to
[/u/aotdev](https://old.reddit.com/r/roguelikedev/comments/p1w4nn/optimizing_the_a_algorithm/h8jhs91/)
for pointing this out!)

Simply put, since we're storing nodes in a matrix, which is contiguous in
memory, we can calculate the coordinate of a node by subtracting it from
the address of the matrix's first element and doing some division/modulo
operations.

So, the `Node` struct is now just 32 bytes! (Zig):

```
const Node = struct {
    parent: ?Coord,
    g: usize,
    h: usize,
    state: NodeState,
};
```

The following function is used to calculate the coordinates from a `Node`
pointer (Zig):

```
inline fn coordFromPtr(ptr: *Node, matrix_start: *Node, z: usize) Coord {
    const off = (@ptrToInt(ptr) - @ptrToInt(matrix_start)) / @sizeOf(Node);
    const x = off % WIDTH;
    const y = off / WIDTH;
    return Coord.new(z, x, y);
}
```

Benchmarks (earlier ones omitted):

```
Benchmark #1: ./rl-matrix-manhattan-parent_ptr-prechk
  Time (mean ± σ):     890.5 ms ±  16.6 ms    [User: 250.1 ms, System: 67.9 ms]
  Range (min … max):   869.6 ms … 910.2 ms    5 runs

Benchmark #2: ./rl-matrix-manhattan-parent_ptr-prechk-no_ol_iter
  Time (mean ± σ):     678.7 ms ±  26.8 ms    [User: 149.1 ms, System: 69.0 ms]
  Range (min … max):   650.2 ms … 712.8 ms    5 runs

Benchmark #3: ./rl-matrix-manhattan-parent_ptr-prechk-no_ol_iter-no_coord
  Time (mean ± σ):     600.1 ms ±  14.0 ms    [User: 167.5 ms, System: 20.0 ms]
  Range (min … max):   581.2 ms … 617.9 ms    5 runs

Summary
  './rl-matrix-manhattan-parent_ptr-prechk-no_ol_iter-no_coord' ran
    1.13 ± 0.05 times faster than './rl-matrix-manhattan-parent_ptr-prechk-no_ol_iter'
    1.48 ± 0.04 times faster than './rl-matrix-manhattan-parent_ptr-prechk'
```

\~80ms removed. Not bad!

## Closing Thoughts

I've tried the following optimizations:
- Using a priority queue for the open list
- Using a matrix instead of lists to store node data
- Using an overestimating heuristic
- Storing parent nodes as pointers
- Not iterating over the open list
- Not storing the `Node`'s coordinate with the `Node`

And as a result, <s>almost</s> more than three seconds were shaved off
(3.66s vs <s>690ms</s> 600ms).

Of course, there are many more optimizations that you can use, depending on
your map's properties. For instance, if your map's obstacles are completely
static, you might try looking into pre-calculating the distances for your
map's cells. If the cost for each cell in your grid is the same (i.e., you
aren't assigning costs for each cell like I do), you could look into
[Jump-point search](https://en.wikipedia.org/wiki/Jump_point_search), a
modified version of A\*. And so on and so on.

---

[^1]: Hats off to `/u/aotdev` for that tip.

[^2]: A\* is very similar to Dijkstra (the only major difference being the
  presence of the heuristic), so many optimizations used in A\* can be used
  in Dijkstra as well.

[^3]: A heuristic function is called by the A\* algorithm assigns a cost to
  each node explored, depending on how close it is to the goal. A common
  choice for heuristics is to just use the distance between the current
  node's coordinate and the goal node's coordinate.

[^4]: By the way, don't ever use Euclidean distance for an A\* heuristic;
  it can lead to funny results due to rounding errors. Use Chebyshev or the
  mentioned Manhattan distance instead.
