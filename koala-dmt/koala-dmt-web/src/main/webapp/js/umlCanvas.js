/*主类*/
function umlCanvas(){
	var debugDiv = $("#debug");
	var debug = function(text){
		debugDiv.html(text+"");
	};
	
	/*画图工具*/
	var commonTool 	= this.commonTool; 	//
	var svgGraph 	= this.svgGraph;	//svg画线工具
	var domGraph 	= this.domGraph;	//画html节点的工具
	
	/*全局变量*/
	var svgLines 		= $("#lines");    			//线条容器
	var umlCanvas 		= $("#uml_canvas");			//所有图形元素的容器
	var canvas_offset 	= umlCanvas.offset();		//总容器的位置
	var focusItem 		= null;						//当前被选中的元素
	var toolBar			= $("#tool_bar");			//切换工具的工具栏
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
	});
	
	/*点击节点，添加属性或行为*/
	umlCanvas.delegate(".node","click",function(e){
		if(curTool.name == "attribute"){	//添加属性
			$(this).find(".properties").append($("#node-template .property").clone());
		} else if(curTool.name == "action"){ //添加行为
			$(this).find(".actions").append($("#node-template .action").clone());
		}
		var relatedLines = commonTool.findRelatedLines($(this).attr("id"),lines);
		svgGraph.resetLines($(this),nodes,lines,relatedLines.outLines,relatedLines.inLines);
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
		if($(this).is(".node")){
			curTool.type = "node";
		} else {
			curTool.type = "line";
		}
		curTool.name = $(this).attr("class").split(" ")[1];
		
		$("#tools").find(".current-tool").removeClass("current-tool");
		$(this).addClass("current-tool");
	});
	
	/*右键把工具切换为“鼠标工具”*/
	umlCanvas.contextmenu(function(e){
		if(e.button == 2){
			e.preventDefault();
			curTool.type = "cursor";
			curTool.name = null;
			
			$("#tools").find(".current-tool").removeClass("current-tool");
			$("#tools .cursor").addClass("current-tool");
		}
	});
	
	/** 
	 * 编辑节点名字并显示添加属性和行为操作按钮 
	 */
	$("#uml_canvas").delegate(".name","dblclick",function(e){
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
	
	/* 编辑属性或行为 */
	$("#uml_canvas").delegate(".properties,.actions","dblclick",function(e){
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
};

umlCanvas.prototype = {
	/*线条画笔工具*/
	svgGraph : {
		/*画一条线*/
		drawLine : function(start ,end , name){
			var line = $("#line-template ."+name).clone();
			var path = line.children();
			
			/*线条的路径*/
			path.attr("d", 
				"M" + start[0] 	+ "," + start[1] 	+ " " + 
				"L" + end[0] 	+ "," + end[1] 		+ " ");
				
			return line;
		} ,
		
		/*移动一条直线*/
		moveLine : function(line ,start ,end){
			line.children("path").attr("d", 
				"M" + start[0] 	+ "," + start[1] 	+ " "+
				"L" + end[0] 	+ "," + end[1] 		+ " ");
		},
		
		//重构所有连向某个结点的线的显示，传参结构为nodes数组的一个单元结构
		resetLines : function(node, nodes, lines, outLines, inLines) {
			var line,startNode,endNode;
			var endPoints;
			
			/*重画指出的线*/
			for(var i in outLines){
				endpoints = this.getStartEnd(node,nodes[outLines[i].to].nodeObj);
				this.moveLine(lines[i].lineObj, endpoints.start, endpoints.end);
			}
			
			/*重画指入的线*/
			for(var i in inLines){
				endpoints = this.getStartEnd(nodes[inLines[i].from].nodeObj,node);
				this.moveLine(lines[i].lineObj, endpoints.start, endpoints.end);
			}
		},
		
		/*在画直线时，根据两个节点计算连线起止点*/
		getStartEnd : function(n1, n2) {
			var start = [],	end = [];
			//左右判断：
			var x11 = n1.position().left , x12 = n1.position().left + n1.outerWidth(), 
				x21 = n2.position().left , x22 = n2.position().left + n2.outerWidth();
				
			//结点2在结点1左边
			if (x11 >= x22) {
				start[0] = x11;
				end[0] = x22;
			} else if (x12 <= x21) {
				start[0] = x12;
				end[0] = x21;
			} else if (x11 <= x21 && x12 >= x21 && x12 <= x22) { //结点2在结点1水平部分重合
				start[0] = (x12 + x21) / 2;
				end[0] = start[0];
			} else if (x11 >= x21 && x12 <= x22) {
				start[0] = (x11 + x12) / 2;
				end[0] = start[0];
			} else if (x21 >= x11 && x22 <= x12) {
				start[0] = (x21 + x22) / 2;
				end[0] = start[0];
			} else if (x11 <= x22 && x12 >= x22) {
				start[0] = (x11 + x22) / 2;
				end[0] = start[0];
			}
	
			//上下判断：
			var y11 = n1.position().top, y12 = n1.position().top + n1.outerHeight(), 
				y21 = n2.position().top, y22 = n2.position().top + n2.outerHeight();
				
			//结点2在结点1上边
			if (y11 >= y22) {
				start[1] = y11;
				end[1] = y22;
			} else if (y12 <= y21) { //结点2在结点1下边
				start[1] = y12;
				end[1] = y21;
			} else if (y11 <= y21 && y12 >= y21 && y12 <= y22) { //结点2在结点1垂直部分重合
				start[1] = (y12 + y21) / 2;
				end[1] = start[1];
			} else if (y11 >= y21 && y12 <= y22) {
				start[1] = (y11 + y12) / 2;
				end[1] = start[1];
			} else if (y21 >= y11 && y22 <= y12) {
				start[1] = (y21 + y22) / 2;
				end[1] = start[1];
			} else if (y11 <= y22 && y12 >= y22) {
				start[1] = (y11 + y22) / 2;
				end[1] = start[1];
			}
			
			return {
				"start" : start,
				"end" 	: end
			};
		}
	},

	/*画html节点的画笔*/
	domGraph : {
		/*添加节点*/
		addNode : function(dom,position,canvas,id){
			canvas.append(dom);
			dom.css({
				left:position.left,
				top:position.top
			}).attr("id",id);
			return dom;
		},
		
		/*选中节点*/
		focusItem : function(){
			
		},
		
		/*删除节点时，需要级联删除连线和与连线有关系的属性*/
		deleteNode : function(){
			
		},
		
		/*更新节点时，需要级联更新*/
		updateNode : function(){
			
		}
	},
	/*
	 * 部分关系到节点和连线的操作，以及所有跟连线和节点无关的操作放在commonTool里
	 */
	commonTool : {
		/*用随机数作为元素的id*/
		guid : function() {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}
		  	return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
		},
		
		/*找出和某个节点连接的所有线条（分连出和连入两种）*/
		findRelatedLines : function(nodeId,lines){
			var outLines = [], inLines = [];
			for(var i in lines){
				if(lines[i].to == nodeId){
					inLines[i] = lines[i];
				} else if(lines[i].from == nodeId){
					outLines[i] = lines[i];
				}
			}
			
			return {
				outLines : outLines,
				inLines : inLines
			};
		},
		
		/*维护输入提示信息，包括添加、删除等操作.option参数为2时表示更新，为1时表示添加，为0时表示删除*/
		maintainDataList : function(listId,option,data,classSelector){
			var dataList = $("#"+listId);
			if(option == 1 && dataList.find("."+classSelector).length == 0){
				dataList.append($("<option/>").val(data).addClass(classSelector));
			} else if(option == 2){
				dataList.find("."+classSelector).val(data);
			} else if(option ==  0){
				$("#"+listId).remove("."+classSelector);
			}
		},
		
		/**
		 * 当节点的dom对象信息更新时，对应的节点缓存信息同步更新。导致调用该方法的事件 包括
		 * 节点名、属性名、属性类型、行为名、行为参数名、行为参数类型、行为返回值等信息更改
		 */
		maintainNodesData : function(){
			
		}
	}
};