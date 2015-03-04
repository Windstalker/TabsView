var TabModel = Backbone.Model.extend({
	defaults: {
		title: 'New Tab',
		content: '',
		contentURL: '',
		isActive: false,
		editMode: true
	},
	initialize: function () {
		this.set('editMode', !this.get('content').length);
	}
});
var Tabs = Backbone.Collection.extend({
	model: TabModel,
	defaultTabs: [
		{
			title: 'Tab #1',
			contentURL: 'templates/md/tab_0.md'
		},
		{
			title: 'Tab #2',
			contentURL: 'templates/md/tab_1.md'
		},
		{
			title: 'Tab #3',
			contentURL: 'templates/md/tab_2.md'
		}
	],
	activeTab: null,
	initialize: function () {
		this.on('all', function(e){console.log(e)});
	},
	loadDefaultTabs: function () {
		var xhrs = _.map(this.defaultTabs, function (tab) {
			return $.get(tab.contentURL);
		});
		var promise = $.when.apply(this, xhrs);
		var onDone = _.bind(this.resetToLoadedContent, this, xhrs);

		promise.then(onDone);

		return promise;
	},
	resetToLoadedContent: function (xhrs) {
		var defaultTabs = this.defaultTabs;
		var collection = _.map(xhrs, function (xhr, i) {
			return _.extend({content: xhr.responseText}, defaultTabs[i]);
		});
		this.reset(collection)
	},
	setActiveTab: function (index) {
		var nextActiveTab = this.at(index),
			prevActiveTab = this.getActiveTab();

		if (prevActiveTab) {
			prevActiveTab.set({isActive: false}, {silent:true});
		}
		if (nextActiveTab) {
			nextActiveTab && nextActiveTab.set({isActive: true});
		}
	},
	getActiveTab: function () {
		return this.findWhere({isActive: true});
	}
});