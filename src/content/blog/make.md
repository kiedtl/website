+++
title = "Makefiles"
date = 2020-02-17
template = "blog.html"
+++


# Idiomatic makefiles

*NOTE: This article assumes that GNU Make is the make in use. A very basic understanding
of Make syntax is also assumed.*

<br>
I sometimes see makefiles like this:

```
build:
	gcc -O4 -ggdb main.c -o program_name
```

Please, don't do this. `make` isn't a command runner, it's a build system.
(Specifically, for C.) If you want a command runner, you really should be
using [just](https://github.com/casey/just) or maybe plain old POSIX shell
scripts.

Here's what a good makefile looks like: <br>

```
NAME	= program_name

CC	= gcc
CFLAGS	= -O4 -ggdb

SRC	= main.c util.c
OBJ	= $(SRC:.c=.o)

$(NAME): $(OBJ)
	$(CC) $(CFLAGS) -o $@ $^

clean:
	rm -f $(OBJ) $(NAME)

.PHONY: clean
```

Let's disect this improved makefile line by line:

<br><hr><br>

```
NAME	= program_name
```

You don't really have to do this, but if you need to rename your program
later, it makes things easier.


```
CC	= gcc
CFLAGS	= -O4 -ggdb
```

We need to keep the compiler name and it's command-line flags in variables,
so if someone building your software needs to build using, say, `clang`
instead of `gcc`, they can simply run `make CC=clang`, without having to edit the
makefile. (NOTE: the variables `CC` and `CFLAGS` must be named exactly that,
for reasons I'll explain later.)

```
SRC	= main.c util.c
```

This is where we define the source files. Adding another source file is as easy
as simply appending the filename to this variable: `SRC = main.c util.c another.c`.

```
OBJ	$(SRC:.c=.o)
```

Here, we could simply just write `OBJ = main.o util.o`, but by using `$(SRC:.c=.o)`,
we let `make` autmatically do the file extension conversion (with the `.c=.o`).


```
$(NAME): $(OBJ)
	$(CC) $(CFLAGS) -o $@ $^
```

- We're defining a recipe with the name of the resulting binary filename of our program.
  - This means that when our program is compiled, `make` will not build our program unless
    it's out of date [^1].
- `$(OBJ)` is defined as *dependency* of this recipe; that is, the object files defined in `OBJ`
  before must exist before this recipe is executed. Because make already knows how to create
  those object files by compiling source files with the C compiler, we don't need to define
  another recipe telling make how to build them. (This is the reason why the `CC` and `CFLAGS`
  variables must be named like that -- normally, when compiling the object files, make automatically
  uses the C compiler and options that we defined in `CC` and `CFLAGS`, but if they were named anything
  else, make wouldn't do that and we would have to manually define a recipe that tells make
  how to build the object files the way *we* want.)
  - One huge benefit of this is that make will only build object files that were modified. Building
    the whole project all over again on each build is fine for a small project, but for bigger projects,
    it can get annoying quickly.
- Then, we just give the command to build this recipe (`$(CC) $(CFLAGS) -o $@ $^`). `$@` and `$^`
  are both special variables that refer to the recipe name and it's dependencies, respectively.

```
clean:
	rm -f $(OBJ) $(NAME)
```

This is a standard recipe that simply removes all compiled files. Useful when you want to
rebuild your project completely.

```
.PHONY: clean
```

We're telling make that `clean` is a *phony* recipe, not an actual target -- that is, even
if a file called `clean` exists, `make` should build it anyways.

Normally, when `make` is told to execute a recipe, it first checks to see if a file with
the recipe name is *up to date*[^1]. If it is, it exits with `make: nothing to be done for <recipe>.`;
if it's not up to date, it executes a recipe. By telling make a recipe is phony, we're saying
that it should execute the recipe, regardless if a file named, say, `clean` exists for some odd reason.


<hr>

[^1]: whether make considers a file *up to date* depends on two things: whether the file exists,
and whether the recipe's dependencies (which also correspond to files) are newer than it.<br>
