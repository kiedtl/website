+++
title = "Status update: 2020-05-20"
date = 2020-05-20
template = "blog.html"
+++

# Status update: 2020-05-20

That Emacs experiment didn't go so well. Frankly, I was rather impressed
with org-mode and Evil, but startup times were dismal. I don't want to wait
even two seconds for `vim` to start, let alone the ~5 seconds it takes
Emacs. (On my Rasberry Pi it was even slower -- almost 30 seconds(!))

## DWM

And DWM? I began writing my Xresources patch, only to find that one existed
on `suckless.org`, under the name of `xrdb`. It took a bit of work to apply
it, but in the end I was able to simply hit <kbd>Super+r</kbd> to reload my
configuration.

It worked perfectly, until it didn't. DWM began to randomly crash, and I
could only fix it by reverting the `xrdb` patch. I gave up and decided to
give `2bwm` a shot.

As before with AwesomeWM, I'm not sure how long this 2bwm experiment will
last, but so far I'm *very* favorably impressed. 2bwm is a floating window
manager, but it's unique set of keybindings mean that it can be easily used
as a tiling window manager. The whole thing is very fast and feels snappy,
even on my Raspberry Pi. And hey... two borders!!

![2bwm scrot](/~kiedtl/images/scrots/2bwm.jpg)

## `chue`

C is a great language, but I miss the nice standard libraries of .NET and
Rust, especially the non-null-terminated `String` implementations, as well
as the linked list, and vector/resizable array classes.

So, I created [`chue`](https://github.com/lptstr/chue), which is a little
utility that takes a list of colors from a file or stdin, and outputs it in
truecolor. `chue` will internally use a linked list/string implementation
that I've built, as well as a sum-type error handling system similar to
Rust's `Result<T, E>`. If all goes well, I intend to add the linked list,
string, and error handling code to
[ccommon](https://github.com/lptstr/ccommon) (my collection of
project-independent C utility functions), which I can then use in any
project.
