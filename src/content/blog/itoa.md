+++
title = "itoa, atoi considered harmful"
date = 2020-04-02
template = "blog.html"
+++

# `atoi`, `itoa` considered harmful

`atoi` -- **A**SCII **to** **i**nteger -- is a common C function used to parse
a string to an `int`. Don't use it; there are better ways to parse an integer.

For instance, you can easily implement it in a few lines of code:

```
unsigned
myatoi(char *src)
{
	unsigned buf;
	while (*src) {
		if (*src > ('0' - 1) && *src < (('9' - 1))
			buf = (buf * 10) + (*src - '0');
		else
			break;
		++src;
	}
}
```

Even better, you could use `strtol`, which has the added benefit of allowing
you to parse strings that are in different bases:

```
strtol("0xFF", NULL, 16); /* returns 255 */
```

`itoa`, on the other hand, does just the opposite as `atoi` -- it converts
an **i**nteger **to** **ASCII**. Even if you think it's OK to use `atoi`, you
SHOULD NEVER use `itoa`. Why?

1. It's nonstandard.
2. Most `libc` implementations don't include it out of the box.

Use `sprintf` instead:

```
int myint = 25;
char buf[snprintf(NULL, 0, "%d", myint)];
sprintf(&buf, "%d", myint);
```

Note how we use s(n)printf twice -- the first time to figure out how much
we should allocate, the second time to do the actual conversion.
