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
<pre lang="html" theme="tomorrow">
&lt;script src=&quot;path/to/the/ace/editor.js&quot; async&gt;&lt;/script&gt;
&lt;script src=&quot;path/to/the/script/prace.js&quot; async&gt;&lt;/script&gt;
</pre>

Then, initialize PraceJS on document load with the Javascript code:
<pre lang="javascript" theme="tomorrow">
function init() {
    praceInit("pre");
}
window.onload = init;
</pre>
...where the first argument of the `praceInit()` function is the element to transform. I personally recommend the `pre` element, because if something goes wrong or Javascript is disabled, the pre element will still render as a code block.

Then, you can define your `pre` elements:
<pre lang="html" theme="tomorrow">
&lt;pre lang=&quot;html&quot; theme=&quot;tomorrow&quot;&gt;
...
&lt;/pre&gt;
</pre>

## Demo
The demo is on this page. Notice how all code blocks became Ace editors.

## License
AGPL-v3.0
