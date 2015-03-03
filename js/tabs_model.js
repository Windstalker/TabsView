var TabModel = Backbone.Model.extend({
	defaults: {
		title: 'New Tab',
		content: '',
		contentURL: '',
		isActive: false,
		editMode: true
	},
	url: function (relURL) {
		return 'templates/md/' + relURL;
	},
	initialize: function () {
		var url = this.get('contentURL');
		if (url.length) {
			this.addContentFromURL(url);
		}
		this.set('editMode', !this.get('content').length);
	},
	addContentFromURL: function (u) {
		var url = this.url(u);
		this.fetch({url: url, dataType: 'text'})
	},
	parse: function (response) {
		return {content: response, editMode: !response.length}
	}
});
var Tabs = Backbone.Collection.extend({
	model: TabModel
});