var TabsView = Backbone.View.extend({
	id: 'tabs_view',
	className: 'container backbone-view',
	tabs: new Tabs(),
	url: 'templates/html/tabs_view.html',
	template: null,
	subTemplates: [],
	firstRender: true,
	loader: null,
	converter: new Showdown.converter(),
	events: {

	},
	initialize: function () {
		var templateXHR = $.get(this.url),
			self = this;

		this.loader = $.when(
			this.tabs.loadDefaultTabs(),
			templateXHR
		);
		this.loader.then(function () {
			console.log('loader done');
			var templateHTML = templateXHR.responseText;
			var $subTemplates = $(templateHTML).find('[data-refresh]');
			if ($subTemplates.length) {
				self.subTemplates = _.map($subTemplates, function (wrap) {
					return _.template(wrap.innerHTML);
				});
			}
			self.template = _.template(templateHTML);
			self.tabs.setActiveTab(0);
			self.bindModel();
			self.render();
		});
	},
	bindModel: function () {
		this.listenTo(this.tabs, 'change', this.render);
	},
	unbindModel: function () {
		this.stopListening(this.tabs);
	},
	render: function () {
		var activeTab = this.tabs.getActiveTab(),
			tabs = this.tabs.toJSON(),
			self = this;
		try {
			var args = [{
					tabs: tabs,
					activeTab: activeTab && activeTab.toJSON() || null
				}],
				subTemplates = self.subTemplates;

			if (!this.firstRender && subTemplates.length) {
				self.$inner.each(function (i, wrap) {
					wrap.innerHTML = subTemplates[i].apply(self, args);
				});
			} else {
				console.log(args);
				self.$el.html(self.template.apply(self, args));
				if (self.subTemplates) {
					self.$inner = self.$el.find('[data-refresh]').splice(0, self.subTemplates.length);
				}
			}
		} catch (e) {
			console.error('Rendering Error: \n' + e.toString())
		}

		this.firstRender = false;

		return this;
	},
	appendIn: function (containerEl) {
		$(containerEl).append(this.el);
	}
});