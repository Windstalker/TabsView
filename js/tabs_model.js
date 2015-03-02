var ContentModel = Backbone.Model.extend({
	defaults: {
		markdown: '',
		filename: ''
	},
	idAttribute: 'filename'
});
var ContentCollection = Backbone.Collection.extend({
	model: ContentModel
});
var TabModel = Backbone.Model.extend({
	defaults: {
		title: 'New Tab',
		content: new ContentCollection()
	}
});
var Tabs = Backbone.Collection.extend({
	model: TabModel
});