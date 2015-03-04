(function (doc) {
	var tabsView = new TabsView();
	window.tabs = tabsView.tabs;
	tabsView.appendIn(doc.body);
})(document);