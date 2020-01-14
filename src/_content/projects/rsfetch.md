# rsfetch

rsfetch is yet another information-fetching utility for Linux and BSD.

## (anti-)features
* written in Rust for speed.
* no configuration file (runtime configuration is done via command-line flags).
* no support for arcane OS's (MINIX, AIX, Solaris, etc)
* it's mInImAl
* multiple output styles (`default`, `neofetch`, `minimal`)
* output is easy to parse (when using `minimal` output style)

## usage

Simply execute the rsfetch binary, providing a flag for each information field
you want enabled:

```
$ rsfetch -desk

■────────────────────────■
│ OS       =   void      │
│ KERNEL   =   4.19.89_2 │
│ EDITOR   =   nvim      │
│ SHELL    =   loksh     │
■────────────────────────■
```

Further options can be provided to enable an ASCII logo and/or to disable
bolding, capitalization, etc:

```
$ rsfetch -deskcl

 ┬─┐┌─┐┌─┐┌─┐┌┬┐┌─┐┬ ┬
 ├┬┘└─┐├┤ ├┤  │ │  ├─┤
 ┴└─└─┘└  └─┘ ┴ └─┘┴ ┴

■────────────────────────■
│ os       =   void      │
│ kernel   =   4.19.89_2 │
│ editor   =   nvim      │
│ shell    =   loksh     │
■────────────────────────■
```

A Neofetch-style output mode is provided:

```
$ rsfetch -deskclNuUH@p xbps

    ___     kiedtl@3dot14
   (.. |    os        void
   (<> |    uptime    1d 1h 8m 
  / __  \   kernel    4.19.89_2
 ( /  \ /|  editor    nvim
_/\ __)/_)  shell     loksh
\/-____\/   packages  460 (xbps)
```

Notice that rsfetch does not do any distro detection to automatically display
distro ASCII art, or to auto-detect the package manager. This must be provided
manually.

Should you dislike the default/neofetch output modes that rsfetch provides,
or should you want more control on how the information is displayed
(information order, separator, etc), you may also use rsfetch as the backbone
of your own fetch script.

For example, with the following script:

```
#!/bin/bash

# information buffer
declare -a data

# parse rsfetch output into buffer
while IFS="\n" read -r info; do
        data+=($info)
done <<<"$(rsfetch -deskM)"

# output buffer in the style we want
echo "
 |\___/|   os > ${data[0]}
 /     \   ke > ${data[1]}
/__^ ^__\  ed > ${data[2]}
   \o/     sh > ${data[3]}
"
```

We can format rsfetch's output into:

```
 |\___/|   os > void
 /     \   ke > 4.19.89_2
/__^ ^__\  ed > nvim
   \o/     sh > loksh
```

## installation

You will need:

* GNU Make (optional)
* the Rust compiler toolchain

Retrieve the rsfetch source:

```
$ git clone git://github.com/rsfetch/rsfetch
```

Build and install:

```
# make install
```

Or, if you don't have GNU Make:

```
$ cargo build --release
# install -m755 ./target/release/rsfetch /usr/local/bin/rsfetch
```

## more information
View benchmarks/source on [GitHub](https://github.com/rsfetch/rsfetch).

## license

Licensed under the MIT license. View on [GitHub](https://raw.githubusercontent.com/rsfetch/rsfetch/master/LICENSE).
