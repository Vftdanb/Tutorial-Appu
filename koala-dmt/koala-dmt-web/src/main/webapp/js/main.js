(function($){
	$.fn.tab = function(){
		var TAB = $(this),
			TABS = TAB.find(".tabs"),
			PANELS = TAB.find(".panels");
			
		TABS.delegate(".tab","click",function(){
			var thiz = $(this);
			if(!thiz.is(".active")){
				TABS.find(".active").removeClass("active");
				thiz.addClass("active");
				PANELS.find(".active").removeClass("active");						
				PANELS.find("."+thiz.attr("for")).addClass("active");
			}
		});
		
		var tab = {};
		
		tab.TABS 	= TABS;
		tab.PANELS 	= PANELS;
		
		/**
		 * 添加一个tab和对应的panel,
		 * 添加完成后执行fn回调函数,
		 * 你可以为新加的tab指定一个class，方便以后查找
		 * 返回值是一个随机的字符串，这个字符串是新加tab的class，你可以通过这个class找到对应的tab
		 */
		tab.addTab = function(title,content,fn,selec){
			var cls = "panel_"+((1 + Math.random())*0x100000000).toString(16).substring(1),
				tab = $("<div class='tab " + cls + "' for='" + cls +"'>" + title + "</div>"),
				panel = $("<div class='panel " + cls + "'>" + content + "</div>");
			
			TABS.append(tab);
			PANELS.append(panel);
			fn ? fn(tab,panel) : "";
			selec ? tab.addClass(selec) : "";
			
			this.active("."+cls);
			
			return cls;
		};
		/*激活指定索引的tab*/
		tab.active = function(sel){
			var tab = TABS.find(sel);
			
			TABS.find(".active").removeClass("active");
			tab.addClass("active");
			PANELS.find(".active").removeClass("active");
			PANELS.find("."+tab.attr("for")).addClass("active");
		}
		
		/*关闭*/
		tab.close = function(index){
			var tab = TABS.find(".tab").get(index);
			/*TODO*/
		};
		return tab;
	}
})($);

$(".dialog").tab();
var MAINTAB = $(".main_panel").tab();

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

	MAINTAB.addTab("title","",function(t,p){
		$.get('pages/template.html').done(function(data) {
			p.html(data);
			p.find('#canvas').umlCanvas();
		});
		p.umlCanvas();
	});
});