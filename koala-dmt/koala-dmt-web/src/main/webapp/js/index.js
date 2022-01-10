(function($){
	/*tab插件*/
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
		
		return {
			TABS : TABS,
			PANELS : PANELS,
			
			/**
			 * 添加一个tab和对应的panel,
			 * 添加完成后执行fn回调函数,
			 * 你可以为新加的tab指定一个class，方便以后查找
			 * 返回值是一个随机的字符串，这个字符串是新加tab的class，你可以通过这个class找到对应的tab
			 */
			addTab : function(title, content, fn, selec, closeAble){
				var cls = "panel_"+((1 + Math.random())*0x100000000).toString(16).substring(1),
					tab = $("<div class='tab " + cls + "' for='" + cls +"'>" + title + "</div>"),
					panel = $("<div class='panel " + cls + "'>" + content + "</div>");
				
				TABS.append(tab);
				PANELS.append(panel);
				fn ? fn(tab,panel) : "";
				selec ? tab.addClass(selec) : "";
				
				this.active("."+cls);
				
				return cls;
			},
			/*激活指定索引的tab*/
			active : function(sel){
				var tab = TABS.find(sel);
				
				TABS.find(".active").removeClass("active");
				tab.addClass("active");
				PANELS.find(".active").removeClass("active");
				PANELS.find("."+tab.attr("for")).addClass("active");
			},
			/*判断某个tab是否存在*/
			isHastTab : function(cls){
				return TABS.find(".tab_"+cls).length > 0;
			},
			
			/*关闭*/
			close : function(index){
				var tab = TABS.find(".tab").get(index);
				/*@TODO*/
			}
		}
	}
})($);


$(".dialog").each(function(i, item){
	$(item).tab()
});

var data = [{
		"id" : 1,
		"name" : "项目一",
		"type" : "project",
		"children" : [{
			"id" : 7,
			"name" : "图1",
			"type" : "chart",
			"actionUrl" : "forum",
			"children" : [{
				"id" : 7,
				"name" : "实体1",
				"type" : "item",
				"actionUrl" : "forum"
			}]
		}]
	}, {
		"id" : 2,
		"name" : "项目二",
		"actionUrl" : "",
		"type" : "project",
		"children" : [{
			"id" : 4,
			"name" : "图1",
			"type" : "chart",
			"children" : [{
				"id" 		: 7,
				"name" 		: "实体1",
				"actionUrl" : "forum"
			}]
		}]
	}];
	
var setting = {
	callback : {
		onClick : function(event, treeId, treeData){
			console.log(mainTab.isHastTab(treeData.id));
			if(treeData.type == "chart" && !mainTab.isHastTab(treeData.id)){
				var title = treeData.name;
				mainTab.addTab("title","",function(tab, panel){
					tab.addClass("tab_"+treeData.id);
					$.get('pages/template.html').done(function(data) {
						panel.html(data);
						panel.find('#canvas').umlCanvas();
					});
					panel.umlCanvas();
				});
			}
		}
	}
};

/*常用的三个变量*/
var projectTree = $.fn.zTree.init($("#projectTree"), setting, data); //工程树
var mainTab = $(".main_panel").tab(); //右边tab
var dialog = $().dialog({});		  //页面对话框

/*创建工程对话框*/
$("#add_project").click(function(){
	dialog.
		show().
		setTitle("创建项目").
		setBody('<form class="dialog_form">\
					<label>工程名</label>&nbsp;&nbsp;<input type="text" oninput="var input=$(this);if(input.val()) {input.removeClass(\'not_null\')} else {input.addClass(\'not_null\')}"/>\
					<div class="dialog_buttons">\
						<button type="button" onclick="createProject($(this));">确定</button>\
						<button type="button" onclick="dialog.close();">取消</button>\
					</div>\
				</form>');
		
});

/*添加建图*/
$("#add_chart").click(function(){
	var project = projectTree.getSelectedNodes();
	if(project.length == 0){
		alert("请选择工程");
		return;
	} else if(project.type != "project"){
		/*alert("请正确选择工程");
		return;*/
	}
	
	dialog.
		show().
		setTitle("添加UML图").
		setBody('<form class="dialog_form">\
					<label>UML图名</label>&nbsp;&nbsp;<input type="text" oninput="var input=$(this);if(input.val()) {input.removeClass(\'not_null\')} else {input.addClass(\'not_null\')}"/>\
					<div class="dialog_buttons">\
						<button type="button" onclick="addChart($(this));">确定</button>\
						<button type="button" onclick="dialog.close();">取消</button>\
					</div>\
				<form>');
});

/*生成代码*/
mainTab.PANELS.delegate(".generateCode", "click", function(){
	var canvas = $(this).parents("tools_bar:first").data("canvas");

	dialog.
		show().
		setTitle("生成代码").
		setBody('<form class="dialog_form">\
					<label>代码文件包名</label><input type="text" oninput="var input=$(this);if(input.val()) {input.removeClass(\'not_null\')} else {input.addClass(\'not_null\')}"/>\
					<div class="dialog_buttons">\
						<button type="button" onclick="generateCode($(this));">确定</button>\
						<button type="button" onclick="dialog.close();">取消</button>\
					</div>\
				</form>');
});



/*创建工程*/
function createProject(btn){
	var input = btn.parent().prev();
	if(input.val()){
		$.post('project/create', {"project.name":input.val()}, function(data){
			projectTree.addNodes(null, [{name:input.val(), isParent:true}]);
			dialog.close();
		},"json");
		
		return;
	}
	
	input.addClass("not_null");
};

/*添加建图*/
function addChart(btn){
	var input = btn.parent().prev();
	if(input.val()){
		$.ajax({
			headers: { 
		        'Accept': 'application/json',
		        'Content-Type': 'application/json' 
		    },
			url : "domain-chart/create",
			dataType:"json",
			data:JSON.stringify({
				"name" : input.val(),
				"project.id" : 1
			}),
			success : function(data){
				dialog.close();
			},
			error:function(){
				alert("添加失败");
			}
		});
		
		$.post("domain-chart/create", {projectId:1,name:"3434"},function(data){
			projectTree.addNodes(projectTree.getSelectedNodes()[0], [{name:input.val(), isParent:true,"icon-class":true, iconClass:"chart"}]);
			dialog.close();
		},"json");
		
		return;
	}
	
	input.addClass("not_null");
};

/*生成代码的按钮*/
function generateCode(btn){
	$.ajax({
		headers: { 
	        'Accept': 'application/json',
	        'Content-Type': 'application/json' 
	    },
		url 	: "domains-chart/create",
		data 	:  JSON.stringify(domainsChart),
		type	: "post",
		dataType : "json",
		success : function(data){
			console.log(data);
		},
		error :function(){
			
		}
	});
}