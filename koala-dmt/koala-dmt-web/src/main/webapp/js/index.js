$(".dialog").each(function(i, item){
	$(item).tab();
});

var setting = {
	callback : {
		onClick : function(event, treeId, treeData){
			console.log(mainTab.isExistTab(treeData.id));
			if(treeData.type == "chart" && !mainTab.isExistTab(treeData.id)){
				mainTab.addTab({
					title : "title",
					afterAdd : function(tab, panel){
						tab.addClass("tab_"+treeData.id);
						$.get('pages/template.html').done(function(data) {
							panel.html(data);
							panel.find('#canvas').umlCanvas();
						});
						panel.umlCanvas();
					},
					closeable : true
				});
			}
		}
	}
};

/*常用的三个变量*/
var projectTree = $.fn.zTree.init($("#projectTree"), setting, []); //工程树
var mainTab = $(".main_panel").tab(); //右边tab
var dialog = $().dialog({});		  //页面对话框

$.ajax({
	url : "project/find-all-projects",
	data : "",
	type : "get",
	dataType : "json",
	success : function(data){
		$.each(data, function(i, d){
			d.isParent = true;
			d.type = "project";
		});
		projectTree.addNodes(null, data);
	},
	error : function(){
		alert("获取工程出错");
	}
});

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
		alert("请正确选择工程");
		return;
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
/*mainTab.PANELS.delegate(".generateCode", "click", function(){
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
});*/



/*创建工程*/
function createProject(btn){
	var input = btn.parent().prev();
	if(input.val()){
		$.post('project/create', {"project.name":input.val()}, function(data){
			if(data == "success"){
				projectTree.addNodes(null, [{name:input.val(), isParent:true, type:"project"}]);
				dialog.close();
			} else {
				btn.html("创建失败");
				setTimeout("btn.html('确定')", 500);
			}
		});
		
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
		    type:"post",
			url : "domains-chart/create",
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