/*主类*/
function umlCanvas(){
	/*画图工具*/
	var commonTool 	= this.commonTool; 	//
	var svgGraph 	= this.svgGraph;	//svg画线工具
	var domGraph 	= this.domGraph;	//画html节点的工具
	
	/*全局变量*/
	var zoom			= 1;						//uml图的缩放值
	var svgLines 		= $("#lines");    			//线条容器
	var umlCanvas 		= $("#uml_canvas");			//所有图形元素的容器
	var canvas_offset 	= umlCanvas.offset();		//总容器的位置
	var focusItem 		= null;						//当前被选中的元素
	var toolBar			= $("#tools");			//切换工具的工具栏
	var curTool			= {type:"cursor",name:null};//当前的工具（currentTool）
	var focusItem		= null;						//当前被选中的节点或线条
	
	//全局缓存
	var lines 		= []; 	//页面上的所有线条对象以及所有线条的控制数据(json格式)
	var nodes 		= []; 	//页面上的所有节点对象以及所有节点的控制数据(json格式)
	
	
	/*拖动鼠标画连线*/
	var drawing 	= false; 				//标志当前状态是否划线状态
	var startNode 	= endNode = null;		//划线的开始结束节点
	var endpoints 	= null;
	var startP 		= null;
	var line;
	umlCanvas.delegate(".node","mousedown",function(e){
		if($(e.target).is(".name") || curTool.type != "line") return;
		
		drawing 	= true;
		startNode 	= $(this);
		startP 		= [e.clientX - canvas_offset.left ,e.clientY - canvas_offset.top];
		line 		= svgGraph.drawLine(startP,[e.clientX,e.clientY],curTool.name);
		
		line.attr("id",commonTool.guid());
		svgLines.append(line);
	}).delegate(".node","mouseenter",function(e){ 	//结束节点的获取
		if(drawing){ endNode = $(this);}
	}).delegate(".node","mouseleave",function(e){ 	//结束节点的取消
		if(drawing){ endNode = null;}
	}).mousemove(function(e){ 						//拖动划线效果
		if(drawing){
			e.preventDefault();
			svgGraph.moveLine(line,startP ,[e.clientX - canvas_offset.left,e.clientY - canvas_offset.top]);
		}
	}).mouseup(function(e){ 	//划线成功效果
		if((drawing && endNode == null)){
			line.remove();
		} else if(endNode != null && drawing){
			endpoints = svgGraph.getStartEnd(startNode,endNode);
			svgGraph.moveLine(line,endpoints.start ,endpoints.end);
			/*把新增的连线缓存起来*/
			var id = line.attr("id");
			lines[id] = {
				lineObj : line,
				from 	: startNode.attr("id"),
				to		: endNode.attr("id"),
				type	: 1
			};
		}
		
		line = null;
		endNode = null;
		startNode = null;
		drawing = false;
		startP = null;
	});
	
	/*点击鼠标添加节点*/
	umlCanvas.delegate("svg","click",function(e){
		if(curTool.type == "node"){
			var position = {
					left:e.clientX - canvas_offset.left,
					top:e.clientY - canvas_offset.top
				};
			var newNode = domGraph.addNode($("#node-template ."+curTool.name).clone(),position,umlCanvas,commonTool.guid());
			//把节点数据缓存起来，以便以后获取
			var id = newNode.attr("id");
			nodes[id] = {
				nodeObj : newNode,
				top:position.top,
				left:position.left,
				width:200
			};
			commonTool.maintainDataList("property_type_tip",1,"class",id);
		}
		
		/*当画布被点击一次时，如果当前不是线条工具，将工具切换回鼠标工具*/
		if(curTool.type == "node"){
			swichTool("cursor");
		}
	});
	
	/*点击节点，添加属性或行为*/
	umlCanvas.delegate(".node","click",function(e){
		if(curTool.name == "property"){	//添加属性
			$(this).find(".properties").append($("#node-template .property").clone());
		} else if(curTool.name == "action"){ //添加行为
			$(this).find(".actions").append($("#node-template .action").clone());
		}
		var relatedLines = commonTool.findRelatedLines($(this).attr("id"),lines);
		svgGraph.resetLines($(this),nodes,lines,relatedLines.outLines,relatedLines.inLines);
		
		swichTool("cursor");
	});
	
	/*拖拽节点*/
	/*拖拽节点事件处理函数*/
	var drag = function(e){
		e.preventDefault();
		e.data.target.css({
			top	: e.data.startPosition.top + e.clientY - e.data.downPosition.top,
			left: e.data.startPosition.left + e.clientX - e.data.downPosition.left
		});
		
		/*改变连线*/
		svgGraph.resetLines(e.data.target, nodes, lines, e.data.outLines, e.data.inLines);
	};
	
	umlCanvas.mousedown(function(e) {
		header = $(e.target);
		if(header.is(".name") || header.is(".header")){
			var target = header.parents(".node");					//被拖动的元素
			var startPosition = target.position();					//被拖动元素开始的位置
			var downPosition = {left : e.clientX ,top : e.clientY};	//鼠标点击的初始位置
			
			var relatedLines = commonTool.findRelatedLines(header.parent().attr("id"),lines);
			
			$(this).bind( //绑定拖动事件
				"mousemove",{
					target 			: target,			//被拖动的元素
					startPosition	: startPosition,	//被拖动元素的初始位置
					downPosition	: downPosition,		//鼠标按下的位置
					outLines		: relatedLines.outLines, 		//从节点出发的线（出度）
					inLines			: relatedLines.inLines			//指向节点的线（入度）
				},drag);
		}
	}).mouseup(function(){
		$(this).unbind("mousemove",drag);
	});
	
	/*点击工具切换*/
	$("#tools").delegate(".node,.line,.component","click",function(e){
		swichTool($(this).attr("class").split(" ")[1]);
	});
	
	/** 
	 * 编辑节点名字 
	 */
	umlCanvas.delegate(".name","dblclick",function(e){
		/*编辑节点名字*/
		$(this).miniedit({
			type:'input',
			css:{"margin-left":"-2px","margin-top":"-2px",height:"14px"},
			afterEdit:function(target,input){
				if(input.val() == ""){
					alert("请输入属性名");
					input.focus();
					return false;
				} else {
					return true;
				}
			}
		});
	});
	
	/* 双击方式编辑属性或行为 */
	umlCanvas.delegate(".properties,.actions,.name","dblclick",function(e){
		e.preventDefault();
		var thiz = $(this),t=$(e.target);
		
		if(t.is(".propertyName")){ 		//编辑节点名字
			t.miniedit({ //利用一个行内编辑插件编辑
				type:'input',
				css:{height:"14px","margin-top":"-1px"},
				afterEdit:function(target,input){
					if(input.val() == ""){
						alert("请输入属性名");
						input.focus();
						return false;
					} else {
						commonTool.maintainDataList();
						return true;
					}
				}
			});
		} else if(t.is(".propertyType")){ //编辑参数
			t.miniedit({
				type:'input',
				dataList:"property_type_tip",
				css:{"min-width" : "50%",height:"14px","margin-top":"-1px"},
				afterEdit:function(target,input){
					if(input.val() == ""){
						alert("请输入属性类型");
						input.focus();
						return false;
					} else {
						return true;
					}
				}
			});
		} else if(t.is(".actionName")){
			t.miniedit({
				type:'input',
				css:{height:"16px"},
				afterEdit:function(target,input){
					if(input.val() == ""){
						alert("请输入方法名");
						input.focus();
						return false;
					} else {
						return true;
					}
				}
			});
		}
		
		//节点尺寸改变，需要重画连线
		
	});
	
	/*右键添加属性或行为或枚举项等等*/
	umlCanvas.delegate(".node","contextmenu",function(e){
		e.preventDefault();
		var thiz = $(this);
		var position = commonTool.mousePosition(e);
		
		if(thiz.is(".entity")){ 			//右键实体，添加属性和行为
			showContextmenu(e,"add_members");
		} else if(thiz.is(".interface")){ 	//右键接口，添加行为和常量
			alert(2);
		} else if(thiz.is(".enum")){ 		//右键枚举，添加枚举项
			alert(3);
		}
	});
	
	$("#edit_contextmenus").delegate(".contextmenu","click",function(){
		$(this).hide();
	});
	
	/*切换工具的方法*/
	function swichTool(name){
		var tool = toolBar.find("."+name);
		var curtool  = tool.attr("class").split(" ");
		
		curTool.type = curtool[0];
		curTool.name = curtool[1];
		
		toolBar.find(".current-tool").removeClass("current-tool");
		tool.addClass("current-tool");
	}
	
	/*显示右键菜单*/
	function showContextmenu(e,menuName){
		var position = commonTool.mousePosition(e);
		
		$("#"+menuName).css({
			display	: "block",
			top		: position.top,
			left	: position.left
		});
	}
	
	/*添加属性*/
	function addProperty(target){
		
	}
	
	/*添加行为*/
	function addAction(target){
		
	}
	
	/*添加枚举项*/
	function addEnumItem(target){
		
	}
};