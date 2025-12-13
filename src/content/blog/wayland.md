+++
title = "Death to X11"
draft = false
date = 2025-07-04
+++

# Switching to Wayland

Wayland had been on my mind for several years now, ever since I randomly
stumbled onto the `wlroots` repository on GitHub and first learned about the
concept. I never had a use-case, though — Xorg worked just fine for me, and I
had an increasingly large accumulation of little scripts and config files which
assumed an X11 environment.

The push I needed was my beloved [KISS Linux](https://kisscommunity.org). After
a long time away from the project, I finally pulled out an old laptop and
installed KISS, intending to bring it up to par with my main laptop (running
Void). KISS Linux, however, had changed since I last used it along with a
graphical environment: Wayland had gone from being on the banned list of software
(along with `glibc`, SystemD, and `dbus`) to replacing X11, as its creator felt 
it was ready for primetime.

- [KISS Linux Wayland
  update](https://kisscommunity.bvnf.space/archive/blog/20210711a/)

I could have used Xorg on my main laptop and Wayland on KISS, but I figured I
may as well give Wayland an honest shot on both. If what I've heard is true,
Wayland is quite usable as a daily driver, and in theory I shouldn't have too
many issues.

This is not meant to be a comprehensive review of the Wayland ecosystem, nor a
detailed comparison of different window managers. It's just some notes on *my*
(read: not *your*) experience in switching to Wayland, for my future reference
and maybe for anyone finding some of the same issues I'm dealing with.

## Choosing a compositor

When first testing Wayland out, I used Sway as it seemed like the safest, most
boring choice. Sway was a pleasant experience — i.e., pleasantly unsurprising.
The configuration was very easy to setup in a way that mirrored my i3
configuration, and the only issues I encountered had to do with a misconfigured
`seatd`. It's easy to see why Sway has become the "default" choice for Wayland
power users, and I say that with the highest degree of respect.

Sway was not going to be my final choice, though. A few weeks prior, I was
[introduced](https://lobste.rs/s/ejs3uh/future_is_niri) to scrolling window
managers via Lobsters, and it seemed like something interesting to give a shot.

Importantly, I wasn't switching to a scrolling WM out of frustration, but out of
curiosity. Tiling workspaces were sometimes a pain, but I had developed some
effective "coping mechanisms" — like switching to tabbed or stacked layouts when
needed, and using scratchpads extensively. Five workspaces were usually more
than enough for me. My hope was that scrolling would be a way to augment my
tiling workflow, rather than an fresh paradigm that I'd have to learn.

## Status bars

To my great sorrow, I realized halfway through that Polybar does not
[yet](https://github.com/polybar/polybar/issues/414) support Wayland — and quite
possibly never will. I had invested quite a bit of time over the years into my
Polybar configuration, and rewriting all that from scratch was more work than I
had expected to deal with in switching to Wayland.

Some hunting brought me to Waybar, which seems like the "default choice" for
most of Wayland users. I did find yambar, but it's unmaintained.

Waybar was quite straightforward to get going. Something I had been wanting to
try was vertical bars — which in theory should make more sense than horizontal,
especially for a scrolling WM, since window height is always at a premium while
there's plenty of horizontal space to go around. Waybar made this simple task
easy.

![bar](/~kiedtl/images/scrots/bar.png)

One major disappointment is in icon handling. Polybar allows you to explicitly
set the font (and size) used for ramps and modules, while Waybar appeared to
only allow font fallbacks — i.e., try using Font Awesome for a glyph, then Fira
Code, then Arial, then any sans-serif font. This approach works for most I
suppose, but I prefer to use [siji](https://github.com/stark/siji) and
[cursed](https://github.com/kiedtl/cursed) for crisp icons.

The problem? Siji wouldn't load for some reason[^1], and my precious `cursed` font
can't really be used as a fallback, since it has most of the latin glyphs as
well.

I took what was (genuinely!) the easiest solution, and copied the icon glyphs in
`cursed` and `siji` into a separate font, using that along with some Pango
markup to force the icon font to be what I wanted:

```
"format": "<span font-family='cursed_icons'>{icon}</span>\n{used:0.1f}",
```

This also gave me the opportunity to add a few more icons (also easy) and
upscale everything. 

![gbdfed](/~kiedtl/images/scrots/gbdfed.png)

## Locking

`swayidle` and `swaylock` provide a complete package for auto-screen-lock, in an
arguable easier form than `i3lock`. Both worked out of the box, disregarding
some scary-looking warnings about sessions and freedesktop.

Here's the command I use:

```
swayidle -w \
    timeout 300 'niri msg action power-off-monitors' \
    timeout 600 swaylock \
    resume 'niri msg action power-on-monitors' \
    before-sleep 'niri msg action power-off-monitors'
```

## Launcher

My first instinct was to reach for `wmenu`, which seemed the most `dmenu`-esque
launcher for the Wayland scene. Unfortunately, using it was a reminder of how
many patches I had applied to `dmenu` to make it suited for my needs.

The breaking point was when I realized `wmenu` had a way to vertically arrange
items, but no way to then center the window on the screen.

Some investigation brought me to [fuzzel](https://codeberg.org/dnkl/fuzzel).
While I haven't yet fully evaluated it, it does seem a little bit more like what
I was used to with my personal fork of `dmenu`.

In the future I may update this section with further thoughts on `fuzzel`, but
knowing myself, it's a little bit unlikely.

## Theming

In case you couldn't tell yet, I'm one of those folks who has their brain rotted
out by terminal [unixporn](https://reddit.com/r/unixporn) syndrome -- the need
to periodically change their wallpaper, terminal colors, editor theme, statusbar
theme, and (in more advanced cases) their [browser startup] page. Avoiding the
subreddit has partially cured me, thankfully, and the urges only come every ~6
months instead of every 3 days. (Finding real hobbies — combined with landing an
actual job — also helped.)

Still, such urges must be satisfied. Switching to Wayland is not an excuse.
Waybar is an easy matter; defining a pywal template and importing it into
Waybar's config file is all it takes:

```
/* ~/.config/wal/templates/waybar.css

   Stolen from:
   https://github.com/zft9xgy/dotfiles/blob/main/.config/waybar/style.css
*/
@define-color foreground {foreground};
@define-color background {background};
@define-color cursor {cursor};

@define-color color0 {color0};
/* Rest elided */

/* --- --- --- */

/* And then, ~/.config/waybar/style.css: */

@import '/home/kiedtl/.cache/wal/waybar.css';

@define-color mbg mix(@color1, @background, 0.7);
@define-color mfg mix(@color1, @foreground, 0.5);
```

Niri on the other hand is an impossible case, as the configuration format does
not allow either variables or imports. Using GNU `m4` is an option, but I'm not
that desperate.

- [Discussion](https://github.com/YaLTeR/niri/discussions/494)
- [Discussion](https://github.com/YaLTeR/niri/discussions/674)

Instead, I opted for a somewhat cursed workaround: use `sed` to dynamically
replace the colors in the configuration file. Each instance of a themed color is
annotated by the position of the color in the palette:

```
border {
    width 3
    active-color "#7F4216" // @color1
    inactive-color "#656565" // @color7
    urgent-color "#765026" // @color3
}
```

Then, the following script is used to swap the colors out, reading from pywal's
color file (which contains color assignments of the form `color1='#abcdef'`):

```
IFS="="
grep -E 'color..?=' < ~/.cache/wal/colors.sh | \
    tr -d "'" | \
    while read color value; do
        sed \
            -E "s/\"[^\"]+\"(.*@$color)\$/\"$value\"\\1/" \
            -i ~/etc/niri/config.kdl
    done
```

Since niri auto-reloads its config file, no other action is needed.

Swaylock's configuration doesn't seem to allow variables or imports either, but
this was a non-issue since I could just create a wrapper script:

```
. ~/.cache/wal/colors.sh
wall="$(swww query | tr : '\n' | tail -n1)"

swaylock \
    --show-failed-attempts --ignore-empty-password --indicator-caps-lock \
    --hide-keyboard-layout --indicator-idle-visible \
    --layout-text-color "$color15" --ring-color "$color8" \
    --text-clear-color "$color7" --text-caps-lock-color "$color3" \
    --image "$wall"
```

- [Full swaylock
  wrapper](https://github.com/kiedtl/bin/blob/master/x11/myswaylock)

## X11

I still regularly use a few X11-only apps.

- Steam, an obscure game launcher (created by a small Norwegian indie studio
  with no funds for Wayland support)
- HexChat, an IRC client (unmaintained, and GTK2)
- GBDFEd, a bitmap font editor (also GTK2)

Niri recommends `xwayland-satellite`, so that's what I reached for. Configuring
the environment was a little annoying, because it turns out the following won't
work:

```
#!/bin/sh -e
export DISPLAY=:7
xwayland-satellite "$DISPLAY" &
exec niri --session
```

For one thing, `xwayland-satellite` expects a compositor to already be running,
so it was necessary to instead spawn it from Niri:

```
spawn-at-startup "xwayland-satellite" ":7"
```

Also, Niri will automatically clear the `DISPLAY` variable from the environment
for some reason, so another few lines of Niri config were in order:

```
environment {
    DISPLAY ":7"
}
```

There is still one thing I need a full X11 session for: proctored tests
(*because in this world we can't trust adult students to work in their own best
interests*). The proctoring software requires microphone access (check), webcam
access (check), and full-screen sharing (couldn't get this to work in Chromium);
I just open a quick X11 session in another TTY for this.

## Pain points

Niri has no scratchpad, which is incredibly irritating for someone who used it
everwhere in their past life. I was constantly hitting `Mod+Space` and
accidentally switching windows to floating due to muscle memory. Eventually I
rebound that keybinding, but the irritation is still there.

## Enlightenment

It turns out that *columns* are a more natural way of managing windows than the
more general *tiles* concept (at least for me). Niri takes all my existing
workflows and makes it more ergonomic in small, enjoyable ways.

A nice example of this is moving two windows into a column. It's just one
keybinding, `Ctrl+[` (or `Ctrl+]`). In i3, and many other window managers, it's
multiple steps that can vary depending on the tiling "mode" of the workspace.

In the end, I did in fact switch to a scrolling workflow paradigm... mostly. I
still tend to group my tasks with workspaces, since I usually have 3-4 things
going on at any one time — work, hobby projects, freelancing projects, browsing
+ IRC + email + miscellaneous things. Putting them all into one or two
workspaces would just slow me down. However, I have definitely noticed less
"workspace sprawl" where I'd split a task across more than one workspace just so
that I could keep a bunch of windows visible at once.

I would consider the scrolling experiment a success.

![screenshot](/~kiedtl/images/scrots/niri.png)

---

[^1]: At first I figured it must be because it's a `pcf` font (Pango/Harfbuzz
    doesn't support bitmap fonts any longer), but wrapping it in an `otb` didn't
    help at all. Which is strange, since `cursed` is a `bdf` and wrapping it in
    an `otb` works just fine.
