+++
title = "C's assert() under the hood"
draft = false
date = 2021-11-07
template = "blog.html"

[extra]
unlisted = false
+++

# C's `assert()` under the hood

Here's a quick rundown of how C's `assert()` works. Consider the output of
a failed `assert()`tion in some C code:

```
#include <assert.h>
#include <stdbool.h>

int
main(void)
{
        assert(false == true);
}
```

Yields:

```
tmp.c.exe: /home/kiedtl/tmp.c:7: main: Assertion `false == true' failed.
Aborted (core dumped)
```

Interesting, how does `assert()` know the name of the caller, the filename,
and the binary path? Since when did C have reflection?

Let's find the source of `assert()` in the musl libc.

```
$ cd tmp
$ git clone git://git.musl-libc.org/musl --depth=1
Cloning into 'musl'...
remote: Counting objects: 2651, done.
remote: Compressing objects: 100% (2458/2458), done.
remote: Total 2651 (delta 304), reused 995 (delta 106)
Receiving objects: 100% (2651/2651), 1.25 MiB | 5.45 MiB/s, done.
Resolving deltas: 100% (304/304), done.
$ cd musl
$ l
arch/    configure*  crt/   dynamic.list  INSTALL  Makefile  src/    VERSION
compat/  COPYRIGHT   dist/  include/      ldso/    README    tools/  WHATSNEW
$ l src/
aio/        env/        internal/   malloc/     network/    search/     stdlib/     unistd/
complex/    errno/      ipc/        math/       passwd/     select/     string/
conf/       exit/       ldso/       misc/       prng/       setjmp/     temp/
crypt/      fcntl/      legacy/     mman/       process/    signal/     termios/
ctype/      fenv/       linux/      mq/         regex/      stat/       thread/
dirent/     include/    locale/     multibyte/  sched/      stdio/      time/
$ l src/misc/^C
$ find . -name assert.c
./src/exit/assert.c
```

Aha, in `src/exit/assert.c`. Let's have a look.

```
$ cat src/exit/assert.c
#include <stdio.h>
#include <stdlib.h>

_Noreturn void __assert_fail(const char *expr, const char *file, int line, const char *func)
{
        fprintf(stderr, "Assertion failed: %s (%s: %s: %d)\n", expr, file, func, line);
        abort();
}
```

Okay, looks like we need to search for a wrapper function somewhere. Maybe a
macro...?

```
$ rg 'define assert'
include/assert.h
8:#define assert(x) ((void)((x) || (__assert_fail(#x, __FILE__, __LINE__, __func__),0)))

src/malloc/mallocng/glue.h
31:#define assert(x) do { if (!(x)) a_crash(); } while(0)
```

Oh, of course, in `include`.

```
$ cat include/assert.h
<snip...>
#define assert(x) ((void)((x) || (__assert_fail(#x, __FILE__, __LINE__, __func__),0)))
<snip...>
```

There we go, let's dissect this.

```
((void)((x) || (__assert_fail(#x, __FILE__, __LINE__, __func__),0)))
```

This is a boolean `or` expression we're looking at. If the expression `x` (taken
as an argument by `assert`) is not true, then the second part (the
`__assert_fail` call) will be executed (the `(void)` bit causes the expression
result to be ignored and ensures we won't have any annoying `expression result
ignored` warnings).

The arguments to `__assert_fail`, executed when the `assert()` expression fails,
is where things get slightly interesting. `#x` returns a stringified
representation of the value `x`, which in this case is of course the expression
we passed to `assert()`; `#x` where `x` is `a == b` would return `"a == b"`.
`__FILE__`, `__LINE__`, and `__func__` are all expanded by the C preprocessor to
the filename, line number, and caller of the *location where the macro is
expanded*, respectively.

Now we can see the whole picture. The following:

```
assert(false);
```

Is expanded to:

```
((void)((false) || (__assert_fail(#false, __FILE__, __LINE__, __func__),0)))
```

And since `(false)` is, well, false, the second statement will be executed:

```
__assert_fail(#false, __FILE__, __LINE__, __func__)
```

Which, since the arguments were expanded by the C preprocessor, will look like:

```
__assert_fail("false", "tmp.c", 7, "main")
```

Which will then result in the appropriate message being printed.

{% sidenote() %}

If you're paying attention, you'll notice that `__assert_fail` doesn't
print the binary path, as was seen in the output earlier. This is because
the binary was compiled on a glibc platform, which apparently differs in this
respect from musl's.

{% end %}

Now, if only we could get a stacktrace with this output. We can, actually! We
could, for instance, if we had implemented a `panic()` function for C that
prints out a stacktrace (this is possible thanks to `backtrace(3)` and friends).
We could then define a custom `assert()` that calls our `panic()` instead of
`abort()`, which would result in output something along the lines of:

```
fatal: Assertion `ctx != NULL' failed (/home/kiedtl/src/mebsuta/commands.c:eval:231).
backtrace:
   /home/kiedtl/src/mebsuta/mebs() [0x4027e0]
   /home/kiedtl/src/mebsuta/mebs() [0x40b012]
   /home/kiedtl/src/mebsuta/mebs() [0x40b86e]
   /home/kiedtl/src/mebsuta/mebs() [0x4051e8]
   /home/kiedtl/src/mebsuta/mebs() [0x40b168]
   /lib/x86_64-linux-gnu/libc.so.6(__libc_start_main+0xf3) [0x7efddd3500b3]
   /home/kiedtl/src/mebsuta/mebs() [0x4025ae]
```

{% sidenote() %}

The addresses in the backtrace (i.e., `0x4027e0` and others) can be converted to
a function/line info like so:

```
$ addr2line -e /home/kiedtl/src/mebsuta/mebs 0x4027e0
/home/kiedtl/src/mebsuta/util.c:56
```

In this case, we picked the top address, which happens to be the function that
called `backtrace(3)`; we'd have to check a few more addresses to get something
useful.

{% end %}

This is actually something I do in many of my projects. Here's a simplified
version of the code I use, if you're curious.

```
#include <execinfo.h>
#include <stdarg.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

#define BT_SZ 32

/*
 * Simplified version of the panic() function that I typically use.
 *
 * The more complex one can call optionally perror() after printing the
 * user-supplied message, and can elide the backtrace if certain environment
 * variables aren't set (think something similar to RUST_BACKTRACE).
 */
_Noreturn void __attribute__((format(printf, 1, 2)))
panic(const char *fmt, ...)
{
        fprintf(stderr, "fatal: ");

        va_list ap;
        va_start(ap, fmt);
        vfprintf(stderr, fmt, ap);
        va_end(ap);

        void *buffer[BT_SZ];

        int nptrs = backtrace(buffer, BT_SZ);
        char **strings = backtrace_symbols(buffer, nptrs);

        if (!strings) {
                fprintf(stderr, "(Unable to provide backtrace.)");
        } else {
                fprintf(stderr, "backtrace:\n");
                for (size_t i = 0; i < (size_t)nptrs; ++i)
                        fprintf(stderr, "   %s\n", strings[i]);
                free(strings);
        }

        exit(EXIT_FAILURE);
}

/* Our version of assert(). */
#define ensure(expr) (__ensure((expr), #expr, __FILE__, __LINE__, __func__))

/* Internal version of ensure() that's passed the file/line/func info. */
void
__ensure(_Bool expr, char *str, char *file, size_t line, const char *fn)
{
        if (expr) return; /* Assertion succeeded. */

        panic("Assertion `%s' failed (%s:%s:%zu).", str, file, fn, line);
}
```

Beware, `backtrace(3)` is a GNU extension and won't work with all architectures
or OS's (Windows does not support it).

Anyway. Hopefully this convinced some of you to just use, uhm, Rust for new
projects. Or any language where you get luxuries like cross-platform stacktraces
for free.

Cheers!
