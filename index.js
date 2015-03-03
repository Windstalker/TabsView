(function () {
//	_.templateSettings = {
//		evaluate:    /\{\{#([\s\S]+?)\}\}/g,
//		interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g,  // {{ title }}
//		escape:      /\{\{\{([\s\S]+?)\}\}\}/g         // {{{ title }}}
//	};
	window.converterMD = new Showdown.converter();
	var tabsView = new TabsView();
	console.log(tabsView);
})();