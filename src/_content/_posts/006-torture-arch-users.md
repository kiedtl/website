# Annoy an Arch user

*2019-03-23 - 2019-03-31*

> BTW I use Arch

Add this script to their `bin/` folder and name it `pacman`:
```bash
#!/bin/bash
printf "bash: pacman: command not found\n"
```
Add this script to somewhere in their `$PATH` and name is `sudo`:
```bash
#!/bin/bash

user=$(whoami)
attempts=0
trap 'printf "\nsudo: ${attempts} incorrect password attempts" && exit 1' EXIT
while :
do
    printf "[sudo] password for %s: " $user
    read -s pp
    printf "\nSorry, try again.\n"
    attempts=$(($attempts+1))
done
```
Add to their shell's profile if they use `i3` or `i3-gaps`:
```bash
killall -q compton
```
