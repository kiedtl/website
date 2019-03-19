# Dynamic `i3` Configurations

I've started using with Linux a weeks ago, and since then I've switched from KDE to GNOME to finally i3-gaps. I've customized and re-customized my bars and configs until it actually looks really nice. By dynamic, I mean that I use `pywal` to change the wallpaper/colors to something random on startup.

![current](https://user-images.githubusercontent.com/32681240/54638932-96470d00-4a62-11e9-8ea3-65d2fcafa72e.jpg)

![current](https://user-images.githubusercontent.com/32681240/54639089-ed4ce200-4a62-11e9-8fed-0e91083718dd.jpg)

### Requirements
- admin rights
- python 3+
- polybar
- i3 or i3-gaps
- feh/nitrogen
- a text editor, like `vim`
- some wallpapers
- git

**Note**: this guide assumes that you already have a working polybar/i3 desktop set up.

## Installing `pywal`
First, let's install `pywal`. Run this in the terminal:
```bash
$ sudo pip3 install pywal
```
Make sure it installed properly:
```bash
$ wal -v
wal 3.3.0
```
Now, just to try it out, type:
```bash
$ wal -ei /path/to/wallpapers/
```
If everything works out, you should get output similar to the following:
```
[I] image: Using image space-023.jpg.
[I] theme: Set theme to _home_blah_Pictures_wallpapers_space-023_jpg_dark_None_None_1.1.0.json.
[I] colors: Found cached color scheme.
[I] wallpaper: Set the new wallpaper.
[I] sequences: Set terminal colors.


<pywal prints color scheme here>

[I] export: Exported all files.
[I] export: Exported all user files.
[I] reload: Reloaded environment.
```
...and the background of your desktop should change to something random. The color scheme of your terminal should change also.

Now type `exit` and relaunch your terminal. 

Uh...

You see, the terminal color scheme won't be persisted and it will be reset to the default as soon as you close the terminal. To fix this, add this code to your `.bashrc`:
```bash
(cat ~/.cache/wal/sequences &)
source ~/.cache/wal/colors-tty.sh 
```

Now you can restart your terminal.

## Configuring `i3`
Open your i3 configuration file in your editor:
```
vim ~/.config/i3/config
```
...and add this line to the bottom:
```ini
exec --no-startup-id wal -i /path/to/wallpapers
```
Now a new wallpaper will be randomly picked on startup. Glorious!

## Configuring `polybar`
This is by far the most complicated step and the easiest point to mess up on. This step can also be entirely different depending on how you configured polybar.

> #### **NOTE** 
> If you haven't configured polybar yet, I highly recommend doing so now.
> Clone [this repository](https://github.com/adi1090x/polybar-themes) somewhere and copy the contents
> of `polybar-3/` to where your polybar config is located. Delete or move your default polybar config, 
> and then relaunch polybar by executing the following:
> ```
> $ chmod +x ./launch.sh # first time only
> $ ./launch.sh
> ```
> You will have to modify your `i3` config to reflect these changes and launch polybar
> using this script instead of launching polybar directly.

First, open the file in which the polybar colors are defined. In most normal configs, this will be located in `~/.config/polybar/config`, but if you followed the directions in the sidebar, it will be located in `~/.config/polybar/colors.ini`.

Next, modify the **accent**, **background**, and **foreground** colors so that it looks like this:
```
background = ${xrdb:color0:#222}
foreground = ${xrdb:color7:#222}
accent = ${xrdb:color6:#222}
```

---

Now you are done! To reload `i3` and `polybar` and see the changes, run
```
$ wal -i /path/to/wallpapers/
```
Ahhhhh......

![current](https://user-images.githubusercontent.com/32681240/54638592-cc37c180-4a61-11e9-88d6-d682bb32e8ff.jpg)

![current](https://user-images.githubusercontent.com/32681240/54638826-41a39200-4a62-11e9-8e19-2319567c41f3.jpg)

![current](https://user-images.githubusercontent.com/32681240/54639036-ce4e5000-4a62-11e9-9ad9-216674d05863.jpg)

---

### Sources:
- **`pywal`** - from [here](https://github.com/dylanaraps/pywal/)
- **`wallpapers`** - from [Wallhaven](https://wallhaven.cc/)
