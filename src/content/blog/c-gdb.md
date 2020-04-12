+++
title = "debugging C code with gdb"
date = "2019-12-05"
template = "blog.html"
+++

# Debugging C code with GDB

Having a program crash is annoying enough. What's more annoying is having you program crash 
with no way to get a stack trace, or any other debugging information, which is just the case
with most C code.

You see, most C crashes are caused by your program trying to read into memory which
is doesn't have permission to access:

```
#include <stdio.h>
#include <string.h>

int
main ( void )
{
	char sentence[] = { 'h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd', '!' };
	for (int c = 0; c < strlen(sentence); c++) fprintf(stdout, "%s", sentence[c]);
	return 0;
}
```
The above program crashes because you're trying to read a `char` as a `char *`. The `fprintf`
tries to walk through your char, looking for the null terminator, then dies when it overlaps
the boundary of the character's memory.

So, on running the program:
```
$ vim main.c
$ gcc main.c -o test
$ ./test
Memory fault
```
That's it. Or, if you happen to be one of the poor souls that use `glibc` over `musl`:
```
$ ./test
Segmentation fault
```
No stack trace, nothing. If you're lucky, you get a core dump. That's it.

This is where GDB comes into play:
```
$ gdb ./test
GNU gdb (GDB) 8.3.1
Copyright (C) 2019 Free Software Foundation, Inc.
License blah blah

<snip>

For help, type "help".
Type "apropos word" to search for commands related to "word"...
Reading symbols from ./test...
(gdb)
```
On the `gdb` prompt, run the program:
```
(gdb) run
Starting program: /home/kiedtl/src/test/test

Program received signal SIGSEGV, Segmentation fault.
0xdeadbeef in memchr (src=src@entry=0xed, c=c@entry=0, n=<optimized out>,
    n@entry=829823792384) as src/string/memchr.c:17
17        src/string/memchr.c: No suck file or directory.
(gdb)
```
Show the backtrace:
```
(gdb) bt
#0  0xdeadbeef in memchr (src=src@entry=0x00, c=c@entry=0, n=<optimized out>,
    n@entry=98798798798) at src/string/memchr.c:17

<snip>

#4  0xdeadbeef in fprintf (f=<optimized out>, fmt=<optimized out>)
    at src/stdio/fprintf.c:9
#5  0x004006f8 in main ()
```
Strange, it's not showing the line number of the crash, only the function.

Oh, wait. You see, you're supposed to compile `main.c` with `-ggdb`, so that
GCC will add special debugging symbols in the finished executable for GDB to
look at.

Let's try this again:

```
$ gcc --ggdb main.c -o test
gcc: error: unrecognized command line option '--ggdb'; did you mean '-ggdb'?
$ gcc -ggdb main.c -o test
$ gdb ./test
GNU gdb (GDB) 8.3.1
Copyright (C) 2019 Free Software Foundation, Inc.
License blah blah

<snip>

For help, type "help".
Type "apropos word" to search for commands related to "word"...
Reading symbols from ./test...
(gdb) run
Starting program: /home/kiedtl/src/test/test

Program received signal SIGSEGV, Segmentation fault.
0xdeadbeef in memchr (src=src@entry=0xed, c=c@entry=0, n=<optimized out>,
    n@entry=829823792384) as src/string/memchr.c:17
17        src/string/memchr.c: No suck file or directory.
(gdb) bt
#0  0xdeadbeef in memchr (src=src@entry=0x00, c=c@entry=0, n=<optimized out>,
    n@entry=98798798798) at src/string/memchr.c:17

<snip>

#4  0xdeadbeef in fprintf (f=<optimized out>, fmt=<optimized out>)
    at src/stdio/fprintf.c:9
#5  0x004006f8 in main () at main.c:7
```

There, we have the line number of our crash. This is so much easier than blindly 
stamping `printf`'s all over our code.

Even if you're using C++, and not C, you can still use GDB as a debugger.

There's another tool, called `strace`, and it basically shows all syscalls your
program is making. It's also pretty useful.
