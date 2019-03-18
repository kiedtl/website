# Trying out Utterances

Recently, I stumbled on [utterances](https://utteranc.es/). According to the README, utterances is:

> A lightweight comments widget built on GitHub issues. Use GitHub issues for blog comments, wiki pages and more!

Well, being the person I am, the first thing I did was install it. I've installed it on this website, so you can preview it at the bottom.

This thing is really cool. Normally, comment widgets require either (a) a new account, or (b) separate database for the comment data. This way, no database or extra account setup is required, just this elegant GitHub app. Best, I an access the previous comments in the issues category on this [repository](https://github.com/kiedtl/website).

Utterances has its problems, of course. When I first checked out their website, I realised that I couldn't comment. The scrollbar was scrolled to the bottom, yet the comment box was partially hidden:

<picture>
  <source srcset="/images/utterences-screenshot-1.webp" type="image/webp">
  <source srcset="/images/utterences-screenshot-1.png" type="image/png">
  <img src="/images/utterences-screenshot-1.png" alt="desktop">
</picture>

There isn't any error in the Javascript console:

<picture>
  <source srcset="/images/utterences-screenshot-3.webp" type="image/webp">
  <source srcset="/images/utterences-screenshot-3.png" type="image/png">
  <img src="/images/utterences-screenshot-3.png" alt="desktop">
</picture>

Reloading the page fixed the issue:

<picture>
  <source srcset="/images/utterences-screenshot-2.webp" type="image/webp">
  <source srcset="/images/utterences-screenshot-2.png" type="image/png">
  <img src="/images/utterences-screenshot-2.png" alt="desktop">
</picture>

I reported the issue on their repository as issue [#133](github.com/utterance/utterances/issues/133).

Considering how useful this utility is, I'm surprised that is has less that 760 stars (757 at the time of writing this). If you are reading this, I highly recommend you try it out.
