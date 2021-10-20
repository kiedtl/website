+++
title = "Crawling the Gemspace"
draft = false
date = 2020-10-24
template = "blog.html"
+++

A few days ago, I discovered [gemini](https://gemini.circumlunar.space) for
the first time. Wondering exactly how large it was, I thought I'd write a
quick and dirty crawler for it, which you can find
[here](https://github.com/lptstr/curiosity).

**Update 2021-10-20**: I thought I'd mention that at the time of writing
that crawler I had little to knowledge of the Gemini protocol; as a result,
I omitted a lot of crucial steps when crawling (like checking the MIME type
of the response), possibly leading to highly inaccurate results.

It took me an unusual amount of time to get a working crawler (I've never
done network or async programming in Rust before), but at last, with the
help of `cadey`'s `gemtext`-parsing library, I had a prototype. I started
crawling on 2020-10-22 1827, but was stopped several times by various
crashes, mostly because I had made some stupid assumptions about what kind
of links I'd find (for instance, that no one would put a url with just the
scheme type e.g. `gemini:///`). Later, it crashed again, due to a bug in
the `gemtext` crate. Turns out that `gemtext` assumes that you'll never
find links like this:

```
=>
```

That is, a `=>` with no valid url following it :facepalm:

Amusingly, I had stupidly decided I didn't need a method of saving the
crawler's state to a file that could be picked up later in the event of a
crash; because of that, each time a crash occurred, I'd have to
start over from scratch.

At last, though, it finished, after retrieving a total of 10MB of urls and
their backlinks:

```
$ ls results.json
.rw-r--r-- 10M kiedtl 24 Oct  0:58 results.json
$ cat results.json | jq | head -n 15
{
  "gemini://alexschroeder.ch:1965/page/2009-12-18_Save_Web_Pages_as_PDF": {
    "visited": true,
    "found": 1,
    "refers": [
      "gemini://alexschroeder.ch:1965/do/blog/10000"
    ]
  },
  "gemini://transjovian.org:1965/anthe/diff/Welcome/1": {
    "visited": true,
    "found": 2,
    "refers": [
      "gemini://transjovian.org:1965/do/all/changes",
      "gemini://transjovian.org:1965/do/all/changes/1000"
    ]
$ cat results.json | jq 'keys[]' | wc -l
45334
$
```

45,334 urls total. Neat, I had no idea gemspace was that big.

I'm not yet sure what I'm going to do with this data. Previously, I had
some vague idea of setting up a small search engine, but given that I
haven't the money to set up my own server or purchase a suitable domain, I
don't think that'll happen. I'd hate to hog resources on a
[tilde](tildeverse.org).

**Update 2021-10-20**: note, there are at least two Gemini capsules that
mirror the entire contents of Wikipedia. I'm sure a non-trivial portion of
those 45,334 urls come from those capsules; I haven't checked, though.
