function praceInit(element) {
	var elems = document.getElementsByTagName(element);
	for (var i = 0; i < elems.length; i++) {
		var _ = elems[i];
		var lang = _.getAttribute("lang");
		var them = _.getAttribute("theme");
  
		var editor = ace.edit(_);
		editor.setTheme("ace/theme/" + them);

		editor.session.setMode("ace/mode/" + lang);
		editor.setAutoScrollEditorIntoView(true);
		editor.setOption("maxLines", 100);
	}
}
