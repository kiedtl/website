# on being small

\<rant\>

---

Last year, there was a wave of new software being released in the Linux world
with a focus on being minimal. Much of that software is from Dylan Araps,
the creator of Neofetch and pywal.

The first, KISS Linux, is a musl-based distro inspired by Alpine, CRUX,
and Void Linux. It uses Busybox as it's coreutils (instead of GNU coreutils),
and busybox init as it's init system.

*See also:*   [https://getkiss.org/](https://getkiss.org/)

The second one I'll mention, sowm, is an itsy bitsy floating window manager
in ~200 loc targeted at advanced users.

*See also:*   [https://github.com/dylanaraps/sowm](https://github.com/dylanaraps/sowm)

Not to say that any of this mnml software is bad -- quite the opposite, the
only complaint I have with KISS Linux is that it's package manager hasn't
quite matured enough, so there are quite a few bugs (all of that has probably
changed by now, I haven't used KISS Linux in 4 months now).

However, they each have a fundemental problem: in their quest for being
small and lightweight, they often omit important features.

Take KISS, for instance. By using Busybox, they are avoiding the terribly
bloated GNU coreutils, but at the cost of having to use a non-standard
set of tools. For example, busybox `patch` doesn't support all the options
of GNU `patch`, making it incompatible with scripts or build systems
that need those options.

Or look as sowm. Chances are, if you use polybar (or, depending on your bar
script, lemonbar) then sowm won't play well with it if you
need information on the active window, active workspace, or number of
workspaces (*which is what the majority of bars have*). This is due to sowm
not supporting EWMH, because you see, EWMH is bloat and including support
(even primitive) in sowm would make it not minimal.

I agree that GNU tools are bloated. I agree that ICCCM and EWMH is garbage.
But sometimes, you have to put up with it. How hard would it be to add
just the `patch` tool to the KISS repositories? How hard would it be
to implement JUST `_NET_ACTIVE_WINDOW`, `_NET_WM_NAME`, `_NET_CURRENT_DESKTOP`
in sowm? But no, if you do that, you aren't pure, you're Polluted, and
to hell with you.

---

\</rant\>
