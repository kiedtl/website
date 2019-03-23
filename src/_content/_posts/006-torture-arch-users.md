# Ways to torture Arch Linux users

*2019-03-23*

> BTW I use Manjaro

1. Add this script to their `bin/` folder and name it `pacman`:
    ```bash
    #!/bin/bash
    printf "bash: pacman: command not found\n"
    ```
2. Add this script to somewhere in their `$PATH` and name is `sudo`:
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
3. Add the following lines to their `bash` profile:
    ```
    eval "$BASH_COMMAND"
    ```
