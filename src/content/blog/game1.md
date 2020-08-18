+++
title = "Roguelike: 2020-08-18: Picking a language"
draft = false
date = 2020-08-18
template = "blog.html"
+++

# Roguelike: 2020-08-18: Picking a language

A couple weeks ago I figured that writing a small roguelike would be a good
way to increase my developer skills, so I began planning the game.

The first thing to decide, of course, was what programming language to use.
I had a few requirements:

- I don't really mind if it's an interpreted language, but it had better be
  fast. (and yes, I understand that this isn't really a reasonable
  requirement.)
- Did I mention that it needs to be fast?
  - Note that my definition of "fast" is probably very different from
    yours -- there are some who would describe *JS* as "fast"... My
    definition of "fast" is something along the lines of "if it runs
    flawlessly on my Raspberry Pi Zero W, then it's fast."
- I want **S A F E T Y** -- no worrying about stupid segmentation faults.
- The language should preferably avoid some common foot^Wfaceguns, e.g. the
  `nil`/`NULL` type.
- Either
    1. the language's compiler should be able to cross-compile binaries for
       armv6, or
    2. the language's compiler should be available on most armv6 Linux
       distros. (This includes Raspbian, Void, Alpine, etc)
  In other words, the compiler/toolchain should be portable.
- The language must be fairly stable, mature, and have a good community and
  ecosystem of packages/libraries to choose from.
- The language must have a sane C FFI.
- The language must be cross-platform.
- The language should not require any kind of runtime to be installed.
  (e.g. .NET, JDK, etc)
- It's gotta be a language I either already know, or at least have an
  interest in learning.
- The language should have as little OOP garbage as possible.
- The language should have an `ncurses`-esque library, or a binding to the
  actual `ncurses`.
- Tolerable compile times.

These are the languages I considered (no, seriously, I did consider Java,
stop laughing):

| lang    | 1    | 2    | 3    | 4    | 5     | 6    | 7    | 8    | 9    | 10   | 11   | 12   | 13   |
|:-------:|:----:|:----:|:----:|:-----|:-----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|:----:|
| C       | n/a  | pass | fail | FAIL | pass  | pass | n/a  | pass | pass | pass | pass | n/a  | pass |
| Rust    | n/a  | pass | PASS | PASS | pass? | pass | pass | pass | pass | pass | pass | pass | fail |
| Java    | n/a  | fail | pass | fail | fail  | pass | ?    | pass | fail | fail | fail | pass | pass |
| Zig     | n/a  | pass | PASS | ?    | pass  | fail | pass | pass | pass | pass | pass | pass | ?    |
| C#      | n/a  | fail | pass | fail | fail  | pass | ?    | pass | fail | hmm  | fail | ?    | pass |
| C++     | n/a  | pass | fail | FAIL | pass  | pass | pass | pass | pass | fail | fail | pass | fail |
| Python  | FAIL | fail | pass | fail | pass  | pass | ?    | pass | n/a  | pass | pass | ?    | n/a  |
| Crystal | n/a  | pass | pass | ?    | fail  | fail | pass | ?    | pass | hmm  | ?    | ?    | pass |
| Nim     | n/a  | ?    | pass | ?    | pass  | fail | pass | ?    | pass | fail | ?    | ?    | pass |
| Go      | n/a  | ?    | pass | fail | pass  | pass | pass | meh  | pass | pass | pass | ?    | pass |
| CL      | n/a  | ?    | pass | ?    | fail  | pass | ?    | pass | pass | pass | pass | pass | pass |

NOTE: a question mark denotes a field where I had already disqualified a language
for other reasons, and didn't bother going into that particular issue.

As you may have guessed, I picked Rust.
