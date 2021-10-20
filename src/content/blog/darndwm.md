+++
title = "I'm done with DWM"
draft = false
date = 2020-05-10
template = "blog.html"
+++

# I'm done with DWM

DWM is a pretty good window manager. Glorious master-slave tiling layout,
builtin floating, hackable source, nice community, great selection of
patches, fast, and **_suckless_**.

Unfortunately, configuration is in the source. I usually don't mind this,
but recently when changing colorschemes I started tweaking the color of my
borders.  It was incredibly annoying to have to stop my X session, change
colors, start dwm, and if I didn't like how it looked, repeat the process.

Also, while the DWM source is very readable and easy to modify (most of the
time, anyway), I don't really like doing casual coding in C, since I have
to worry about buffer overflows and segmentation faults.

I started looking for another window manager.

I tried to install StumpWM, but couldn't compile SBCL. I gave up on it and
decided to try Awesome instead. (After all, it's basically DWM but with a
Lua API added, and I'd far rather do my configuration in Lua than in C,
even if the standard library is a bit sparse. Lua rocks!)

My first impression with Awesome wasn't a good one, mostly due to all the
extra junk it comes with by default (titlebars, infobars, launchers), it
was a bit laggy on my slow hardware. It took me a while to strip it all
out.

Still, I continued, and in a few hours with the help of random SO answers
and the AwesomeWM documentation, I finally had something going. I'm still
not sure if I'll just end up returning to DWM, but let's see how this
experiment goes. I still bunch of stuff I want to do, but since I'm not
familiar with the Lua API it's going to take quite a while.

And now for the screenshot:

![](/~kiedtl/images/scrots/awesome.jpg)
