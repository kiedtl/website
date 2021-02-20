+++
title = "On Shell Replacements"
date = 2020-04-15
template = "blog.html"
+++

# On Shell Replacements

> NOTE: by referring to "shell", I am specifically talking about
> the Korn shell and it's variants, including bash and POSIX shell.

There are now a number of alternatives to the traditional Unix shell,
most notably Microsoft's PowerShell [^1] and the Oil Shell [^2]. These
projects all have something in common -- they attempt to replace the
current Korn shell and it's derivatives (including bash and POSIX shell) 
with a cleaner, more consistent, and (in some cases) fully blown
programming language.

In addition, I've also heard some claiming that an interpreted language
(like Python or TCL) could be usable as a shell with a few `imports`
and other tweaks.

Not that I'm claiming any of the aforementioned ideas are bad, by any
means. Indeed, I can say from experience many of them are quite good.
I had used previously PowerShell Core on Windows and Linux for a while,
and I can assure you that it's a breath of fresh air from the awkward,
inconsistent syntax of traditional shells. [^3]

However, all these projects miss the point. While it would be nice to
have a new programming language replacing shell, shell itself is not,
and was never intended to be used as a scripting language. Rather, shell
should be considered as a clumsy way to string multiple commands
together. "Run this command. Run that command. If it failed, print this.
Set this variable for the duration of this command, and execute it for
every file in this directory." If you need anything more that that,
you probably shouldn't be using shell. [^6] And *even* if that's all
you need, if your script is going to get pretty big, you should
definitely consider writing it in a "proper" language instead. The
reason is that big shell scripts, in my (*somewhat limited*) experience,
can get extremely difficult to maintain. [^5]

Shell has a few important advantages over most scripting languages:

1. **Ubiquitious**: the Korn shell has been around for decades, and has
been standardized into the POSIX specification. POSIX-compliant shells
exist for every major platform, and in the case of macOS and Linux,
come pre-installed. [^6]
2. **Portability**: As long as you don't use shell specific features
(such as the so-called `bashisms`, but which are really `kshisms`),
your scripts are certain to work across multiple shells. [^7]
3. **Speed**: Fine, shell scripts are slow, but they're much faster than,
say, Python. (Just try using the Python REPL on a really slow machine, like a
Raspberry Pi Zero. Python takes ages just to start, while bash, whose own
*documentation* describes as "too big and too slow", starts virtually
instantly. [^8])

To be a good replacement for something, it's important that the replacement
has all the advantages of the program it is replacing. But I still haven't seen
a shell replacement that is portable across all platforms and architectures,
tolerably fast, and is properly standardized. PowerShell is slow and bloated
(since it is written in C#) and does not work on ARM architectures. Oil Shell
is partly implemented in Python, which as we already know, is really, really
show.

### conclusion

If your script is so large or complex that you're considering using a shell
replacement, you may as well use a "real language".

Oil, NuShell, PowerShell, etc. will probably never replace Unix shell, because
they are all either slower or less portable that Unix shell.

---

[^1]: See the PowerShell project [on GitHub](https://github.com/PowerShell/PowerShell).
[^2]: [Oil Shell Homepage](https://www.oilshell.org/)
[^3]: Minus PowerShell's ridiculous `Verb-Noun` verbosity, of course.
[^4]: One alternative I can recommend is TCL.
[^5]: This is mostly due to the fact that all variables are global in
POSIX sh. (Unless of course, you use bash, in which case you can use
the `local` keyword to set the scope of the variable). There are,
however, a number of tricks to get local variables in POSIX sh. E.g.
using subshells, `var=blah command -arg1`, etc.
[^6]: For Windows, a number of POSIX shells exist, including Git Bash,
MSYS(2), WSL1/WSL2, and Cygwin.
[^7]: Except, of course, the non-POSIX ones, like `fish` or `zsh`.
[^8]: See `bash(1)`, section `BUGS`.
