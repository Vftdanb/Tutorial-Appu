$(".dialog").each(function(i, item){
	$(item).tab();
});

var setting = {
	async : {
		autoParam : ["projectId"],
		dataType:"json",
		enable:true,
		url : "domains-chart/find-by-project",
		dataFilter : function(treeId, parentNode, responseData){
			
			console.log(responseData);
			
			$.each(responseData, function(i, chart){
				chart.projectId = parentNode.id;
				chart.isParent = true;
				chart.type = "chart";
			});
			
			return responseData;
		}
	},
	callback : {
		beforeAsync : function(treeId, treeNode){
			if(treeNode && (treeNode.type == "project")){
				return true;
			} else {
				return false;
			}
		},
		onClick : function(event, treeId, treeData){
			if(treeData.type == "project"){
				$("#add_chart").show();
			} else {
				$("#add_chart").hide();
				if(treeData.type == "chart" && !mainTab.isExistTab(treeData.id)){
					console.log(treeData);
					var charId = treeData.id;
					
					$.ajax({
						url : "js/chart.js",
						dataType:"json",
						type:"post",
						success:function(chartData){
							mainTab.addTab({
								title : treeData.name,
								afterAdd : function(tab, panel){
									tab.addClass("tab_"+treeData.id);
									$.get('pages/template.html').done(function(data) {
										$.ajax({
											url : "domains-chart/",
											dataType:"json",
											type:"post",
											success:function(){
												
											}
										});
										
										panel.html(data);
										panel.find('#canvas').umlCanvas();
										
										/*将project和chart缓存在工具栏上，以待后续操作用到*/
										panel.find(".tools_bar:first").data("project", treeData.getParentNode());
										panel.find(".tools_bar:first").data("chart", treeData);
									});
								},
								closeable : true
							});
						}
					});
				}
			}
		}
	}
};

/*常用的三个变量*/
var projectTree = $.fn.zTree.init($("#projectTree"), setting, []); //工程树
var mainTab = $(".main_panel").tab(); 	//右边tab
var dialog = $().dialog();		  		//页面对话框

$.ajax({
	url : "project/find-all-projects",
	data : "",
	type : "get",
	dataType : "json",
	success : function(data){
		$.each(data, function(i, d){
			d.isParent = true;
			d.projectId = d.id;
			d.type = "project";
		});
		projectTree.addNodes(null, data);
	},
	error : function(){
		//alert("获取工程出错");
	}
});

/*创建工程对话框*/
$("#add_project").click(function(){
	var form = $('<form class="dialog_form">\
					<label>工程名</label>&nbsp;&nbsp;<input type="text" oninput="var input=$(this);if(input.val()) {input.removeClass(\'not_null\')} else {input.addClass(\'not_null\')}"/>\
					<div class="dialog_buttons">\
						<button type="button">创建</button>\
						<button type="button" onclick="dialog.close();">取消</button>\
					</div>\
				</form>');
	
	form.find("button:first").click(function(){
		var btn = $(this);
		var input = btn.parent().prev();
		if(input.val()) {
			$.post('project/create', {"name":input.val()}, function(data){
				if(!isNaN(data)) {
					projectTree.addNodes(null, [{name:input.val(), id:data, isParent:true, type:"project", projectId:data}]);
					dialog.close();
				} else {
					btn.html("创建失败");
					setTimeout(function(){btn.html('创建');}, 500);
				}
			});
			
			return;
		}
		input.addClass("not_null");
	});
	
	dialog.show().setTitle("创建项目").setBody(form);
});

/*添加建图*/
$("#add_chart").click(function(){
	var project = projectTree.getSelectedNodes()[0];
	var form = $('<form class="dialog_form">\
					<label>UML图名</label>&nbsp;&nbsp;<input type="text" oninput="var input=$(this);if(input.val()) {input.removeClass(\'not_null\')} else {input.addClass(\'not_null\')}"/>\
					<div class="dialog_buttons">\
						<button type="button">确定</button>\
						<button type="button" onclick="dialog.close();">取消</button>\
					</div>\
				<form>');
	
	form.find("button:first").click(function(){
		var btn = $(this),
			input = btn.parent().prev(),
			project = projectTree.getSelectedNodes()[0];
			console.log(project);
		if(input.val()) {
			$.ajax({
			    type	:"post",
				url 	: "domains-chart/create",
				dataType:"json",
				data	:{"name" : input.val(), "projectId":dialog.projectId },
				success : function(data){
					if(!isNaN(data)) {
						if(project.isAjaxing != false){
							projectTree.addNodes(projectTree.getSelectedNodes()[0], [{name:input.val(), id: data, isParent:true, type:"chart", projectId:dialog.projectId}]);
						}
						dialog.close();
					} else {
						btn.html("创建失败");
						setTimeout(function(){btn.html('创建');}, 500);
					}
				},
				error 	: function(){
					alert("添加失败");
				}
			});
			return;
		}
		input.addClass("not_null");
	});
	
	dialog.projectId = project.id;
	console.log(project);
	dialog.show().setTitle("添加UML图").setBody(form);
});

/*
 * 生成代码。生成代码的按钮所在的工具栏已经缓存了当前的画布对象了
 */
mainTab.panels.delegate(".generateCode", "click", function(){
	var form = $('<form class="dialog_form">\
					<label>代码文件包名</label><input type="text" oninput="var input=$(this);if(input.val()) {input.removeClass(\'not_null\')} else {input.addClass(\'not_null\')}"/>\
					<div class="dialog_buttons">\
						<button type="button">确定</button>\
						<button type="button" onclick="dialog.close();">取消</button>\
					</div>\
				</form>');
				
	form.find("button:first").click(function(){
		var input = $(this).parent().prev();
		if(input.val()){
			var canvas = dialog.canvas,
				project = dialog.project,
				chart	= dialog.chart;
			
			var domainsChart = {
					project:{}
				};
				
			var lines = canvas.getLines(),
				models = canvas.getModels();
				
			domainsChart.id 			= "";
			domainsChart.version 		= "";
			domainsChart.name			= chart.name;
			domainsChart.project.id 	= project.id;
			domainsChart.project.name	= project.name;
			domainsChart.lineInfo		= JSON.stringify(lines);
			domainsChart.modelInfo		= JSON.stringify(models);
			
			
			$.each(models, function(i, model){
				delete model.position;
				delete model.domainCharsId;
			});
			domainsChart.domainShapeDtos = models;
			
			console.log(JSON.stringify(domainsChart));
			
			$.ajax({
				headers: { 
			        'Content-Type': 'application/json' 
			    },
				url 	: "domains-chart/gencode?packageName=" + input.val(),
				data 	:  JSON.stringify(domainsChart),
				type	: "post",
				success : function(data){
					window.location.assign(data + "/" + domainsChart.name + ".zip");
				},
				error : function(){
				}
			});
		}
	});
	
	dialog.show().setTitle("生成代码").setBody(form);
	
	var toolBar = $(this).parents(".tools_bar:first");
	dialog.canvas = toolBar.data("canvas");
	dialog.project = toolBar.data("project");
	dialog.chart = toolBar.data("chart");
});

/**
 * 生成代码
 */
mainTab.panels.delegate(".save", "click", function(){
	var toolBar = $(this).parents(".tools_bar:first"),
		canvas = toolBar.data("canvas");
		
	var domainsChart = {
			project:{}
		};
	
	var lines = canvas.getLines(),
		models = canvas.getModels();
		
	domainsChart.id 			= "";
	domainsChart.version 		= "";
	domainsChart.name			= toolBar.data("chart").name;
	domainsChart.project.id 	= toolBar.data("project").id;
	domainsChart.lineInfo		= JSON.stringify(lines);
	domainsChart.domainShapeDtos = models;
	
	$.ajax({
		headers: { 
	        'Accept': 'application/json',
	        'Content-Type': 'application/json' 
	    },
		url 	: "domains-chart/save",
		data 	:  JSON.stringify(domainsChart),
		type	: "post",
		dataType : "json",
		success : function(data){
			console.log(data);
		},
		error :function(){
			
		}
	});
});