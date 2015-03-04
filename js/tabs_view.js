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
		'click .tab[data-tab-id]': 'onTabClick',
		'click .tab[data-tab-id].active > .tab-name': 'onTabNameClick',
		'click .tab[data-tab-id] > .close-tab': 'onTabCloseClick',
		'click .tab.add-new-tab': 'onAddTabClick'
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
					return _.template(_.unescape(wrap.innerHTML));
				});
			}
			self.template = _.template(templateHTML);
			self.tabs.setActiveTabAtIndex(0);
			self.bindModel();
			self.render();
		});
	},
	bindModel: function () {
		this.listenTo(this.tabs, 'change:isActive change:title add remove', this.render);
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
					self.$inner = self.$el.find('[data-refresh]');
					console.log(self.$inner)
				}
			}
		} catch (e) {
			throw e;
		}

		this.firstRender = false;

		return this;
	},
	appendIn: function (containerEl) {
		$(containerEl).append(this.el);
	},
	onTabClick: function (e) {
		var cid = this.$(e.currentTarget).attr('data-tab-id');
		this.tabs.setActiveTab(cid);
	},
	onTabNameClick: function (e) {
		e.stopPropagation();

		var cid = this.$(e.currentTarget).parent('.tab').attr('data-tab-id');
		var tab = this.tabs.get(cid);
		var oldTitle = tab.get('title');
		var newTitle = window.prompt('Enter the name of the tab', oldTitle);
		if (newTitle && newTitle.length) {
			tab.set('title', newTitle);
		}
	},
	onTabCloseClick: function (e) {
		e.stopPropagation();

		var cid = this.$(e.currentTarget).parent('.tab').attr('data-tab-id');
		this.tabs.closeTab(cid)
	},
	onAddTabClick: function () {
		this.tabs.createTab();
	}
});