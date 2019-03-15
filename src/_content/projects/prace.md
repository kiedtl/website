<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.3/ace.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.3/mode-html.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.3/mode-javascript.js"></script>
<script src="https://kiedtl.surge.sh/js/prace/prace.js"></script>
<script>
  function init() {
      praceInit("pre");
  }
  window.onload = init;
</script>

# PraceJS
A piece of Javascript code thst you can add to any webpage that transforms all the &lt;pre> elements in that webpage to a mini Ace editor.

## Usage
Start by downloading prace.js and adding it and the Ace editor to your project:
```html
<script src="path/to/the/ace/editor.js" async></script>
<script src="path/to/the/script/prace.js" async></script>
```

Then, initialize PraceJS on document load with the Javascript code:
```javascript
praceInit("pre");
```
...where the first arguement of the `praceInit()` function is the element to transform. I personally recommend the `pre` element, because if something goes wrong or Javascript is disabled, the pre element will still render as a code block.

## Demo
The demo is on this page. Notice how all code blocks became Ace editors.

## License
AGPL-v3.0
