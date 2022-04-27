+++
title = "Thoughts on Hare"
draft = false
date = 2021-04-12
template = "blog.html"

[extra]
unlisted = false
+++

{% sidenote() %}
**Update 2022-04-27**: Since writing this post, Hare has undergone many changes,
and has had its first public release. It's more than a year since I last looked
at Hare, so expect this article to be full of outdated information.
{% end %}

# Thoughts on Hare

It seems like every year there's a new wannabe-C-replacement. I do write a
lot of C for hobby projects, so I'm acutely aware of C's many defects (to
name a few: a hacky error handling system, no proper namespacing, no tagged
unions, an absolutely miserable macro system, &c).

Some C replacements I've been interested in are Rust[^1], Zig, Myrddin, and
Drew DeVault's new systems programming language, Hare.

---

Drew has been posting teaser sections in some of his blog posts for a while
now, with snippets of code in his unnamed language showing the progress
that has been made. Sometime ago (I'm not sure exactly when) he made the
sources and [website](https://harelang.org) public, but asks readers to not
share them with anyone.

Because of that, I'm going to ask you, dear reader, to please respect
Drew's wishes and not share this post in any public space. This page is
"unlisted" and won't appear on the frontpage, and I only intend to share
this with those who are already aware of Hare. If you, due to IRC logs,
public [GitHub](https://github.com/kiedtl/website) repositories, or cosmic
rays, find this page, kindly keep it to yourself.

So. Let's see this Hare language website. Cute bunny logo, check.
Beautiful Plan9-esque design, check. Big blue `THIS IS PRE ALPHA` warning
box, check.

> Hare is a statically typed programming language which compiles to machine
> code. It has manual memory management, no runtime, and uses the C ABI.

Manual memory management? check. C ABI? check. No runtime? *Really*? Even C
has a runtime (`crt.S`). I think what Drew means is that there will be no
massive Go/Java-like runtime.

> Hare fits on a 3½" floppy disc. When it's done, you’ll be able to buy a
> floppy disc with Hare on it to support the project.

(from [here](https://harelang.org/floppies/))

Floppy disks, eh? Nice, but more or less useless.

Then we see this code snippet:

```
use io;

export fn main() void = {
        const greetings = [
                "Hello, world!",
                "¡Hola Mundo!",
                "Γειά σου Κόσμε!",
                "Привет мир!",
                "こんにちは世界！",
        ];
        for (let i = 0z; i < len(greetings); i += 1) {
                io::println(greetings[i]);
        };
};
```

Mm, ok. So we have a less ambiguous syntax than C does (`fn main() void`
instead of `void main(void)`). We have a file extension of `.ha`.
`haha.ha`. And we have... suffixes for number literals?  I wonder what that
`z` is in the `0z`. It's probably the equivalent of C's `size_t`. There's
not much else we can tell from this small snippet, though.

<br>

Wait.

<br><br>

Just wait a moment.

<br><br>

What was that right before the `fn main()`? Is that an `export` keyword?
And hey, there's a bunch `use` statements as well! Praise Allah! We have
proper namespacing!! Even if this was the only benefit Hare provided over C
it'd still make Hare worth using, in my humble opinion. No more stupid
function prototypes in header files with an arcane, idiosyncratic macro
syntax.

Alright, that's cool. Let's move on.


> Read the installation steps to get Hare for your system, then read the
> tutorial. To see if Hare is available for your system, consult the
> supported platforms list.

That seems to imply there's a bunch of platforms where Hare isn't
available. Well, we can't expect a new language to support every platform
right from the beginning. Let see...

> # Supported platforms
>
> Hare (will) support a variety of platforms. Adding new (Unix-like)
> platforms and architectures is relatively straightforward.
>
> Hare does not, and will not, support any proprietary operating systems.

I beg your pardon. I take this to mean there will be no macOS or Windows
support. Look, I understand that proprietary OS's suck, but
deliberately choosing not to not support them means you're not going to
replace a *fraction* of the C code that's been written out there. Hell, a
major advantage of using C in the first place is the fact that there are
*battle-tested* compilers *for every imaginable platform on earth*. A
platform *isn't a viable platform* until it has a *C compiler* (Drew
himself notes this in a
[post](https://drewdevault.com/2017/01/30/Lessons-to-learn-from-C.html)
from early 2017). *Sheesh*.

> ## Architectures
>
> | Architecture | Support status |
> |:-:|:-:|
> | x86_64  | ✓Supported |
> | aarch64  | ✓Supported |
> | riscv64  | …Planned |
> | ppc64le  | …Planned |
> | i686  | …Planned |
> | arm32  | …Planned |

Interesting, no `arm32` or `i686` yet?. What compiler backend *are* you
using? Oh, I see, you're using [QBE](https://c9x.me/compile). It's not a
bad choice. You're going to miss out on LLVM's optimisations, you're going
to have to finish up that half baked `aarch64` code, and you're going
to have to write your own code to support other architectures, but hey,
you're going to get some pretty fast compiles and a much simpler compiler
design! As a bonus, you'll get to use C instead of C++!

Hopefully the improvements the Hare developers makes to QBE will be
upstreamed; the project seems to be unmaintained at present.

> ## Operating systems
>
> | Operating system | Support status |
> |:-:|:-:|
> | Linux |  ✓Supported |
> | NetBSD |  …Planned |
> | OpenBSD |  …Planned |
> | FreeBSD |  …Planned |
> | Illumos |  …Planned |
> | Haiku |  …Planned |
> | Plan 9 |  …Planned |

So... you're going out of your way to support Haiku, an arcane and obscure
OS that nobody (and by "nobody", I mean "fewer than ~30 people") seriously
uses, but you're going to leave out Windows and macOS? This would be OK for
any other toy language, but this is a *competitor for C*. Come on, not
everyone who uses proprietary platforms uses them because they *positively
enjoy doing so*; a lot of people I know use Windows or macOS because
they're *forced to do so*. But I digress.

## Hare's future research areas

Hare has a
[list](https://harelang.org/blog/2021-03-30-future-research-areas/) of
language features that will be explored in the future and *might* be added
to the language:

- Borrow checking (really? I'm not convinced this can be done in a
  `[better,more_efficient,less_bloated]` way than Rust does. And hey, wasn't
  this language supposed to be *simple*?)
- Async I/O (well, whatever you do, don't make it a builtin thing
  and ruin the language's elegance like Rust.)
- Closures (Sigh. If only closures weren't so hard.)

## Trying out the language

Now, I could just write a brainfuck interpreter and get away with it, but I
want to write some data structures and push on the standard libraries more
than that. I think I'll write a Nga implementation for
[RetroForth](https://forth.works).  I'll be doing a loose port of
`vm/nga-c/barebones.c`, the minimalist C implementation of Nga.

{% sidenote() %}
For those who are unfamiliar with RetroForth and Nga: RetroForth is a
highly portable, modernised, general-purpose FORTH scripting language, and
Nga is the VM Retro is implemented on.
{% end %}

---

Fast-forward a week or so. I'd spent the last few hours of the that day
figuring this out before going to bed. The next morning, I continued,
running into a slew of compiler quirks and bugs, one of which I submitted
a patch for. Two days later, I still hadn't finished, despite this being the
kind of task which would usually take me an afternoon to complete. One
reason for that would be the fact that Hare is still very, *very* pre-alpha
-- a lot of semantical errors are handled with `assert`'s, so instead of
`Variably-sized arrays stored in the stack are currently unsupported` you
get `harec: src/eval.c:27: eval_access: Assertion 'in->access.object->otype == O_DECL' failed.`. Running into one of these requires peeking into the compiler
and working your way backwards through the parsing code to find out what
caused the error.

Eventually, I just gave up and tried the language out in other ways. I had
some fun implementing `hash::crc*` and `unix::tty::*` in the stdlib and
sending patches upstream.

---

Some thoughts on my experience, in no particular order (a bunch of these
should probably be expected from an immature language and will be outdated
by the time Hare reaches v1.0.):

#### Confusing global syntax

The syntax for global is confusing. You have the following forms:

```
let foo_bar: size = 0z;
const foo_bar: size = 0z;
def FOOBAR: size = 0z;
```

And while it's a bit obvious what the difference between `let` and `const`
is, the difference between `def` and `const` is not apparent. (I'm still
not entirely sure what the difference is, but I believe `def` is something
like `#define` in C.)

#### Lack of documentation

Important topics like function pointers, memory allocation and the standard
library are not being covered by the tutorial or documentation. The
tutorial also lacks depth and meaty examples.

#### Raw Vim tooling

The [Vim](https://git.sr.ht/~sircmpwn/hare.vim) script is a bit unpolished,
as it doesn't recognize some keywords and doesn't add or remove indentation
automatically.

#### Nice "default-value" syntax

In Rust, to create a struct and fill in the default values for each item
you must do:

```
#[derive(Default)]
struct Foo { /* snip */ }

fn myfunc() {
        let x: Foo = Default::default();
}
```

In Hare, you simply do `Foo { ... }`, which is much more concise and readable.

However, this only works for primitives that already *have* default types
-- you can't define the default type for, say, a `struct` like you can in
Rust (by implementing `Default`, I think, I'm not entirely sure).

#### Far too loose syntax for `if`/`else`/`for`

A commonly-cited problem with C's syntax is the fact that the braces for
loops and control-flow statements are optional, enabling a lot subtle
mistakes. Instead of taking care of this problem like any sane language
created in 2020 would, Hare sadly does not.

#### Less undefined behaviour

In Hare, most behaviour that is implementation-defined (or worse,
platform-defined) in C (e.g. overflow) is defined in Hare's spec.

#### Good Unicode support in the standard library

Hare has builtin functions for UTF-8 processing in the `encoding` module,
which is nice (though I haven't personally used it yet, so I'm not sure how
robust it is right now). You even have functions to get properties of
Unicode codepoints in the `unicode` module! In C you'd have to pull in a
separate library like `libutf` or `utf8proc` to do such things.

#### Builtin `len` function

There are many issues with the `sizeof` operator in C:

- It doesn't find the length of an array, it actually finds the number of
  bytes needed to store that element. This can lead to confusion:
  - `sizeof(array_of_int32)` will give you the length of the array *times
    four* instead of the length, because an `int32_t` takes up **four
    bytes** in memory and `sizeof` is telling you the total amount of space
    needed to store it. To get the actual size of the array, you need
    `sizeof(array_of_int32) / sizeof(int32_t)`, which divides the total
    memory size of the array by the size of an `int32_t`.
  - You won't actually encounter the above issue if your array is an array
    of `char`'s, because a `char` is only one byte in size.
  - `sizeof` won't work on dynamically-allocated arrays:
    - `sizeof` is an operator and its result is determined at compile-time.
    - Buffers allocated with `malloc` don't carry a length value.

Instead of reciting cryptic `sizeof` incantations to find the length of a
statically-allocated array, you get a much nicer builtin `len` function:

```
let a = [1, 2, 3];
len(a) // => 3

let buf = alloc([], 2048);  // the memory needed to store 2046 items is
                            // allocated, but the slice itself still has
                            // zero items.

len(buf);                   // => 0

for (let i = 0z; i < 20; i += 1)
        append(buf, 0z);    // Now we increase the length of the array by
                            // adding items to it.

len(buf);                   // => 20
```

#### Checked array indexing

Hare checks indexes to slices and arrays at runtime, so the following would
result in an error, not an incomprehensible segfault that has to be
`valgrind`'d to further reveal its internal mysteries:

```
let foo = [0z, 1z, 2z];
return foo[28];
```

Of course, if you want unchecked slices for performance reasons, you can
have them with the `*[*]type` syntax.


#### No uninitialized variables

A common mistake in C is to declare a variable without an initializer, and
then have an `if`/`else if` statement assign the variable a value without
handling all the edge cases:

```
size_t y;

if (a > b) {
        y = a + b;
} else if (a == b) {
        y = a * b;
}

// What's the value of y if a < b?
```

{% sidenote() %}

This "feature" can be used to implement rand():
```
size_t
rand(void)
{
        // size_t x = 4;
        size_t x;

        // The value of x is undefined now.
        return x;
}
```

{% end %}

Some compilers warn you of this, others don't. Hare avoids the issue by
disallowing all uninitialised variables entirely:

```
// Invalid:
let foo;

if (bar)
        foo = 0;
else
        foo = 89;


// Valid:
let foo = if (bar) 0 else 89;
```


#### Expression-only

In Hare, as in many other languages, most statements, including `if`/`else`,
`match`, and others are expressions that can return a value:

```
// No ternary operator needed!
let x = if (boo()) {
        baz();
} else {
        89z;
};

// In C, this would be something like:
size_t x = 0;
if (boo()) {
        x = baz();
} else {
        x = 89;
}

// Or with the ternary operator in C:
size_t x = boo() ? baz() : 89;
```


#### Nullable pointers

In C, any type that has a `*` following it (that is, a pointer) could point
to `NULL`. In Hare, pointers that aren't `nullable` (a tagged union of that
pointer type and `null`, I think) are guaranteed to not be `NULL`, and
pointers that *are* can only be dereferenced after using a `match`
expression to ensure that they are not. To steal an example from
[here](https://harelang.org/blog/2021-02-09-hare-advances-on-c/):

```
let x = 10;
let y: *int = &x;         // Guaranteed to be non-null
let z: nullable *int = y; // May be null!

*y; // Valid
*z; // Error: main.ha:6:19: Cannot dereference nullable pointer type

match (z) {
        null => abort(),
        z: *int => *z, // Valid
};
```


#### No variable-length arrays

You can't have variable-length arrays. The following leads to a failed
assertion:

```
let sz = os::stat( /* snip */ )?.sz;
let buf: [sz]u8 = [0...];
```

Of course, when I first ran into this I assumed it was just an
unimplemented feature that would be added. Sadly, it seems like there's a
chance of this feature not landing at all:

```
  <kiedtl> Oh, one more thing: variable-length stack-stored arrays will be
           supported, correct? (e.g. in C `int foo[len];`)
<ddevault> maybe, but not likely
```


#### Semicolons everywhere!

This is definitely a non-issue, but why are there semicolons *everywhere*?
(It might have something to do with the fact that Hare's grammar was
designed to be context-free. I'm no compiler designer, so feel free to
correct me on this.[^2])

```
let monsters = [ "mengele", "eichmann", "göring", "höss" ];
for (let i = 0z; i < len(monsters); i += 1) {
        if (is_convicted(monsters[i])) {
                append(death_row, monsters[i]);
                hang(monsters[i]);
                burn(monsters[i]);
        } else {
                abort("unreachable");
        }; // why is this necessary?
}; // or this?
```


#### Casting slices

The unintuitive and error-prone `fread` shouldn't be something one misses
from C, but in this case, I do:

```
// Initialize our array... this will most likely become more ergonomic as
// the language matures.
let buf: []u8 = alloc([], sz);
for (let i = 0z; i < sz; i += 1) append(buf, 0);

// Reading an array of bytes into an array of i32's in Hare.
// Not for children under the age of 18.
io::read(fp, buf[..])?;
let buf_i32: *[*]i32 = (buf: *[*]u8: *[*]i32);

// The same thing, in C:
fread(&buf, sizeof(int32_t), fileLen, fp);
```


#### Copying slices

The slice copy syntax, which means one doesn't have to use `memcpy`, is
really neat:

```
buf[a..b] = another_buf[x..y];
```


#### Lack of range syntax

Hare doesn't have iterators, but a cleaner syntax for `for (let i = 0z; i <
max; i += 1)` (maybe something like `for (i in 0..=max)`) would be neat.


#### Empty `fn`/`if`/`for` statements

The following is invalid in Hare:

```
fn foo() void = {
};

if (test) {
};
```

This isn't common, unless you're debugging and commented out the code for
that statement, in which case it's rather annoying. For function
definitions, you can add `return;` to the definition to mitigate that
issue.


#### Labeled loops

In all the languages I know of, you can't break out of a loop from an inner
loop. With Hare, you can:

```
:outer for (<snip>) {
        :inner for (<snip>) {
                continue :outer;
        };
};
```

I'm not yet sure whether this is a good thing or a bad thing. Sure, you can
do clever shenanigans now, but something tells me this will make the code's
control flow much harder to follow.


#### Tagged unions for error handling

In Hare, you have monadic error handling with tagged unions and error
types. Additionally, one can define their own error types if necessary.

```
use errors;

type myerror = void!;
type error = (myerror | error::invalid)!;

fn foo() (void | error) = {
        foobar()?;
        match (frobnicate()) {
                blah: *size => booze(*blah),
                null => return errors::invalid,
        };
        if (barbaz() && iswhyze()?)
                return myerror;
};
```

One thing I miss is an operator/method that "unwraps" the return value, and
aborts if it's an error -- it's a bit annoying to have to write a `match`
expression when I'm trying to quickly write a test program; I'd rather save
that for later when I come to cleanup whatever I wrote. I think that'll be
added as the language matures, though.

*Update*: As of April 24, the `!` operator (`unwrap()`) is being
implemented in Hare.


#### Lack of generics

One flaw of Hare is *blazingly* obvious: the [lack of
generics](https://harelang.org/blog/2021-03-26-high-level-data-structures/):

> Hare does not support generics, and our approach to data structures is
> much like C: DIY. Hare supports the following basic data structures:
>
> - Slices
> - Tuples
> - Structs and unions
> - Tagged unions
>
> That’s the complete list of aggregate type classes defined by the
> specification. You can build arbitrarily complex data structures out of
> these, but, like C, Hare puts the ball in your court. For most of your
> application’s day-to-day data processing needs, these types are
> sufficient, shunting data from A to B without much fuss. For most of your
> data processing, these limitations will not be your bottleneck, and
> simpler (but slower) data structures won’t have much of an impact on your
> program.

Mhm. Thank you so much. I'm going to be just so bloody *thrilled* when it's
time to convert my eighth `HashMap` implementation, ripped out from three
other projects of mine, from `<string, i32>` to `<string, i8>`.  And this
bastard of a language doesn't even leave me with a crippled
search-and-replace macro system to help me with this in the smallest
way.[^3] I could use `void *` pointers as in C, but hell, if I enjoyed
doing that I'd just use C instead.

tl;dr Regarding generic data structures, Hare "puts the ball in your
court", which is a neat euphemism for "forces you to reinvent the wheel".


#### No functional programming

```
[me whining about how Hare doesn't have a pipe operator]
<ddevault> hare is not new haskell
  <kiedtl> ddevault: I guess this isn't the place to litigate this, but
           adding an operator like that doesn't mean you have to add traits,
           houses of cards^Wtypes, and other haskell abominations :V
<ddevault> hare's design ethos is to be _simple_, kiedtl
  <kiedtl> Well, if Hare's definition of "simple" is "No functional
           programming concepts, just the bare minimum to make C palatable
           in 2021", then yeah, I guess :V
<ddevault> yes, that is hare's definition of simple
  <kiedtl> Got it
<ddevault> functional programming can never succeed as a systems programming
           paradigm
  <kiedtl> I'd like to prove you wrong :)
<ddevault> it obfuscates too much of what's going on from the programmer
<ddevault> no
  <kiedtl> I think it makes it clearer and more concise, but that's my
           opinion :)
  <kiedtl> Well, myrlang is a thing. Too bad it's unmaintained.
<ddevault> it makes expressing your intent clearer and more concise
  <kiedtl> Oh, I see what you mean
<ddevault> but systems programming is not about expressing your intent and
           letting the compiler figure out the how
<ddevault> systems programming is about the how
  <kiedtl> Thanks, your view is clearer now :)
```

That's fair, I guess (except the pipe operator thing -- it's just syntax
sugar, for heaven's sake). I'm just a bit confused about why *closures* are
a "future research area" but anonymous functions won't be added:

```
  <kiedtl> So, closures is a "future research area" for hare, meaning that it
           *might* be implemented in the future, ...but Hare won't have "bare"
           anonymous functions (that don't capture their environment)?
<ddevault> no, probably not
```

*Update*: Drew has clarified his view:

```
<ddevault> simpler to add, but with less utility
<ddevault> and having two things is more complicated than having one thing
```

<s>And, for the record, I agree with him. In a language without
<code>map</code>, <code>reduce</code>, and other generic high-order functions,
anonymous functions don't really serve much of any purpose.</s>


#### Strong typing

Unlike C, in Hare one must do a lot of explicit casting between types,
making it significantly harder to slash your left thumb off while trying to
dereference an `int` cast as a `struct foo *`.


#### Subtyping

In some modules in the standard library (see: `hash::adler32`,
`hash::crc32`, &c) a technique called "subtyping" is used, where struct B,
who's first member is a struct A, is cast as that struct A to properly
conform to an interface. It's supposedly common in C (that's what I was
told in `#hare`, anyway), though this is the first time I'm encountering
it.

It's not really an issue with the language itself, but it did make quite an
ugly impression on me.


## Conclusion

Hare is still a young language, and some of my criticisms of the language
will be out of date before long. But the main issue is that while Hare
could've been a very promising language, like the Gemini Protocol[^4], it
seems to have taken its goal of simplicity a bit too far.

To return from the IRC quote from earlier, yes, systems programming **is**
about the *how*, but *only to a certain extent*! I'm sure everyone agrees
with this, but everyone sets a different line. Drew DeVault says "no FP
stuff or high-order functions" and sets that as the boundary; yet he allows
the existence of a well-fed standard library that includes *hashes* and
*streams* and, goodness, *Unicode*! that all hide what's going on from the
programmer. That's the almost the *definition* of a function, a *chunk of
reusable code* that *hides from the programmer* what's going on!

And, yes, everyone has different opinions. In my opinion, as someone who's
too used to there being at least `foldl` in a language's standard library
(I am a spoiled brat), FP stuff is *not* unsuited to a systems programming
language; in Drew DeVault's, it is. Whether Hare gains widespread use all
depends, in the end, on how many developers side with me and how many agree
with Drew.[^5]

Then again, none of these omissions (except for the lack of generics,
maybe) really cripple the language in any way.  I probably wouldn't choose
it for a large project, but for small ones, Hare strikes a nice balance
between simplicity and power. Who knows, for small utility programs that I
know won't be running on non-Linux OS's anyway, I might just end up using
this.

The real question is, does Hare have an business existing when Zig and
[Myrddin](https://myrlang.org) already exist? I don't know, I
barely know either of them. I was planning to implement Nga in both of
those as well and to draw a lengthy comparison between the three, but I
think I'll save that for a future post.

Cheers!

---

Note: If I still exist by late 2022 (not likely), when Hare is supposed to
reach v1.0, I'll be updating this post.

---

[^1]: Yes, I know that Rust is a C++ replacement, not a C replacement. What
  I mean by that is that I use Rust in the same places I'd normally use C.

[^2]: I mean; it should be possible to build a context-free grammar
  without semicolons, right (see Lua); I do sometimes wonder if programmers
  who enjoy this syntax also talk like that in real life;

[^3]: A certain blogger in the Geminispace states:

  > Generics are way overrated.  Like any feature, generics /can/ be the
  > most elegant solution for some problems, but they’re needlessly complex
  > for most applications, and they tend to be way overused (right
  > alongside overloading in C++).  They add way too much complexity to
  > both the compiler and the resulting object code to be worth the minor
  > advantages it provides IMO.

  While I do agree with the first part (except the C++ example -- just
  about every C++ feature is needlessly complicated and overused!) I beg to
  disagree with the latter. Generics *done right* doesn't *need* to add a
  lot of complexity to the compiler, and shouldn't add any to the resulting
  binary (except, maybe, a slightly larger size). Generics are, after all,
  just *templates* for functions and all the compiler should be doing is a
  glorified *search and replace operation* to condense that template into
  crystallized code.

[^4]: Before I get swamped with hatemail from the usual crazed Gemini
  fundamentalists, I promise I'll condense my criticism of Gemini into a
  more constructive form in a future post.

[^5]: I do suspect that there will be a group of hardcore Hare users, who,
  like the many Rust fanatics they despise, will be completely impervious
  to any outside criticism. (No, that's not aimed at anyone currently
  using/working on Hare.)
