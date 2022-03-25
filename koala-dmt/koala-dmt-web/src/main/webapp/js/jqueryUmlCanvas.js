/*切换工具的方法*/
function swichTool(name, canvas){
	var tool 	= canvas.TOOLBAR.find("."+name);
	
	canvas.CURTOOL.type = tool.attr("type");
	canvas.CURTOOL.name = tool.attr("name");
	
	canvas.TOOLBAR.find(".current-tool").removeClass("current-tool");
	tool.addClass("current-tool");
}

function umlCanvas(thiz){
	/*全局变量*/
	var THIS		= this;
	
	this.ZOOM		= 1;						//uml图的缩放值
	this.EASEL		= thiz.find(".uml_easel");	//画布容器（画架）
	this.SVGLINES 	= thiz.find(".uml_lines");  //线条容器
	this.UMLCANVAS 	= thiz.find(".uml_canvas");	//所有图形元素的容器
	this.TOOLBAR	= thiz.find(".tools");		//切换工具的工具栏
	this.CURTOOL	= {type:"cursor",name:null};//当前的工具（currentTool）
	
	
	this.FOCUSITEM	= null;						//当前被选中的节点或线条
	this.CHARTID	= 000000000;				//当前uml图的id
	
	
	/*需要持久化的数据*/
	/*  line的数据结构（伪代码）:
	 	line = {
			description: null
			domainsChartId: 0
			lineId: "8607e7185d7664254f149e80a48c593d"
			relationType: "extends"
			fromShapeId: "527cc94f46ee1a4ff4b63a4b27a62027"
			toShapeId: "0ad536ac6e3166cf7c283fd28f30a2fb"
		}
	 */
	this.LINES 		= {}; 	//所有线条的控制数据(json对象,需要持久化)
	/*model的数据结构请参考tool.js内定义的结构*/
	this.MODELS 	= {}; 	//所有节点的控制数据(json对象,需要持久化)
	
	/*全局缓存*/
	this.LINEDOMS	= {};	//页面上的所有线条对象
	this.NODEDOMS	= {};	//页面上的所有节点对象
	
	/*拖动鼠标画连线*/
	(function(){
		var drawing = false; 	//标志当前状态是否划线状态
		var node1 = node2 = null;		//划线的开始结束节点
		var model1 = model2 = null;		//起点和终点分别对应领域模型
		var startP 	= null;
		var endpoints = null;
		var line;
		var offset;
		
		/*拖动划线*/
		THIS.UMLCANVAS.delegate(".node", "mousedown", function(e){
			if(THIS.CURTOOL.type != "line" || $(this).is(".illegal")) return;
			
			offset 	= THIS.UMLCANVAS.offset();
			drawing = true;
			startP 	= [e.pageX - offset.left, e.pageY - offset.top];
			line 	= svgGraph.drawLine(startP, [e.pageX - offset.left, e.pageY - offset.top],THIS.CURTOOL.name);
			node1 		= $(this);
			
			line.attr("id", commonTool.guid());
			THIS.SVGLINES.append(line);
		})
		.delegate(".node","mouseenter",function(e){ 	//结束节点的获取
			if(THIS.CURTOOL.type != "line") return;
			
			var thiz  = $(this),
				toolName = THIS.CURTOOL.name, 					//toolname
				nodeType = thiz.attr("class").split(" ")[1];	//nodeType
			
			/**
			 * 连线起点的合法性检查
			 * 比如不许多继承，不许重复继承，不许继承接口 。。。。
			 */
			if(!drawing){
				model1 = thiz.data("data");
				if(toolName == "extends") {
					((nodeType == "entity") && (model1.parentName == null)) ? //只能继承类，并且只能单继承
						thiz.addClass("legal") : thiz.addClass("illegal");
				} else if(toolName == "implements"){
					((nodeType == "entity")) ? //只能有类实现接口
						thiz.addClass("legal") : thiz.addClass("illegal");
				} else if(toolName == "aggregate" || toolName == "compose" || toolName == "associate") {
					((nodeType != "interface")) ? 
						thiz.addClass("legal") : thiz.addClass("illegal");
				} else {
					thiz.addClass("illegal");
				}
			}
			
			/*连线终点的合法性检查*/
			if(drawing){
				node2 = $(this);
				model2 = node2.data("data");
				
				if(toolName == "extends"){
					(nodeType == "entity") ?  thiz.addClass("legal") : thiz.addClass("illegal");
				} else if(toolName == "implements"){
					((nodeType == "interface") && ($.inArray(model2.name, model1.implementsNameSet) < 0)) ? 
						thiz.addClass("legal") : thiz.addClass("illegal");
				} else if(toolName == "aggregate" || toolName == "compose" || toolName == "associate"){
					thiz.addClass("legal");
				} else {
					thiz.addClass("illegal");
				}
				
				if($(this).is(".illegal")) node2 = null;
			}
		})
		.delegate(".node", "mouseleave", function(e){ 	//结束节点的取消
			$(this).removeClass("illegal legal");
			node2 = null;
		})
		.mousemove(function(e){						//拖动划线效果
			if(drawing){
				e.preventDefault();
				
				if(node2){
					endpoints = svgGraph.getEndpoints(node1,node2);
				} else {
					endpoints = svgGraph.getEndpoints(node1,[e.pageX - offset.left, e.pageY - offset.top]);
				}
				svgGraph.moveLine(line, endpoints.start , endpoints.end);
			}
		}).mouseup(function(e){ 						//划线成功效果
			if((drawing && node2 == null)){
				line.remove();
			} else if(node2 != null && drawing){
				/*连线的相关逻辑.根据连线生成或更改某些属性*/
				if(line.is(".extends")){
					model1.parentName = model2.name;
				} else if(line.is(".implements")){
					model1.implementsNameSet.push(model2.name);
				} else if(line.is(".aggregate,.compose,.associate")){
					addProperty(node1,"List",model2.name,line.attr("id"));
				} else if(line.is(".")){
					
				}
				
				endpoints = svgGraph.getEndpoints(node1,node2);
				svgGraph.moveLine(line,endpoints.start ,endpoints.end);
				
				var id 	= line.attr("id");
				var type = line.attr("relationType");
				console.log(type);
				if(line.is(".aggregate,.compose,.associate")){
					THIS.LINES[id] = new AssociatedLine(id, type, node1.attr("id"), node2.attr("id"), null);
				} else {
					THIS.LINES[id] = new Line(id, type, node1.attr("id"), node2.attr("id"), null);
				}
				
				THIS.LINEDOMS[id] = line;	//把新增的连线缓存起来
				
				line.attr("class",line.attr("class").replace("templine",""));
			}
			line = null;
			node2 = null;
			node1 = null;
			model1 = null;
			model2 = null;
			drawing = false;
			startP 	= null;
		});
	})();
	
	/*拖动线段形成转折点*/
	(function(){
		var turningPoint,
			startPosition,
			fromNode,
			toNode,
			line,
			lineData,
			draging = false; 	//标志当前状态是否划线状态
		
		/*拖动线段*/
		function drag(e){
			svgGraph.dragLine(fromNode, toNode, [turningPoint[0] + e.clientX - startPosition[0], turningPoint[1] + e.clientY - startPosition[1]], line);
		}
		
		THIS.UMLCANVAS.delegate("polyline", "mousedown", function(e){
			line = $(this);
			line.addClass("draging");
			lineData = THIS.LINES[line.parent().attr("id")];
			fromNode = $("#"+lineData.fromShapeId);
			toNode = $("#"+lineData.toShapeId);
			
			var canvasOffset = THIS.UMLCANVAS.offset();
			turningPoint = [e.clientX - canvasOffset.left, e.clientY - canvasOffset.top];
			startPosition = [e.clientX, e.clientY];
			THIS.UMLCANVAS.bind("mousemove", drag);
			draging = true;
		});
		
		THIS.UMLCANVAS.mouseup(function(e){
			if(draging){
				lineData.turningPoint = [turningPoint[0]+e.clientX-startPosition[0], turningPoint[1]+e.clientY-startPosition[1]];
				lineData.lineType = "turning_line";
				THIS.UMLCANVAS.unbind("mousemove", drag);
				line.removeClass("draging");
				
				lineData.startPoint = line.attr("points").split(" ")[0].split(",");
				lineData.endPoint = line.attr("points").split(" ")[2].split(",");
				
				console.log(JSON.stringify(THIS.LINES));
				
				draging = false;
				line = null;
				toNode = null;
				fromNode = null;
				turningPoint = null;
				startPosition = null;
			}
		});
	})();
	
	/*拖拽节点，线条联动*/
	(function(){
		var target 			= null;	//被拖动的元素
		var startPosition 	= null;	//被拖动元素开始的位置
		var downPosition 	= null;	//鼠标点击的初始位置
		var relatedLines 	= null;	//与被拖动节点相连的线
		var moving			= false;//
		var endPoints		= null;
		/*拖拽节点事件处理函数*/
		var drag = function(e){
			e.preventDefault();
			target.css({
				top : startPosition.top  + e.clientY - downPosition.top  + THIS.EASEL.scrollTop(),
				left: startPosition.left + e.clientX - downPosition.left + THIS.EASEL.scrollLeft()
			});
			
			/*改变连线*/
			svgGraph.resetLines(target, THIS.NODEDOMS, THIS.LINEDOMS, relatedLines.outLines, relatedLines.inLines);
		};
		
		THIS.UMLCANVAS.delegate(".header", "mousedown", function(e){
			if(THIS.CURTOOL.type != "line" && !$(e.target).is("input")){
				target 			= $(this).parent();
				startPosition 	= target.position();
				downPosition 	= {left : e.clientX ,top : e.clientY};
				relatedLines 	= commonTool.findRelatedLines(target.attr("id"),THIS.LINES);
				startPosition.top = startPosition.top - THIS.EASEL.scrollTop();
				startPosition.left = startPosition.left - THIS.EASEL.scrollLeft();
				THIS.UMLCANVAS.bind("mousemove",drag);
				moving = true;
			}
		}).mouseup(function(){
			if(moving){
				THIS.UMLCANVAS.unbind("mousemove",drag);
				var model  = THIS.MODELS[target.attr("id")];
				model.position.x = target.position().left;
				model.position.y = target.position().top;
				
				moving = false;
			}
		});
	})();
	
	/*点击鼠标添加节点*/
	THIS.UMLCANVAS.delegate("svg", "mousedown", function(e){
		if(THIS.CURTOOL.type == "node"){
			addNode(e, null, THIS);
		}
		
		/*当画布被点击一次时，如果当前不是线条工具，将工具切换回鼠标工具*/
		if(THIS.CURTOOL.type != "line"){
			swichTool("cursor",THIS);
		}
		//return false;
	});
	
	THIS.UMLCANVAS.contextmenu(function(e){
		var target = $(e.target);
		if(target.is("svg")){
			showContextmenu(target, e, "add_nodes", null, THIS);
		}
	});
	
	/*点击节点，添加属性或行为*/
	THIS.UMLCANVAS.delegate(".node", "click", function(e){
		var node = $(this);
		if(THIS.CURTOOL.name == "property"){			//添加属性
			addProperty(node,"String");
		} else if(THIS.CURTOOL.name == "action"){ 	//添加行为
			addAction(node);
		} 
		var relatedLines = commonTool.findRelatedLines(node.attr("id"),THIS.LINES);
		svgGraph.resetLines(node,THIS.NODEDOMS,THIS.LINEDOMS,relatedLines.outLines,relatedLines.inLines);
		
		node.removeClass("illegal legal"); //移除残留的class
		swichTool("cursor", THIS);
	});
	
	/*点击工具切换*/
	THIS.TOOLBAR.delegate(".cursor,.node,.line,.component", "click", function(e){
		swichTool($(this).attr("name").toLowerCase(), THIS);
	});
	
	/** 
	 * 编辑节点名字 
	 */
	THIS.UMLCANVAS.delegate(".name", "dblclick", function(e){
		var node 	= $(this).parents(".node"),
			dmodel 	= node.data("data");
	});
	
	/*工具栏切换*/
	THIS.TOOLBAR.find(".swich_tool_view").click(function(){
		var thiz = $(this);
		if($(this).data("closed")){
			thiz.data("closed",false);
			thiz.parent().addClass("folder");
		} else {
			thiz.data("closed",true);
			thiz.parent().removeClass("folder");
		}
	});	
	
	/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓鼠标滑过线条提示，增加体验↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
	//鼠标滑过，线条变粗
	THIS.SVGLINES.delegate(".line:not(.templine)", "mouseenter", function(e){
		var line = THIS.LINES[$(this).attr("id")],
			from = THIS.NODEDOMS[line.fromShapeId],
			l	= THIS.LINEDOMS[line.lineId];	
			
		l.attr("class",l.attr("class") + " active");
		from.find("."+line.lineId).addClass("active");
	}).delegate(".line:not(.templine)","mouseout",function(e){
		var line = THIS.LINES[$(this).attr("id")],
			from = THIS.NODEDOMS[line.fromShapeId],
			l	= THIS.LINEDOMS[line.lineId];
			
		l.attr("class",l.attr("class").replace(" active", ""));
		from.find("."+line.lineId).removeClass("active");
	});
	/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑鼠标滑过线条提示，增加体验↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
	
	
	/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓右键功能↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
	/*右键添加属性或行为或枚举项等等*/
	THIS.UMLCANVAS.delegate(".node","contextmenu", function(e){
		var thiz = $(this), selector;
		
		if(thiz.is(".entity")){ 			//右键实体，添加属性和行为
			selector = "entity";
		} else if(thiz.is(".interface")){ 	//右键接口，添加行为和常量
			selector = "interface";
		} else if(thiz.is(".enum")){ 		//右键枚举，添加枚举项
			selector = "enum";
		}
		
		showContextmenu(thiz, e, "add_members", selector, THIS);
	});
	
	/*编辑线条的右键菜单*/
	THIS.SVGLINES.delegate(".line","contextmenu",function(e){
		showContextmenu($(this), e, "edit_lines", null, THIS);
	});
	/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑右键功能↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
	
	/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓对话框编辑功能↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
	THIS.UMLCANVAS.delegate(".node", "mousedown", function(){
		if(THIS.CURTOOL.type == "cursor"){
			editDialog.initDialog($(this),THIS);
		}
		return false;
	});
	/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑对话框编辑功能↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
	
	
	THIS.UMLCANVAS.comboBox({
		option : ".option",
		seleted : ".selected",
		optionList : "<div class='option_list'><div class='option'>*</div><div class='option'>1</div></div>",
		target : ".multiplicity",
		format : function(target, option){
			var value = option.html();
			if(value == "*"){
				
			} else if(value == "1"){
				
			}
			
			return value;
		}
	});
};

umlCanvas.prototype = {
	getModels : function(){
		var models = [];
		
		for(temp in this.MODELS){
			models.push(this.MODELS[temp]);
		}
		
		return models;
	},
	
	getLines : function(){
		var temp, lines = [];
		for(temp in this.LINES){
			lines.push(this.LINES[temp]);
		}
		
		return lines;
	}
};

$.fn.umlCanvas = function(){
	$(this).find(".tools_bar:first").data("canvas", new umlCanvas($(this)));
}

/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓全局性事件↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
/*收起右键菜单*/
$("#edit_contextmenus .contextmenu").blur(function(){
	$(this).slideUp(50);
});
//右键菜单添加领域模型
$("#add_nodes").delegate(".contextmenu_item","click",function(e){
	var thiz 	= $(this), 
		canvas	= thiz.parent().data("canvas");
		
	if(thiz.is(".add_entity")){
		addNode(e,"ENTITY",canvas);
	} else if(thiz.is(".add_interface")){
		addNode(e,"INTERFACE",canvas);
	} else if(thiz.is(".add_enum")){
		addNode(e,"ENUM",canvas);
	}
	
	thiz.parent(".contextmenu").blur();
});

/*右键菜单添加行为或属性*/
$("#add_members").delegate(".contextmenu_item","click",function(e){
	var thiz  	= $(this) ,
		target 	= thiz.parent().data("target"),
		canvas	= thiz.parent().data("canvas");
	
	if(thiz.is(".add_property")){
		addProperty(target,"String");
	} else if(thiz.is(".add_action")){
		addAction(target);
	} else if(thiz.is(".add_enumItem")){
		addEnumItem(target);
	} else if(thiz.is(".delete")){
		deleteNode(target,canvas);
	}
	
	thiz.parent(".contextmenu").blur();
});

/*右键编辑 */
$("#edit_lines").delegate(".contextmenu_item","click",function(){
	var thiz = $(this),
		target = thiz.parent().data("target"),
		canvas = thiz.parent().data("canvas"),
		line = canvas.LINES[target.attr("id")];
	if(thiz.is(".delete")){
		deleteLines([line],canvas);
	}
	thiz.parent(".contextmenu").blur();
});
/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑全局性事件↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
