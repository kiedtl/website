# Useful tools

An ever-updating list of tools and programs that I find useful:

### Operating systems
- Linux ;)
	- **Pro**: no forced updates.
	- **Pro**: no forcibly installed junkware (cOrTaNa, OneDrive, Candy Crush Saga)

### Distros
- [Arch Linux](https://archlinux.org)
	- **Pro:** awesome pacman package manager
	- **Pro:** rolling release (you're always using the latest version!)
	- **Pro:** great community
	- **Pro:** you get to say that yOu UsE aRcH bTw
	- *Con:* Arch uses `systemd`, and there's no way to change that.
	- *Con:* Arch uses `glibc`, and there's no way to change that.
	- *Con:* Arch uses GNU Coreutils, and it's difficult to change it to, say, Busybox.

- [KISS Linux](https://getkiss.org)
	- **Pro:** Ruggedly mnmlist mentality.
	- **Pro:** Easy to switch out system components with others, unlike Arch.
	- *Con:* package manager hasn't had quite enough time to mature, and doesn't have many features.
	- *Con:* very few packages are in the repositories, meaning you're going to take the
	  time to package them yourself, which wouldn't be that difficult, only KISS Linux's
	  package format absolutely sucks.

- [Void Linux](https://voidlinux.org)
	- **Pro:** Runs on many architectures.
	- **Pro:** Ability to choose between `glibc` and `musl`.
	- *Con:* package manager isn't all that great.

- [CRUX Linux](https://crux.nu)
	- **Pro:** glorious package manager and package format. Both are extraordinarily simple to use
	  and hack.
	- **Pro:** extremely simple by default.
	- **Pro:** easy to setup you're own package repository (necessary, since like KISS, no
	  that many packages exist in the repos).
	- **Pro:** merely mentioning that you use CRUX moves you up in the world of (SFW) [r/unixporn](https://reddit.com/r/unixporn).
	- *Con:* not rolling release. Many will disagree, but I like to keep things "fresh".
	- *Con:* sparse community. not that many people use it, sadly.
 
### Window Managers
- [`dwm`](https://dwm.suckless.org/)
	- **Pro:** configuration is in the source. This is precisely what makes `dwm` so extensible:
	  the fact that the configuration is a part of the source means that you can call custom
	  C functions from your config and from X.
	- **Pro:** dynamic. Don't like tiling? `dwm` has floating builtin.
	- *Con:* hard to patch for newer users. Many users (me included) found `dwm` hard to use
	  due to the fact that it ships with a minimal set of features, and patches must be applied
	  to use certain features (such as a scratchpad). I recommend using [Luke Smith's setup](https://github.com/LukeSmithxyz)
	  as a starting point, and to build up from there. Optionally, you can use [Mitch Weaver's setup](https://github.com/mitchweaver/suckless),
	  or, better yet, [my setup :-\]](https://github.com/kiedtl/suckless).
	- *Con:* nasty community. Made by a group who call themselved sUcKlEsS, almost the entire
	  community is dominated by a bunch of bigoted jackasses.
	- *Con:* because the config is in the source, you have to recompile and restart your X session
	  for changes in the configuration to take effect. This isn't bad, unless you're fine-tuning your tiling gaps.
	- *Con:* default bar sucks. Don't argue with me, it sucks, it sucks horribly, and nothing will change that.
	- *Con:* Polybar doesn't work too well with it by default. Usually, you'll have to add `override-redirect = true` to
	  you're Polybar config. Sometimes it's worse.

### Terminals
- [`alacritty`](https://github.com/jwilm/alacritty)
	- **Pro:** GPU rendered, making it blazingly fast - provided, of course, you have a good GPU
	  in the first place.
	- *Con:* if you don't have a good GPU, alacritty sucks.
	- *Con:* configuration is in YAML, which really sucks.

- `xterm`
	- **Pro:** it just works.
	- *Con:* very bloated, at about 65K lines of code. Compare to `st`, which is 8K loc.

### misc
- `loksh`: an implementation of the Korn Shell that's way better than `bash`. `bash`: 1.1M, `loksh`: 241K
- [`ly`](https://github.com/cyglom/ly): a minimal console-based display manager that, as a bonus, has a cool DOOM animation.
- [`slock`](https://tools.suckless.org/slock): the simplest lockscreen that I know of.
- [`donsk`](https://github.com/lptstr/donsk): an extremely simple static site generator. You're previewing it right now.
- [`lcharmap`](https://github.com/lptstr/lcharmap): a little utility like the Windows `charmap.exe` ported to Linux.
- [`rsfetch`](https://github.com/rsfetch/rsfetch): a blazingly fast (<5ms) fetch program.

### Programming languages
- `C`: yep, raw C is can be pretty useful on many occasions.
- `Rust`: best described as a modern version of C++ obsessed with memory safety.
- `V`: I still don't have much experience with it yet, but when it matures, this is definitely one language I'm going to
  master.
- `PowerShell`: not quite a shell - more of an interpreted language often mistaken for a shell.
