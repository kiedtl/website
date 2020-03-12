+++
title = "KISS Linux"
template = "blog.html"
+++

# KISS Linux

I've switched to [KISS Linux](https://k1ss.org), a simple distro focused on
the concept of "less is more". It's basically a musl-based version of CRUX Linux.

Several things I like:

- nice package format.
- incredibly easy to switch out system components (except musl).
- very minimal base install.

Most distros make it very hard to switch out system components for others.

Take Void Linux, for instance.

Try uninstalling `sudo` and using `doas` instead. You'll notice that the package
manager prevents you from doing that, since it's required for the base packages.
KISS, on the other hand, does nothing of the sort.

I've been following KISS Linux since it first came out -- in fact, I was probably
one of the first people to use it. At the time, though, the package manager
was rather incomplete and buggy, so I deleted the partition with KISS on it
and decided to come back to it another day.

IIRC, that was in August 2019, so in January of this year, I created another
partition on my failing hard drive, formatted it, and installed KISS Linux.

The installation process is fairly simple -- if, of course, you've done that sort
of thing before. I think the only problem I ran into was when it came time
to install GRUB, and I had to figure out how to properly mount my `efivars` and
boot partition.

Post-install setup was even easier. Because KISS installs a minimal set of
packages by default, I needed to do a minimal set of trimming afterwards, unlike
Arch Linux or Void. [^1] I think the only tools I replaced was `busybox` =>
GNU `coreutils`, and installing GNU `patch` to replace the default patch utility.

I now maintain several packages in the `community` repo, including `exa`, `fd`,
`hexyl`, `hyperfine`, `rage`, `ripgrep`, `tokei`, and `xmodmap`. Due to how
simple the package system is, it was incredibly easy to get started submitting
packages. I would even go so far as to say it was enjoyable.

Huge thanks to the `#kisslinux` IRC channel, and the Discord channel before it.
Both were an immense help during this round of distro hopping.

<br><hr><br>

[^1]: don't even get me started on "user-friendly" distros like Manjaro.
