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
	initialize: function () {

	},
	loadDefaultTabs: function () {
		var self = this,
			defaultTabs = this.defaultTabs;

		var xhrs = _.map(defaultTabs, function (tab) {
			return $.get(tab.contentURL);
		});

		var promise = $.when.apply(this, xhrs);
		var onDone = function () {
			_.map(defaultTabs, function (tab, i) {
				_.extend(tab, {content: xhrs[i].responseText})
			});
			self.resetToLoadedContent()
		};

		promise.then(onDone);

		return promise;
	},
	resetToLoadedContent: function () {
		var defaultTabs = this.defaultTabs;
		this.reset(defaultTabs);
	},
	setActiveTabAtIndex: function (i) {
		var cid = this.at(i).cid;
		this.setActiveTab(cid);
	},
	setActiveTab: function (cid) {
		var nextActiveTab = this.get(cid),
			prevActiveTab = this.getActiveTab();

		if (prevActiveTab) {
			if (prevActiveTab.cid === cid) {
				return prevActiveTab;
			}
			prevActiveTab.set({isActive: false}, {silent:true});
		}
		if (nextActiveTab) {
			nextActiveTab && nextActiveTab.set({isActive: true});
		}
		return nextActiveTab;
	},
	getActiveTab: function () {
		return this.findWhere({isActive: true});
	},
	createTab: function () {
		this.add({});
	},
	closeTab: function (cid) {
		if (this.length > 1) {
			if (this.get(cid).get('isActive')) {
				var closestTab = this.getClosestTo(cid);
				this.setActiveTab(closestTab.cid);
			}
			this.remove(cid);
		} else {
			var defaults = _.extend(
				{},
				TabModel.prototype.defaults,
				{isActive: true}
			);
			this.at(0)
				.clear()
				.set(defaults);
		}
	},
	getClosestTo: function (cid) {
		var tab = this.get(cid),
			tabIndex = this.indexOf(tab);
		return this.at(tabIndex - 1) || this.at(tabIndex + 1);
	},
	toggleEditMode: function (flag) {
		this.getActiveTab().set('editMode', !!flag);
	},
	saveContent: function (mdStr) {
		this.getActiveTab().set('content', mdStr);
	}
});