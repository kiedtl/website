+++
title = "my choice of window managers"
date = 2020-01-31
template = "blog.html"
+++

# my choice of window managers

**EDIT**: I've switched to sowm with 2bwm-movement, so this post is just a little bit outdated.

When I first switched to Linux from Windows, I used KDE. When I figured out
that you can't use GNOME plugins in KDE, I gave it up and switched to GNOME.


After spending the first two days trying to rice GNOME, and seeing the
tons of `i3-gaps`-based eye candy on [r/unixporn](https://old.reddit.com/r/unixporn),
I downloaded i3 -- then i3-gaps -- via `pacman` on my Manjaro installation and tried it.
I was hooked, needless to say -- the productivity I experienced by
using a tiling window manager was unprecedented.


For a few months, I was satisfied. And then I found [suckless](https://suckless.org).


Their philosophy in a nutshell:
- software should come with the bare minimal set of features.
- extra features should be provided in the form of patches; it's up to the
user to patch them in.
- configuration should be in the source, supposedly so that lots of noobs don't
clog the mailing list asking for help. hey guys, i cant change the border
color in the suckless terminal,, its still grey but i want it to blue, i removed `#cacbca` and
changed it to `darkblue`, but it wont work can i have some help thanks in advance


After trying out `dwm` in an Alpine environment, I came to the conclusion that
all this mnmlist/suckless stuff just wasn't for me. I had a hard time patching
stuff into st and getting polybar to dock at the top properly in dwm, so I just
switched back to my beloved Arch/i3-gaps setup and continued to post the usual
`I use Arch BTW` garbage on [r/linuxmasterrace](https://old.reddit.com/r/linuxmasterrace).


That all changed, though, when I bought the Raspberry Pi Zero W I'm using to write
this blog post on. It was just slightly larger that my thumb, and could do some
pretty amazing stuff. I installed Arch Linux ARM + i3-gaps on it and was content
for a while.


Eventually, though, I decided to give `dwm` another shot. I cloned Mitch Weaver's
[suckless setup](https://github.com/mitchweaver/suckless), changed the colors to my liking,
and forced myself to use it.


Oh boy.


Now, with `dwm`'s master/slave layout, coupled with the `scratchpad` patch, I was
even *more* productive. I wondered how I survived without `dwm`, especially without the
scratchpad. Weaver had made it extraordinarily easy to apply successive patches to dwm
with his setup, and I highly encourage you to try it. I still use it myself. [^1]


Indeed, recently I had another round of `wm`-hopping, but what made me come back to dwm
each time was it's variety patches and the everlasting scratchpad. I tried spectrwm -- too slow. [^2]
Then I tried `bspwm`: nope, no builtin scratchpad and little or no documentation.
Then `FrankenWM` way too laggy, and... no scratchpad. I tried `2bwm` too, and to be
fair, it was pretty good, but I'm just too addicted to tiling window managers to
make use of it's movement. When `sowm` came out, I grabbed a copy and rewrote almost the
entire thing, adding partial EWMH support in the process. Guess what? I couldn't stand
using *my own window manager* because it wasn't tiling. [^3] `berrywm` as nice,
espcially the smart window placement, but... no tiling. I previously had tried using
Openbox, but once again, the fact that it was floating drove me away. [^4] And in
the middle of this, I added Plan9 movement [^5] to `dwm`, allowing me to use floating
windows easily (when necessary -- I still prefer tiling). [^6]


So -- download `dwm`, add some patches, and give it a shot. Unless you know how
to program in C, I'd recommend using someone else's setup (like Luke Smith's or Mitch Weaver's)
instead of trying to build your own setup from scratch. [^7]


And remember, if you think `dwm` sucks: *default* `dwm` sucks. Give it some love,
and feel free to rewrite the keybindings in `config.h` to suit your taste.



### why tiling?
I'm sometimes asked why I like tiling so much. Here's a non-exhaustive list of reasons:
- windows are automatically arranged; no more messing with individual windows.
- efficient use of screen real estate.
- and anyway, they look cool. especially with the useless gaps 8-)

<br><hr/><br>

[^1]: well, I got sick of having to write a patch for myself every time I want to make
a small change, so now I just do it all manually ¯\\\_(ツ)_/¯ <br>
[^2]: other problems with spectrwm: 1) it has a terrible configuration format; 2) it's very
difficult to customize; 3) spectrwm had it's own darned bar *built in*; 4) it's shockingly
difficult to make spectrwm reserve space for a custom bar.<br>
[^3]: I'm thinking trying out floating with Plan9-esque movement. maybe that will wean me
off of tiling...<br>
[^4]: don't even get me started on Openbox's atrocious configuration scheme.<br>
[^5]: check out these [r/unixporn](https://old.reddit.com/r/unixporn) posts for more information on Plan9 movement: [Grayscale](https://old.reddit.com/r/unixporn/comments/e1r3ft/dwm_grayscale/) by me, [See mom?! Only one hand!!](https://old.reddit.com/r/unixporn/comments/dhs0ha/oc_see_mom_only_one_hand/) by [u/z-brah](https://old.reddit.com/u/z-brah), and [plan 9 feel](https://old.reddit.com/r/unixporn/comments/boi3pl/dwm_plan_9_feel/) by [u/\_viz\_](https://old.reddit.com/u/_viz_).<br>
[^6]: I didn't mention it before, but one of the reasons I prefer tiling is because I don't need to touch the mouse at all (most of the time). However, the Plan9 interface is primarily mouse-based.<br>
[^7]: and while you're at it, why not learn C? it's not that hard to learn.<br>
