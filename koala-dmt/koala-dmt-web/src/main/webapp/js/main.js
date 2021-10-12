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
		$('#home').height(0.80 * height);
		//				$('.diagram').height($(window).height() * 0.80 - 28);
		//				$('.tool-container').height($(window).height() * 0.80 - 28);
		//				$('.tool-bar').height($(window).height() * 0.80 - 48);
	});
	$(window).trigger('resize');

	$.get(contextPath + '/domains-chart/find-all').done(function(data) {
		var items = [];
		$.each(data, function() {
			var item = {};
			item.id = this.projectId;
			item.name = this.projectName;
			item.type = 'folder';
			item.children = [];
			if (this.domainsChartDtos) {
				getChilren(item.children, this.domainsChartDtos);
			}
			items.push(item);
		});
		$('#projectTree').tree({
			localData : items,
			loadingHTML : '<div class="tree-loading"><i class="fa fa-refresh fa fa-spin blue"></i></div>',
			'open-icon' : 'fa-folder-open fa',
			'close-icon' : 'fa-folder fa',
			'selectable' : true,
			'selected-icon' : null,
			'unselected-icon' : null
		}).on({
			'selected': function(e, data){
				if(data.dataType &&　(data.dataType == 'domainShapeDto' 
					|| data.dataType == 'propertity')){
					setPropertity(data.dataType, data)
				}
			}
		});
		$('#projectTree').find('>.tree-folder>.tree-folder-header').on('click', function() {
			var title = $(this).text();
			var id = $(this).attr('id');
			openTab(contextPath + '/pages/template.html', title, 'id' + id);
		});
	});
	var getChilren = function(children, domainsChartDtos) {
		$.each(domainsChartDtos, function() {
			var item = this;
			item.type = 'folder';
			item.children = [];
			if (this.domainShapeDtos) {
				getDomainShapeDtos(item.children, this.domainShapeDtos);
			}
			if (this.lineDtos) {
				getLineDtos(item.children, this.lineDtos);
			}
			children.push(item);
		});
	};
	var getLineDtos = function(children, lineDtos) {
		$.each(lineDtos, function() {
			var item = this;
			item.name = '<i class=\"fa fa-file\"></i>&nbsp;' + this.name;
			item.type = 'folder';
			item.dataType = 'lineDto';
			children.push(item);
		});
	}
	var getDomainShapeDtos = function(children, domainShapeDtos) {
		$.each(domainShapeDtos, function() {
			var item = this;
			item.type = 'folder';
			item.dataType = 'domainShapeDto';
			item.children = [];
			if (this.properties) {
				getProperties(item.children, this.properties);
			}
			children.push(item);
		});
	}
	var getProperties = function(children, properties) {
		$.each(properties, function() {
			var item = this;
			item.nameValue = this.name;
			item.name = '<i class=\"fa fa-file\"></i>&nbsp;' + this.name;
			item.type = 'item';
			item.dataType = 'propertity';	
			children.push(item);
		});
	}
});

$.ajaxSetup({
	error : function(XMLHttpRequest, textStatus) {

		if (XMLHttpRequest.status == 404 || XMLHttpRequest.status == 500) {
			$.get(contextPath + '/errors/' + XMLHttpRequest.status + '.html').done(function(html) {
				$('#tabContent .active').html(html);
			});
		} else {
			$.get(contextPath + '/errors/404.html').done(function(html) {
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
		right : '1px',
		top : -1 + 'px'
	}).on('click', function() {
		var prev = tab.prev('li').find('a:first');
		content.remove() && tab.remove();
		prev.tab('show');
	});
};

function setPropertity(type, data){
	console.info(data);
	if(type == 'domainShapeDto'){
		var classForm = $('#classForm').show();
		$('#protertyForm').hide();
		classForm.find('#name').val(data.name);
		classForm.find('#description').val(data.description);
	}else{
		var protertyForm = $('#protertyForm').show();
		$('#classForm').hide();
		protertyForm.find('#name').val(data.nameValue);
		protertyForm.find('#description').val(data.description);
	}
}
