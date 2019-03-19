# linux @ kmach

My laptop currently runs [Manjaro](https://manjaro.org), a user-friendly version of Arch Linux. It uses i3-gaps with a custom configuration and i3locks-fancy as its lock mechanism. For the terminal, I use [Alacritty](https://github.com/jwilm/alacritty) with ZSH and sometimes PowerShell. For the shell prompts, I use Oh-My-ZSH for ZSH and [Pshazz](https://github.com/lukesampson/pshazz) for PowerShell.

```
kiedtl@kmach
------------
OS: Manjaro Linux x86_64
Host: ************
Kernel: 4.19.28-1-MANJARO
Uptime: 2 days, 5 hours, 27 mins
Packages: 1472 (pacman), 15 (snap)
Shell: zsh 5.7.1
Resolution: 1920x1080, 1920x1080
WM: i3-gaps
Theme: Flat-Remix-GTK [GTK2/3]
Icons: Adwaita [GTK2/3]
Terminal: alacritty
CPU: Intel i3-8130U (4) @ 3.400GHz
GPU: Intel UHD Graphics 620
Memory: 5417MiB / 15916MiB
```

I use [polybar](https://polybar.github.io) for the status bar and [Vivaldi Snapshot](https://vivaldi.com) as my browser.

<picture>
  <source srcset="/images/linux.webp" type="image/webp">
  <source srcset="/images/linux.jpg" type="image/png">
  <img src="/images/linux.jpg" alt="desktop">
</picture>

<picture>
  <source srcset="/images/vivaldi-scr.webp" type="image/webp">
  <source srcset="/images/vivaldi-scr.jpg" type="image/png">
  <img src="/images/vivaldi-scr.jpg" alt="desktop">
</picture>

Running three instances of Vivaldi and one instance of Dolphin and Alacritty each, my CPU usage is surprisingly light - a maximum of 25% usage and a minimum of 15% usage. RAM usage is around 5500 MB and the core temperature is less than 40&#176;C.

It sounds strange, but I use three different text editors, depending on what I am editing. For .NET, HTML, CSS, JavaScript, and other miscellaeneous tasks, I use Visual Studio Code. For Rust, shell scripts, PowerShell, I use Spacemacs. For very quick tasks where I don't like to waste time starting up the editor, I use SpaceVim.

<picture>
  <source srcset="/images/screenshot-editors-1.webp" type="image/webp">
  <source srcset="/images/screenshot-editors-1.jpg" type="image/png">
  <img src="/images/screenshot-editors-1.jpg" alt="desktop">
</picture>

I've also configured i3-gaps to automatically set the wallpaper and terminal colors on startup. I have a directory of favourite wallpapers and use [pywal](https://github.com/dylanaraps/pywal) to do the job.

<picture>
  <source srcset="/images/screenshot-laptop-3.webp" type="image/webp">
  <source srcset="/images/screenshot-laptop-3.jpg" type="image/png">
  <img src="/images/screenshot-laptop-3.jpg" alt="desktop">
</picture>

---

### Other Screenshots

- **Content**
    - **gotop** (far left)
    - **cmatrix** (top middle)
    - **neofetch** (bottom middle)
    - **pipes.sh** (far right)

<picture>
  <source srcset="/images/screenshot-laptop-1.webp" type="image/webp">
  <source srcset="/images/screenshot-laptop-1.png" type="image/png">
  <img src="/images/screenshot-laptop-1.png" alt="desktop">
</picture>

---

- **Content**
    - **peaclock** (top right)
    - **neofetch** (bottom right)
    - **spacevim** (left)

<picture>
  <source srcset="/images/screenshot-laptop-2.webp" type="image/webp">
  <source srcset="/images/screenshot-laptop-2.png" type="image/png">
  <img src="/images/screenshot-laptop-2.png" alt="desktop">
</picture>

---

- **Content**
    - **alacritty**
    - **cmatrix** (all windows)
    
<picture>
  <source srcset="/images/screenshot-laptop-4.webp" type="image/webp">
  <source srcset="/images/screenshot-laptop-4.jpg" type="image/png">
  <img src="/images/screenshot-laptop-4.jpg" alt="desktop">
</picture>

---

- **Content**
    - **alacritty**
    - **neofetch**

![](https://user-images.githubusercontent.com/32681240/54638932-96470d00-4a62-11e9-8ea3-65d2fcafa72e.jpg)

![](https://user-images.githubusercontent.com/32681240/54639089-ed4ce200-4a62-11e9-8fed-0e91083718dd.jpg)

![](https://user-images.githubusercontent.com/32681240/54638592-cc37c180-4a61-11e9-88d6-d682bb32e8ff.jpg)

![](https://user-images.githubusercontent.com/32681240/54638826-41a39200-4a62-11e9-8e19-2319567c41f3.jpg)

![](https://user-images.githubusercontent.com/32681240/54639036-ce4e5000-4a62-11e9-9ad9-216674d05863.jpg)


### Sources
- **`dotfiles`**: [https://github.com/kiedtl/dotfiles](https://github.com/kiedtl/dotfiles)
- **tutorial**: [right here](http://kiedtl.surge.sh/blog/006-dynamic-i3-config)

###### &#xA9; Kied Llaentenn (@kiedtl) 2019
