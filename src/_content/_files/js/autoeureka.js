function automaticEurekaInit() {
	var elems = document.getElementsByTagName("a")
	for (var i = 0; i < elems.length; i++) {
		var _ = elems[i];
		var txt = _.getAttribute("href");
           _.setAttribute("class", "hint--top hint--medium");
		_.setAttribute("aria-label", txt)
	}
}
