+++
title = "Building cursed_font"
draft = false
date = 2022-04-08
template = "blog.html"
+++

# Building cursed_font

As part of my relentless drive to realize the Year of the Linux Desktop, I
had created a new bitmapped font about a year back,
[cursed_font](//tilde.team/~kiedtl/projects/cursed). Because there is a terrible
famine for readable, elegant fonts on Linux, obviously.

{% sidenote() %}
**Why bitmapped fonts?** While BDF fonts (and bitmapped fonts in general) are
inferior to vector fonts in many ways (no variadic widths, no ligatures, no
colors for emojis, etc), bitmapped fonts appear much sharper on low-DPI
monitors. On my particular monitor, just about every vector font I'd like to use
(Cascadia, Iosevka, Hack, Fira, Source Code Pro) is unacceptably
blurry.
{% end %}

After its release, I had a few folks asking me what tools I used to create the
font, as well as generate the font screenshots and character maps. Building BDF
fonts is actually much easier than creating a vector font (since you're
basically just placing dots on a grid), and due to the simplicity of the BDF
format (which is a text format) creating the image generation tools was trivial.

## The font editor

I started off creating BDF fonts using [`fnt`](//github.com/mpu/fnt), which is
an ncurses utility. It was horrible: being a "suckless" project, it omits every
feature which could possibly be useful in editing a font, instead presenting you
with a bare grid which you have to use arrow keys (mouse support is bloated,
didn't you know) to manipulate. Not to mention that it doesn't even create a BDF
font, it stores the font in a textual format devoid of any metadata (it expects
the font height/width to be in the *directory name*), which you must then
manually convert to a BDF font via a provided script. Needless to say, it was a
pain to use.

I now use `gbdfed` to edit the fonts. It's nothing close to perfect. It's a bit
unpolished, lacks a few features, making editing font properties unnecessarily
clumsy, and is a bit crash-prone.

![gbdfed screenshot](//tilde.team/~kiedtl/images/gbdfed.png)

However, `gbdfed` much easier to get the hang of than fontforge (at least, that
was my experience.) You literally just start gbdfed, click on a glyph, and click
on a grid to place dots. It's just Nice and Intuitive™. With fontforge, my
monkey brain couldn't even figure out how to create a new bitmapped font without
reaching for a guide. That said, if you're familiar with fontforge, go ahead
using it -- many other bitmapped fonts I've seen out there (such as scientifica
and cozette) do so; bitmapping with fontforge is hardly uncharted territory.

## Screenshot generation

Let's focus on the `charmap.lua` script, which creates an image of all the
glyphs in the font in a nice grid layout.

{% sidenote() %}
I'm going to be assuming that you know Lua for this section; if you don't, feel
free to take a look at how Lua's `gmatch`/`match` functions work (which is used
for splitting strings).
{% end %}

Now, we're just going to read the BDF file, line by line. The font file looks
like this:

```
STARTFONT 2.1
FONT -kiedtl-cursed-medium-r-normal--18-180-75-75-C-90-ISO10646-1
SIZE 18 75 75
// *** font properties elided ***
ENDPROPERTIES
CHARS 654
STARTCHAR char0
ENCODING 0
SWIDTH 480 0
DWIDTH 9 0
BBX 9 18 0 -3
BITMAP
// *** some numbers here, we'll get to that. ***
ENDCHAR
STARTCHAR char0
ENCODING 1
SWIDTH 480 0
DWIDTH 9 0
BBX 9 18 0 -3
BITMAP
// *** more numbers... ***
ENDCHAR
STARTCHAR char0
ENCODING 2
SWIDTH 480 0
DWIDTH 9 0
BBX 9 18 0 -3
BITMAP
// *** more numbers... ***
ENDCHAR
```

Each directive is a single word, followed by one or more space-separated values.
Splitting each line and grabbing the first two words is enough parsing for our
purposes.

```
for line in file_data:gmatch("([^\n]+)\n?") do
    local cmd, arg = line:match("([^%s]+)%s+(.+)")
end
```

Firstly we need the `CHARS` directive, which tells us how many glyphs are in the
font.

```
if cmd == "CHARS" then
    local total = tonumber(arg)
    max = math.floor(math.sqrt(total))
end
```

(The `max` global variable is the maximum width of a row of characters we should
output before starting a new row. You could just make the row a fixed width and
ignore `CHARS` entirely.)

Then, we take a look at each `ENCODING` directive, which will appear once for
each character definition and holds the Unicode codepoint for that character
(`STARTCHAR` is irrelevant as it just holds the "name" of the glyph, which is
pretty useless as far as I can tell...). Then, we can simply output that
character and write a space after it.

```
elseif cmd == "ENCODING" then
    local ch = tonumber(arg)
    if ch ~= 10 then
        io.stdout:write(utf8.char(ch))
        io.stdout:write(" ")
        col = col + 1
    end
end
```

...and then check if we should output a newline and start a new row.

```
if col >= max then
    io.stdout:write("\n")
    col = 0
end
```

([Link](https://github.com/kiedtl/cursed/blob/master/tools/charmap.lua#start-of-content)
to full script.)

I pipe the output of this script to `tools/draw.lua`, which takes a stream of
text (in this case, our charmap) and does the actual work of turning it into an
image.

To do this, `tools/draw.lua` reads the font again. Except this time, we need
to read in more information about the font, such as the height and width.

Start off by declaring some variables to hold the font data:

```
font = {}
font.current = 0
font.data = {}
```

Then, we'll parse the font, line by line, and split it by spaces:

```
for unparsed in font_data:gmatch("([^\n]+)\n?") do
    local line = collect(unparsed:gmatch("([^%s]+)%s?"))
end
```

{% sidenote() %}
`collect()` is a helper function I use to collect an iterator's values (in this
case, `gmatch`) into an array:

```
function collect(...)
    local function _collect_helper(vals, i_f, i_s, i_v)
        local values = { i_f(i_s, i_v) }
        i_v = values[1]
        if not i_v then return vals end

        vals[#vals + 1] = table.unpack(values)
        return _collect_helper(vals, i_f, i_s, i_v)
    end

    return _collect_helper({}, ...)
end
```
{% end %}

`FONTBOUNDINGBOX` is parsed as normal, stuffing the values into the `font`
table. `ENCODING` is stored in `font.current` to keep track of which font glyph
we're reading (recall that a BDF glyph definition takes the form of `STARTCHAR
... ENCODING ... <glyph data> ... ENDCHAR`). Then, for all other numerical
directives, we assume it's a piece of font data, and store it in the array at
`font.data[font.current]`:

```
if line[1] == "FONTBOUNDINGBOX" then
    font.width  = tonumber(line[2])
    font.height = tonumber(line[3])
elseif line[1] == "ENCODING" then
    font.current = tonumber(line[2])
    font.data[font.current] = {}
elseif tonumber(line[1], 16) then
    local nm = tonumber(line[1], 16)
    local len = #font.data[font.current]
    font.data[font.current][len + 1] = nm
end
```

Those numbers which we had read as part of the symbol definition (which were, by
the way, hexadecimal) need to be decoded to reveal the pixel layout: each number
represents a row of pixels, with each bit in the 16-bit number representing a
single pixel (with the highest bits being the leftmost pixels). Just a few lines
of code:

```
for _, n in ipairs(font.data[<glyph>]) do
    -- <snip>

    for i = 1, 16 do
        local pixel_row = <font symbol data>
        if (pixel_row & (1 << (16 - i))) ~= 0 then
            canvas[y][x] = "1"
        else
            canvas[y][x] = "0"
        end

        -- <snip>
    end

    -- <snip>
end
```

{% sidenote() %}
In most fonts I've seen, the pixel data is 16 bits long; however in many
other fonts that are less than 8 pixels wide, it is only 8 bits long, as it
only needs to encode 8 bits of pixel data. Taking this into account will
complicate the above code a bit, and anyway `gbdfed` has only creates
16-bit-wide pixel data as far as I can tell, so I'm ignoring that possibility
here.
{% end %}

The rest of `draw.lua` simply creates a canvas matrix, iterates over each
character piped to it from `charmap.lua`, and draws each character via the
aforementioned method. It then outputs the canvas as a stream of ones and zeros,
which is then turned into a PNG image after some more processing.

That's it! The simplicity of the BDF format makes it very easy to write helper
scripts, like the ones I've reviewed here. I actually have a few other BDF
scripts I use, like one that converts a font to C/Rust/Zig file that I can
import into projects. If this were a vector font I'd have to instead start a
terminal, pipe text to it, and then take a screenshot of it (or something like
that) with an `xdotool` incantation. Yuck.

The Lua scripts are licensed under the Unlicense, so feel free to reuse it for
whatever purposes you need -- especially if you're also creating a font! I'd
encourage you to try creating your own BDF font as well, as a fun exercise.
