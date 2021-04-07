+++
title = "IRC's Flaws"
draft = false
date = 2021-04-01
template = "blog.html"
+++

# IRC's Flaws

IRC is quite an ancient protocol, having begun nearly 35 years ago[^1]. As
such, it is one of those technologies that evolved to keep up with changing
requirements. For the longest time, IRC didn't have features considered
necessary by today, such as SASL (aka
authentication-without-sending-passwords-to-random-bots) or TLS/SSL
support. Features like end-to-end encryption are *still* not widely used,
despite it being 2021.

Like many technologies that evolved (think JavaScript, `/bin/bash`, etc),
newer features were gracelessly duct-taped onto the protocol as they became
necessary.

## Services

For those who don't know, IRCd services are a hacky way of providing user
authentication and channel registration, management, and moderation tooling
for a protocol which did not originally have those features. They usually
come in the form of a set of bots, most commonly `NickServ` (for nickname
management) and `ChanServ` (for channel management). They are typically
provided by a software package separate from the IRC server implementation
-- for example, freenode uses `ircd-seven`, but uses the Atheme service
implementation.

To the best of my knowledge, these services were added instead of a
protocol extension to allow existing users access to these features without
having to patch clients. They have a few downsides, however.

- Logging into an account is done by messaging `NickServ` like so: `/msg
  NickServ identify <password>`. It's pretty easy for newbies to mess up
  and send the `identify` command to the current channel instead (`\\msg`
  instead of `/msg`, or `  /msg` (notice the space)) and leak their
  password.
- Because services have not been standardised, implementation can vary
  quite a bit depending on what one wants to do between servers. This means
  one must memorise the magic incantations required to, say, regain a
  nickname that belongs to them for each server.
- XXX

## Inconsistent channel configuration

There are two ways to configure channels:

- Via channel "modes". For example, to make a channel invite-only, the `+i`
  mode would be set on the channel with `/mode <#channel> +i`.
- Via ChanServ incantations. For example, to make a user a moderator in a
  channel, one uses `/msg ChanServ flags <user> +O` (on freenode).

Aside from the issue of ChanServ existing at all, the main problem is that
these two methods often overlap. Instead of sensibly using channel modes
for boolean settings (`+i` for invite-only, `+s` for secret, `+t` for
"protected-topic", `+m` for moderated, etc) and ChanServ for options that
have a value (access lists, auto-invited users for channels with `+i`,
etc), many channel modes require a value (e.g. `+I`, `+o`, `+H`) while a
few ChanServ settings don't. Occasionally, there are multiple `ChanServ`
commands that do more or less the same thing (e.g. `ACCESS` vs `FLAGS`).

## Moderation

IRC is a bit infamous for making moderation difficult. Something as simple
as banning a serial abuser can be confusing to inexperienced users, and
doing the ban incorrectly can lead to the abuser evading it.

## Bans

There are three types of bans:

- Nickname bans, prohibiting anyone with that nickname from joining a
  channel. These are rarely used, as the abuser will only have to do a
  `/nick somethingelse` to get back in.
- Account bans. These, too, are relatively easy to circumvent -- one can
  simply sign out, join the channel they were banned from, and then sign
  back in (or not sign in at all).
- Hostname/IP bans. These are a bit harder to evade, as they ban the IP
  address of the abuser instead of the account or nickname. This has
  several problems, however:
  - If the abuser was using a shared host (e.g. a tilde[^2]), the ban will
    have the effect of banning *everyone* who tries to run an IRC client on
    that host. (Freenode has a workaround: users from these pubnixes are
    given a special hostname (e.g.
    `user@gateway/shell/tilde.team/x-sfslfkaldskjfa`) that is unique *for
    each session.* So now an abuser from a pubnix simply has to reconnect
    to evade a ban.  Wonderful.)
  - An experienced troll may use a variety of shady VPNs and/or proxies to
    evade IP bans. [^3] Obviously, this kind of circumvention is quite
    rare.

The easiest solution is, in my humble opinion, is to force users to
authenticate (or create an account) when connecting (or prohibit unregistered
users from joining channels or messaging users). In addition to making
channel operator's lives easier, it also opens the possibility of allowing
multiple connections to use the same nickname (because why the hell should
my iPhone's client be forced to use `kiedtl|mobile` instead of just
`kiedtl`?).

### Quieting

This simple operation varies between server implementations. On freenode
(`irc-seven`), it's done with the `+q` channel mode (e.g. `+q
joaquinito!attentiontroll@shadyvpn.someplace`), but on InspireCD, it's done
with a special ban syntax (something along the lines of `+b
~q:nick!user@host`) -- `+q` on InspireCD *grants the user founder
privileges*.

### No temporary bans

Another issue related to this is the lack of temporary bans -- bans that
are means to be temporary will have to be manually unset when the moderator
wants to do so. Some channels work around this by using a bot to
automatically set/unset temporary bans.

### No moderation log

This is a bit of a non-issue, but it would be nice if channel moderators
could view a list of:

1. the users banned or quieted,
2. When they were banned,
3. Who they were banned by,
4. And the reason they were banned for.

IRC does *technically* have a "moderation log" detailing the list of banned
(or quieted) users, but this info gets screwed up when a netsplit happens
(the moderator who banned the user is replaced with the name of one of the
servers, for example).

## Federation

IRC's federated (for some value of "federated") nature may be seen as a
feature to some, it introduces the issue of netsplits, where the servers
disconnect.  Abusers may take advantage of this to takeover channels or
nicknames, or to join invite-only channels (known as "netsplit-riding").
While servers today have facilities in place to prevent takeovers, none of
the servers implementations I've tested can prevent users from joining
invite-only channels during netsplits.

---

There are a multitude of other issues I could mention:

- No multi-line messages.
- The hacky (and arguably privacy-invasive) CTCP protocol.
- The unusual escape sequences used to format text.
- No timestamps on messages by default.
- No typing indicator (yes, I am a spoiled bastard) by default.
- No proper E2E encryption.
- No channel history (no, channel replay is not channel history).
- Poorly standardised textual protocol.

The ones I have listed in detail are, however, what I believe are the most
important flaws of IRC. They aren't especially severe, however (some might
argue that the lack of E2E by default *is* an unacceptable defect).

[^1]: IRC was created by Jarkko Oikarinen in August of 1988.
[^2]: See https://tildeverse.org, https://tilde.team, https://tilde.town
[^3]: TOR is usually banned on IRC networks, and is thus not an issue.
