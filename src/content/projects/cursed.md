+++
title = "cursed_font"
draft = false
date = 2021-04-16
template = "blog.html"
+++

![cursed_font](//tilde.team/~kiedtl/images/cursed/cursed.png)

`cursed_font` is a 9x18 bitmapped font designed for low-DPI screens. It was
originally an embiggened and monospace-ified version of Apple's Chicago
font from System 6, but it also takes inspiration from many other fonts
such as `bizcat`, `ttyp0`, `tamzen`, `scientifica`.

<br>
<img alt="demo" src="//tilde.team/~kiedtl/images/cursed/sdemo.png" />
<br>

One novel aspect of `cursed_font` is the relatively short descenders and
ascenders. Unlike most other fonts, glyphs with an ascending stem are not
as tall as uppercase glyphs. Even more unusual is the lowercase `t` glyph,
which doesn't have an ascender at all, after the Carolingian fashion.
Additionally, since the dotted glyphs for `i` and `j` are obviously
inferior to the undotted variants, those are used instead.

This was done mainly to ensure that any shoulder surfers would be mentally
traumatised for life.

<br>

<img src="//tilde.team/~kiedtl/images/cursed/zf.png" alt="zF code" />

<img align="right" src="//tilde.team/~kiedtl/images/cursed/yeß.png" alt="Yeß?" />

`cursed_font` was designed to be **thick** and with a goal of being easy to
read on poor monitors with minimal eye strain. Whether that goal has been
reached is a matter of debate, as the author is nowhere near being a
competent font designer.

<img src="//tilde.team/~kiedtl/images/cursed/big.png" alt="Large brackets" />

<img src="//tilde.team/~kiedtl/images/cursed/charmap.png" alt="charmap" />
<br>

<img align="right" src="//tilde.team/~kiedtl/images/cursed/const.png" alt="__LINE__" />

`cursed_font` was also designed with viewing source code in mind.
Parenthesis, brackets, and curly brackets all ascend and descend below the
normal boundaries of a glyph, and the sigils for the tilde `~` and the
asterisk `*` are centered instead of being raised. The underscore is placed
on the baseline of the font, instead of under it (seriously, who uses the
underscore character to actually underline text anymore?) and it extends to
the edges, much like a box-drawing character.

<br>

<img src="//tilde.team/~kiedtl/images/cursed/sh.png" alt="rm -rf / --no-preserve-root" />

<img src="//tilde.team/~kiedtl/images/cursed/alpha.png" alt="math" />

<img style="padding-bottom:15px;padding-right:20px" align="left"
	src="//tilde.team/~kiedtl/images/cursed/icons.png" alt="icons" />

Glyphs have been added only for some of the more common mathematical
symbols, but more glyphs will be added in future versions. A large number
of icons have been added for use in status bars and other applications. A
few glyphs have been added specifically for ligatures (ie `[[` and `]]`), but
only a few. More will be added soon.

<br>
<img src="//tilde.team/~kiedtl/images/cursed/scrot.png" alt="screenshot" />
<br>


## Download

You can get `cursed_font` on [GitHub](https://github.com/kiedtl/cursed).
Download a tarball from the releases, extract, and copy the `font.bdf` file
to someplace like `/usr/share/fonts`. Run `fc-cache -f -v` and you're done.


## License

This font and other non-code content (i.e. screenshots) are licensed under
**CC-BY v4.0**. You are free to do pretty much anything with this font as
long as you attribute me.


## Feedback

Kindly send feedback, hate mail, and other `cursed_font`-related
bikeshedding to the author's email at
`a2llZHRsIO+8oCB0aWxkZSBbZG90XSB0ZWFtCg==`, or `/msg cot` on libera.chat.
Any advice on improving the glyphs in this font would be greatly
appreciated.

## Testimonials

```
As a fellow horrible-sight-having person, I appreciate your work.
```

```
<skuzzymiglet> and does your desktop look like that? like, it looks
               super dylanaraps-ey
```
```
 <kiedtl> I think I'm more-or-less done with this font, except for
          some powerline glyphs & accented characters maybe
 <kiedtl> any feedback/advice would be appreciated, I'm not a
          talented font designer :^)
<meff-m-> kiedtl: oh no that picture looks a bit cursed
 <kiedtl> meff-m-: the cursed font. I like it.
<meff-m-> :)
```

<br>
<img src="//tilde.team/~kiedtl/images/cursed/whitescrot.png" alt="screenshot" />
<br>
<br>

---

Below is an old screenshot that you can laugh at, showing a previous
version of `cursed_font`, back when it was just an upscaled version of
`Chicago`.

<br>
<img src="//tilde.team/~kiedtl/images/cursed/oldscrot.png" alt="old screenshot" />
<br>

(If you do want this version, you can find it in the `old/` directory of
the GitHub repository.)
