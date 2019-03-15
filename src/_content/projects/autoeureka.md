<link rel="stylesheet" href="/css/hint.css" />
<script src="/js/autoeureka.js"></script>
<script>
	window.onload = automaticEurekaInit;
</script>

# Automatic-Eureka
A piece of [javascript](https://www.javascript.com) that automatically adds a balloon onto every &lt;a> element displaying the contents of the href attribute of the &lt;a&gt; tag.
Automatic-Eureka uses [`hint.css`](https://kushagragour.in/lab/hint/) for the [tooltips](https://en.wikipedia.org/wiki/Tooltip). Because of that, users must add a `hint.css` reference to their [HTML](https://en.wikipedia.org/wiki/HTML) document.

### Usage
You can call the `automaticEurekaInit` function on documents load like this:
```html
<!-- snip -->
<body onload="automaticEurekaInit();" >
  <!-- blah blah blah -->
</body>
```
Try hovering over the links on this page to see Automatic Eureka in action.

[View this project on GitHub](https://github.com/Kiedtl/Automatic-Eureka)
