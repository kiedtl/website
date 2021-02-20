+++
title = "Program eloquence considered harmful"
draft = false
date = 2020-05-11
+++

# Program eloquence considered harmful

Let's compare some error messages -- specifically, the ones that occur when
you try to execute a nonexistent command in Windows PowerShell and GNU
Bash.

PowerShell:

```
PS C:\> lorem --ipsum dolor -sit amet
lorem : The term 'lorem' is not recognized as the name of a cmdlet, function, script file, or operable program.
Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
At line:1 char:1
+ lorem --ipsum dolor -sit amet
+ ~~~~~
+ CategoryInfo          : ObjectNotFound: (lorem:String) [], CommandNotFoundException
+ FullyQualifiedErrorId : CommandNotFoundException

PS C:\> exit
```

and GNU Bash:

```
$ lorem --ipsum dolor -sit amet
bash: lorem: command not found
$ 
```

The first thing you'll notice is that PowerShell's output is far, _far_
more verbose. You've got an error, a nice helpful message suggesting that
you "check the spelling of the name and try again", and a stack trace.
Meanwhile, `bash` just tells you `command not found`.

So: which error message is better?

Eric Raymond, in his excellent book *The Art of UNIX Programming*, explains
that a good UNIX program should output the least amount of stuff that it
can, a rule he calls the "Rule of Silence":

> One of Unix's oldest and most persistent design rules is that when a
> program has nothing interesting or surprising to say, it should *shut
> up*. Well-behaved Unix programs do their jobs unobtrusively, with a
> minimum of fuss and bother. Silence is golden.
>
> This "silence is golden" rule evolved originally because Unix predates
> video displays. On the slow printing terminals of 1969, each line of
> unnecessary output was a serious drain on the user's time. That
> constraint is gone, but excellent reasons for terseness remain. (Raymond,
> 43)

He quotes Ken Arnold:

> ...important information should not be mixed in with verbosity about
> internal program behaviour. If all displayed information is important,
> important information is easy to find.

Raymond continues:

> Well designed programs treat the user's attention and concentration as a
> previous and limited resource, only to be claimed when necessary.
> (Raymond, 44)

It is Arnold's quote that I'd like to expand on. Not only should you not
include unimportant information, but you should also output the important
stuff in the tersest possible form.

Why? Because **users don't like reading.**

When a user is using a particular application, they are usually trying to
get something done. They may be trying to check their email, launch
Discord, or start their browser. Reading stuff takes time, and thus slows
the user down. Because of this, users will do the minimal amount of reading
that they can.

Therefore, a terse error message is more likely to get properly read than a
verbose error.

"But wait! PowerShell's message is more user-friendly, because it reminds
the user to check their spelling!" Pffft. Anyone smart (for lack of a
better word!) enough to use PowerShell will know that they should
double-check their spelling without an error message telling them to do so.

And even in "normal" applications -- where the majority of users are not
knowledgeable enough to know that their spelling could be to blame -- an
error message that's too verbose is *still* problematic, because many, if
not most, non-techy users won't bother reading it!

And if you *simply must include* a help/hint message -- do so in a way that
won't distract the user from the actual error.

For example, just look at the default Windows error message for an
incorrect password:

> You can't sign into your device right now. Go to account.live.com to fix
> the problem, or try the last password you used on this device.

Now, this could have just been written as

> Login incorrect

which is the error message that's displayed on Linux when a user attempts
to login from a TTY.

However: a "Windows account" is actually a Microsoft account, and the
password is the same. Which means that if a user changes her Microsoft
account password on another device, and then tries to login on another
device that hasn't connected to the internet yet and received the new
password, she will have to use the last password she used on that
particular device.

Most users, however, probably won't realize this in such
a scenario, so it's OK to say that in the error message. The trick is to
include it in such a way so as to not make the error message seem too long:

> **Incorrect password**
>
> ---
>
> *Note: try using the last password you used on this device.*

Notice how the main error ("Incorrect password") is in bold, and the hint,
two lines below, was in italics. I didn't put the hint in
<small>small</small> text, because that would give the impression to a
naive user that it was some kind of legal/technical message that she
doesn't have to pay attention to.

## (anti-)case studies

### Google

Take a look at the error message given when your Google search didn't turn
up anything:

> Your search -- **asdf;asdf;asdf;asdf;asdf;asdf;as...** did not match any
> documents.
>
> Suggestions:
>
> - Make sure all words are spelled correctly.
> - Try different keywords.
> - Try more general keywords.
> - Try fewer keywords.

For one thing, repeating the entire search query in bold isn't necessary.
The user already knows what they searched for.

The suggestions, however,
are OK since they are visually separate from the error.

Fixed:

> **No results found.**
>
> ---
>
> Tips:
> - Check your spelling.
> - Try different keywords.
> - Try more general keywords.
> - Try fewer keywords.

Notice how I condensed the main error message and the first suggestion,
and replaced `Suggestions:` with `Tips:`.

### SSH

```
$ ssh tilde.zone
The authenticity of host 'tilde.zone (51.79.32.49)' can't be established.
ECDSA key fingerprint is SHA256:0EmsPM79b0dq7McKYu0fsEiDoiv4JhamrGTOJ3IbShc.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'tilde.zone,51.79.32.49' (ECDSA) to the list of known hosts.
kiedtl@tilde.zone's password: 
Permission denied, please try again.
kiedtl@tilde.zone's password: ^C

$
```

I see several things wrong:

- the first line (`The authenticity of host can't be established`) is too verbose.
- the second line (`ECDSA key fingerprint is...`) is too verbose.
- the prompt to continue to way too verbose.
- the warning is too verbose.
- the `permission denied` error is just a little bit too verbose.

Fixed:

```
$ ssh tilde.zone
Authenticity of 'tilde.zone (51.79.32.49)' unknown.
ECDSA key fingerprint: SHA256:0EmsPM79b0dq7McKYu0fsEiDoiv4JhamrGTOJ3IbShc
Continue? (yes/no) yes
Warning: added host to list of known hosts.
kiedtl@tilde.zone's password: 
Permission denied, try again.
kiedtl@tilde.zone's password: ^C

$
```

As you can see, I've condensed the first line, continue prompt, and warning
quite a bit; I've also changed the second line to not be a sentence, thus
eliminating a whole two letter word ;)

The warning has been changed to not repeat the host and IP address, which
was already listed previously. The completely unnecessary `please`
has been removed from the password error.

### `su`

The example with the shortest name also has the shortest error message,
`su`:

```
$ su
Password:
su: Authentication failure
```

Notice the beautifully terse error message.

(And if you're wondering why `su` just doesn't say `incorrect password`,
it's probably due to `su` being incapable of knowing whether it's really
the password that was wrong, or the username, or something else.)

### GNU `cat`

`cat`'s error on an incorrect path is terse, but not terse enough:

```
$ cat invalid
cat: invalid: No such file or directory
$
```

Why say "no such file or directory"? `cat` doesn't even read directories!

Solution:

```
$ cat invalid
cat: invalid: invalid path
```

*more case studies will be added as I find them.*

## conclusion

Terser is better. Software isn't the place to show off your writing skills.

And if you really must include some kind of hint or suggestion, make it
visually separate from the error message.
