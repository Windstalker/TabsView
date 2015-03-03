var TabsView = Backbone.View.extend({
	model: new Tabs([
		{title: "Tab 1", contentURL: 'tab_0.md'},
		{title: "Tab 2", contentURL: 'tab_1.md'},
		{title: "Tab 3", contentURL: 'tab_2.md'}
	]),
	tabHolder: {
		url: "templates/html/tabs_holder.html",
		template: ''
	},
	tabContent: {
		url: "templates/html/tabs_content.html",
		template: ''
	},
	loader: null,
	events: {

	},
	initialize: function () {
		var tabHolder = this.tabHolder,
			tabContent = this.tabContent,
			thAjax = Backbone.$.get(tabHolder.url),
			tcAjax = Backbone.$.get(tabContent.url),
			self = this;
		this.loader = Backbone.$.when(
			this.model,
			thAjax,
			tcAjax
		);
		this.loader.then(function () {
			console.log('template loader done');

			tabHolder.template = _.template(thAjax.responseText);
			tabContent.template = _.template(tcAjax.responseText);
			self.bindModel(self.model);
			self.render();
		});
	},
	bindModel: function (model) {
		this.listenTo(model, 'change', this.render);
	},
	unbindModel: function (model) {
		this.stopListening(model);
	},
	render: function () {
		console.log('render');
	}
});