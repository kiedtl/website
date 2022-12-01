+++
title = ""
draft = true
date = 2020-03-12
template = "blog.html"
+++

# thoguths on gemin

- what is gemini supposed to be?
	- is it a better gopher?
		- plausible
			- semantic instead of physical markup
			- TLS
			- no dumb index files
			- mime types, always utf8
	- is it a better web?
		- not really:
			- no forms
			- no js/css

- what does gemini do right?
	- privacy
	- no css, pure text
	- unextensibility

- what does gemini do wrong?
	- extreme focus on simplicity, for the sake of
	  implementor-friendly-ness
	- not going the whole way with semantic markup
	- ascii tables
		- mixing presentation/content
		- no wrapping
		- no screenreader
		- can't be extracted
	- hard breaks interpreted literally
	- no inline images for the sake of privacy
	- no styling (italics, etc)
	- aren't gemini limitations supposed to be enjoyable?
		- twitter wasn't

- can this be rectified?
	- protocol
		- protocol isn't bad actually
	- markup
		- users are resistant to change
			- hacks to fix deeper issues
				- csv tables with lagrange
				- image loading
			- "works for me!"
		- replacements
			- ideas
				- limited subset html
				- markdown
					- designed with html in mind
					- way too many edge cases, complex
					- lack of features in core spec
				- mandoc?
				- asciidoc?
			- can it be done?
				- stigma
				- too many half-assed clients who would never
				  support it
