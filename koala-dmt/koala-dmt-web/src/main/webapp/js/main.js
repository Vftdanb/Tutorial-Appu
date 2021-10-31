$(function() {
	$(window).on('resize', function() {
		var height = $(window).height();
		$('#widgetContainer').height(height);
		$('#gHead').height(0.06 * height);
		$('#gMain').height(0.89 * height);
		$('#gFooter').height(0.05 * height);
		$('#projectExplorer .panel-body').height(0.36 * height);
		$('#propertiesExplorer .panel-body').height(0.24 * height);
		$('#gwtTabLayoutPanel .panel-body').height(0.80 * height);
		//		$('.diagram').height($(window).height() * 0.80 - 28);
		//		$('.tool-container').height($(window).height() * 0.80 - 28);
		//		$('.tool-bar').height($(window).height() * 0.80 - 48);
	});
	$(window).trigger('resize');

	var data = [{
		"id" : 1,
		"name" : "项目一",
		"children" : [{
			"id" : 7,
			"name" : "类1",
			"type" : "folder",
			"actionUrl" : "forum",
			"children" : [{
				"id" : 7,
				"name" : "<i class=\"fa fa-file\"></i>&nbsp;属性1",
				"type" : "item",
				"actionUrl" : "forum"
			}, {
				"id" : 7,
				"name" : "<i class=\"fa fa-file\"></i>&nbsp;属性2",
				"type" : "item",
				"actionUrl" : "forum"
			}]
		}],
		'icon-class' : 'red',
		"type" : "folder",
		"actionUrl" : ""
	}, {
		"id" : 2,
		"name" : "项目二",
		"children" : [{
			"id" : 4,
			"name" : "类1",
			"type" : "folder",
			"actionUrl" : "repair",
			"children" : [{
				"id" : 7,
				"name" : "<i class=\"fa fa-file\"></i>&nbsp;属性1",
				"type" : "item",
				"actionUrl" : "forum"
			}, {
				"id" : 7,
				"name" : "<i class=\"fa fa-file\"></i>&nbsp;属性2",
				"type" : "item",
				"actionUrl" : "forum"
			}]
		}, {
			"id" : 5,
			"name" : "类2",
			"type" : "folder",
			"actionUrl" : "comment",
			"children" : [{
				"id" : 7,
				"name" : "<i class=\"fa fa-file\"></i>&nbsp;属性1",
				"type" : "item",
				"actionUrl" : "forum"
			}, {
				"id" : 7,
				"name" : "<i class=\"fa fa-file\"></i>&nbsp;属性2",
				"type" : "item",
				"actionUrl" : "forum"
			}]
		}],
		'icon-class' : 'orange',
		"type" : "folder",
		"actionUrl" : ""
	}];
	$('#projectTree').tree({
		localData : data,
		loadingHTML : '<div class="tree-loading"><i class="fa fa-refresh fa fa-spin blue"></i></div>',
		'open-icon' : 'fa-folder-open fa',
		'close-icon' : 'fa-folder fa',
		'selectable' : false,
		'selected-icon' : null,
		'unselected-icon' : null
	});
	$('#projectTree').find('>.tree-folder>.tree-folder-header').on('click', function() {
		var title = $(this).text();
		var id = $(this).attr('id');
		openTab('pages/template.html', title, 'id' + id);
	});
});

$.ajaxSetup({
	error : function(XMLHttpRequest, textStatus) {

		if (XMLHttpRequest.status == 404 || XMLHttpRequest.status == 500) {
			$.get('errors/' + XMLHttpRequest.status + '.html').done(function(html) {
				$('#tabContent .active').html(html);
			});
		} else {
			$.get('errors/404.html').done(function(html) {
				$('#tabContent .active').html(html);
			});
		}
	}
});

/*
 *打开一个Tab
 */
function openTab(url, title, id) {
	var tabs = $('#navTabs');
	var contents = $('#tabContent');
	var content = contents.find('#' + id);
	if (content.length > 0) {
		tabs.find('a[href="#' + id + '"]').tab('show');
		return;
	}
	content = $('<div id="' + id + '" class="tab-pane"></div>');
	$.get(url).done(function(data) {
		content.html(data);
		content.find('.canvas_freamwork');
		content.find('#canvas').umlCanvas();
	});
	contents.append(content);
	var tab = $('<li>');
	tab.append($('<a href="#' + id + '" data-toggle="tab"></a>')).find('a').html('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><span>' + title + '<span>');
	var closeBtn = tab.appendTo(tabs).on('click', function() {
		var $this = $(this);
		if ($this.hasClass('active')) {
			return;
		}
		$this.find('a:first').tab('show');
	}).find('a:first').tab('show').find('.close');
	closeBtn.css({
		position : 'absolute',
		right : (closeBtn.width() - 10) + 'px',
		top : -1 + 'px'
	}).on('click', function() {
		var prev = tab.prev('li').find('a:first');
		content.remove() && tab.remove();
		prev.tab('show');
	});
};