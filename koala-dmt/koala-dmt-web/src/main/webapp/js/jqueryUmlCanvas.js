/*切换工具的方法*/
function swichTool(name, canvas){
	var tool 	= canvas.TOOLBAR.find("."+name);
	
	canvas.CURTOOL.type = tool.attr("type");
	canvas.CURTOOL.name = tool.attr("name");
	
	canvas.TOOLBAR.find(".current-tool").removeClass("current-tool");
	tool.addClass("current-tool");
}

function /**
 * @author LW
 *
 */
/**
 * @author LW
 *
 */
umlCanvas(thiz, renderData){
	/*全局变量*/
	var THIS		= this;
	
	this.ZOOM		= 1;						//uml图的缩放值
	this.EASEL		= thiz.find(".uml_easel");	//画布容器（画架）
	this.SVGLINES 	= thiz.find(".uml_lines");  //线条容器
	this.UMLCANVAS 	= thiz.find(".uml_canvas");	//所有图形元素的容器
	this.TOOLBAR	= thiz.find(".uml_tools");		//切换工具的工具栏
	this.CURTOOL	= {type:"cursor",name:null};//当前的工具（currentTool）
	
	
	this.FOCUSITEM	= null;						//当前被选中的节点或线条
	this.CHARTID	= 000000000;				//当前uml图的id
	
	
	/*需要持久化的数据*/
	/*  line的数据结构（伪代码）:
	 	line = {
			description: null
			domainsChartId: 0
			id: "8607e7185d7664254f149e80a48c593d"
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
		var line = null;
		var offset = null;
		
		/*拖动划线*/
		THIS.UMLCANVAS.delegate(".node", "mousedown", function(e){
			if(THIS.CURTOOL.type != "line" || $(this).is(".illegal")) return;
			
			drawing = true;
			node1 	= $(this);
			offset 	= THIS.UMLCANVAS.offset();
			startP 	= [e.pageX - offset.left, e.pageY - offset.top];
			line 	= THIS.drawLine(startP, [e.pageX - offset.left, e.pageY - offset.top], THIS.CURTOOL.name);
			THIS.SVGLINES.append(line);
		})
		.delegate(".node","mouseenter",function(e){ 	//结束节点的获取
			if(THIS.CURTOOL.type != "line") return;
			
			var thiz  = $(this),
				toolName = THIS.CURTOOL.name, 				//toolname
				nodeType = thiz.attr("class").split(" ")[1];	//nodeType
			
			/**
			 * 连线起点的合法性检查
			 * 比如不许多继承，不许重复继承，不许继承接口 。。。。
			 */
			if(!drawing){
				model1 = thiz.data("data");
				if(toolName == "extends") {
					((nodeType == "entity") && (model1.parentId == null)) ? //只能继承类，并且只能单继承
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
					((nodeType == "interface") && ($.inArray(model2.id, model1.implementsIdSet) < 0)) ? 
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
					endpoints = THIS.getEndpoints(node1,node2);
				} else {
					endpoints = THIS.getEndpoints(node1,[e.pageX - offset.left, e.pageY - offset.top]);
				}
				THIS.moveLine(line, endpoints.start , endpoints.end);
			}
		}).mouseup(function(e){					//划线成功效果
			if((drawing && node2 == null)){
				line.remove();
			} else if(node2 != null && drawing){
				var lineData = null;
				var type = line.attr("relationType");
				lineData = new Line(type, node1.attr("id"), node2.attr("id"), null);
				
				/*连线的相关逻辑.根据连线生成或更改某些属性*/
				if(line.is(".extends")){
					model1.parentId = model2.id;
				} else if(line.is(".implements")){
					model1.implementsIdSet.push(model2.id);
				} else if(line.is(".aggregate,.compose,.associate")){
					lineData = new AssociatedLine(type, node1.attr("id"), node2.attr("id"), null);
					/*自动获取不重复的命名*/
					var name = getName("property", (function(){
						var namespace = [];
						$.each(model1.properties, function(i,p){
							namespace.push(p.name);
						});
						return namespace;
					})());
					var property1 = new Property(name, model2.name, lineData.id);
					
					/*自动获取不重复的命名*/
					name = getName("property", (function(){
						var namespace = [];
						$.each(model2.properties, function(i,p){
							namespace.push(p.name);
						});
						return namespace;
					})());
					var property2 = new Property(name, model1.name, lineData.id);
					addProperty(model1, property1, true);
					addProperty(model2, property2, true);
				}
				
				var lineId = lineData.id;
				THIS.LINES[lineId] = lineData;
				THIS.LINEDOMS[lineId] = line;	//把新增的连线缓存起来
				line.attr("class", line.attr("class").replace("templine", "")).attr("id", lineId);
				THIS.resetLine(line);
				
				if(line.is(".aggregate,.compose,.associate")){
					var l = THIS.LINES[lineId];
					
					var start = line.children("foreignobject").children(".start");
					var end	= line.children("foreignobject").children(".end");
					
					l.multiplicity.start.name = "property1";
					l.multiplicity.start.position = start.position();
					
					console.log(start.position());
					
					l.multiplicity.end.name="property2";
					l.multiplicity.end.position = end.position();
				}
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
		var turningPoint = null,
			startPosition = null,
			fromNode = null,
			toNode = null,
			line = null,
			lineData = null,
			draging = false; 	//标志当前状态是否划线状态
		
		/*拖动线段*/
		function drag(e){
			THIS.dragLine(fromNode, toNode, [turningPoint[0] + e.clientX - startPosition[0], turningPoint[1] + e.clientY - startPosition[1]], line);
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
				
				lineData.points = line.attr("points");
				
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
		/*拖拽节点事件处理函数*/
		var drag = function(e){
			e.preventDefault();
			target.css({
				top : startPosition.top  + e.clientY - downPosition.top  + THIS.EASEL.scrollTop(),
				left: startPosition.left + e.clientX - downPosition.left + THIS.EASEL.scrollLeft()
			});
			
			/*改变连线*/
			THIS.resetLines(target, relatedLines.outLines, relatedLines.inLines);
		};
		
		THIS.UMLCANVAS.delegate(".header", "mousedown", function(e){
			if(THIS.CURTOOL.type != "line" && !$(e.target).is("input")){
				target 			= $(this).parent();
				startPosition 	= target.position();
				downPosition 	= {left : e.clientX ,top : e.clientY};
				relatedLines 	= THIS.findRelatedLines(target.attr("id"));
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
	
	/*节点内容变动时，重置连线*/
	THIS.UMLCANVAS.delegate(".node", "DOMNodeInserted DOMCharacterDataModified", function(e){
		var target = $(this);
		var relatedLines 	= THIS.findRelatedLines(target.attr("id"));
		/*改变连线*/
		THIS.resetLines(target, relatedLines.outLines, relatedLines.inLines);
	});
	
	/*点击鼠标添加节点*/
	THIS.UMLCANVAS.delegate("svg", "mousedown", function(e){
		if(THIS.CURTOOL.type == "node"){
			var offset = THIS.UMLCANVAS.offset();
			var position = {
					x:e.pageX - offset.left,
					y:e.pageY - offset.top
				};
			var type = THIS.CURTOOL.name;
			
			var modelName = getName(type.toLowerCase(), getNodeNameSpace(THIS.MODELS)).firstUpcase();
			
			var model = null;
			if(type == "ENTITY"){
				model = new EntityShape(modelName, position, type, "", false, false);
			} else if(type == "INTERFACE"){
				model = new InterfaceShape(modelName, position, type, "");
			} else if(type == "ENUM"){
				model = new EnumShape(modelName, position, type, "");
			}
			
			addNode(THIS, model);
		}
		
		/*当画布被点击一次时，如果当前不是线条工具，将工具切换回鼠标工具*/
		if(THIS.CURTOOL.type != "line"){
			swichTool("cursor", THIS);
		}
		//return false;
	});
	
	THIS.UMLCANVAS.contextmenu(function(e){
		var target = $(e.target);
		if(target.is("svg")){
			THIS.showContextmenu(target, e, "add_nodes", null, THIS);
		}
	});
	
	/*点击节点，添加属性或行为*/
	THIS.UMLCANVAS.delegate(".node", "click", function(e){
		var node = $(this);
		if(THIS.CURTOOL.name == "property"){			//添加属性
			var name = getName("property", (function(){
					var namespace = [];
					$.each(node.data("data").properties, function(i,p){
						namespace.push(p.name);
					});
					return namespace;
				})());
			
			var property = new Property(name, "String");
			
			addProperty(node.data("data"), property, true);
		} else if(THIS.CURTOOL.name == "action"){ 	//添加行为
			/*自动获取不重复的命名*/
			var actionName = getName("action", (function(){
				var namespace = [];
				$.each(node.data("data").actions, function(i, a){
					namespace.push(a.name);
				});
				return namespace;
			})());
			var action = new Action(actionName);
			addAction(node.data("data"), action, true);
		} 
		var relatedLines = THIS.findRelatedLines(node.attr("id"));
		THIS.resetLines(node, relatedLines.outLines, relatedLines.inLines);
		
		node.removeClass("illegal legal"); //移除残留的class
		swichTool("cursor", THIS);
	});
	
	/*点击工具切换*/
	THIS.TOOLBAR.delegate(".cursor,.node,.line,.component", "click", function(e){
		swichTool($(this).attr("name").toLowerCase(), THIS);
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
	
	/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓右键功能↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
	/*右键添加属性或行为或枚举项等等*/
	THIS.UMLCANVAS.delegate(".node", "contextmenu", function(e){
		var thiz = $(this), selector = null;
		
		if(thiz.is(".entity")){ 			//右键实体，添加属性和行为
			selector = "entity";
		} else if(thiz.is(".interface")){ 	//右键接口，添加行为和常量
			selector = "interface";
		} else if(thiz.is(".enum")){ 		//右键枚举，添加枚举项
			selector = "enum";
		}
		
		THIS.showContextmenu(thiz, e, "add_members", selector, THIS);
	});
	
	/*编辑线条的右键菜单*/
	THIS.SVGLINES.delegate(".line","contextmenu", function(e){
		THIS.showContextmenu($(this), e, "edit_lines", null, THIS);
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
	
	/*g*/
	THIS.UMLCANVAS.comboBox({
		option : ".option",
		seleted : ".selected",
		optionList : "<div class='option_list'><div class='option'>1</div><div class='option'>Set</div><div class='option'>List</div></div>",
		target : ".multiplicity_type",
		width:"auto",
		format : function(target, option){
			var value = option.html();
			var lineId = target.parents(".line:first").attr("id");
			var line = THIS.LINES[lineId];
			
			var model = null;
			if(target.parents(".line_info:first").is(".end")){
				model = THIS.MODELS[line.fromShapeId];
				line.multiplicity.end.mapping = value;
			} else if(target.parents(".line_info:first").is(".start")){
				model = THIS.MODELS[line.toShapeId];
				line.multiplicity.start.mapping = value;
			}
			
			var property = null;
			for(var i in model.properties){
				property = model.properties[i];
				if(property.autoBy && property.autoBy == lineId){
					break;
				}
			}
			
			if(value == "1" && property.genericity != null){
				property.type = property.genericity;
				property.genericity = null;
			} else {
				if(property.genericity != null){
					property.type = value;
				} else {
					property.genericity = property.type;
					property.type = value;
				}
			}

			return value;
		}
	});
	
	/*从数据反向生成图*/
	THIS.render(renderData);
};

umlCanvas.prototype = {
	/**
	 * 从数据渲染出图片
	 * @param data 源数据，包括箭头数据和节点数据
	 */
	render : function(data){
		if(!data) return;
		
		var lines = JSON.parse(data.lineInfo);
		var models = JSON.parse(data.domainShapeInfo);
		var canvas = this;
		
		/*反向生成节点*/
		if(models){
			$.each(models, function(i, model){
				modelDom = addNode(canvas, model);
			});
		}
		
		/*方向生成线条*/
		if(lines){
			var lineDom, polyline;
			$.each(lines, function(i, line){
				lineDom = $("#line-template ." + line.relationType)
				.clone()
				.attr("id", line.id);
				
				lineDom.attr("class", lineDom.attr("class").replace("templine"), "");
				
				polyline = lineDom.children("polyline");
				polyline.attr("points",line.points);
				canvas.LINEDOMS[line.id] = lineDom;
				canvas.LINES[line.id] = line;
				
				if(line.relationType == "aggregate" ||
						line.relationType == "associate" ||
						line.relationType == "compose"){
					var start = lineDom.children("foreignobject").children(".start");
					var end = lineDom.children("foreignobject").children(".end");
					
					start.css(line.multiplicity.start.position);
					end.css(line.multiplicity.end.position);
					
					start.find(".multiplicity_type").html(line.multiplicity.start.mapping);
					end.find(".multiplicity_type").html(line.multiplicity.end.mapping);
				}
				
				canvas.SVGLINES.append(lineDom);
			});
		}
	},
	
	/**
	 * 找出和某个节点连接的所有线条（分连出和连入两种）
	 * @param nodeId 节点的id
	 * @returns {___anonymous14411_14463}
	 */
	findRelatedLines : function(nodeId){
		var outLines = [], inLines = [];
		
		for(var i in this.LINES){
			if(this.LINES[i].toShapeId == nodeId){
				inLines.push(this.LINES[i]);
			} else if(this.LINES[i].fromShapeId == nodeId){
				outLines.push(this.LINES[i]);
			}
		}
		
		return {
			outLines : outLines,
			inLines : inLines
		};
	},
	
	/**
	 * 重置指定的箭头，级联更改线条的控制数据
	 * @param line
	 */
	resetLine : function(line){
		var lineData = this.LINES[line.attr("id")];
		var node = $("#"+lineData.toShapeId);
		this.resetLines(node, null, [lineData]);
	},
	
	/**
	 * 重构所有连向某个结点的线的显示，传参结构为nodes数组的一个单元结构
	 * @param node 被拖动的节点
	 * @param outs 所有从被拖动节点连出的箭头
	 * @param ins 所有指向被拖动节点的箭头
	 */
	resetLines : function(node, outs, ins) {
		var endpoints = null;
		//dy = DELTA left
		//dx = DELTA top
		
		/*重画指出的线*/
		if(outs)
		for(var i=outs.length-1 ; i>=0 ; i--) {
			lineId = outs[i].id;
			if(outs[i].lineType == "line_of_centers"){//连心线
				endpoints = this.getEndpoints(node, this.NODEDOMS[outs[i].toShapeId]);
				outs[i].points = this.moveLine(this.LINEDOMS[outs[i].id], endpoints.start, endpoints.end);
			} else if(outs[i].lineType == "turning_line"){ //手动折线
				endpoints = this.getEndpoints(node, outs[i].turningPoint);
				var points = this.LINEDOMS[outs[i].id].children("polyline").attr("points").split(" ");
				points[0] = endpoints.start.join();
				this.LINEDOMS[outs[i].id].children("polyline").attr("points", points.join(" "));
				outs[i].points = points.join(" ");
			}
			
			this.resetLineInfo(outs[i], endpoints, "start");
		}
		
		/*重画指入的线*/
		if(ins)
		for(var i=ins.length-1; i>=0; i--){
			lineId = ins[i].id;
			if(ins[i].lineType == "line_of_centers"){//连心线
				endpoints = this.getEndpoints(this.NODEDOMS[ins[i].fromShapeId], node);
				ins[i].points = this.moveLine(this.LINEDOMS[ins[i].id], endpoints.start, endpoints.end);
			} else if(ins[i].lineType == "turning_line"){ //手动折线
				endpoints = this.getEndpoints(ins[i].turningPoint, node);
				var points = this.LINEDOMS[ins[i].id].children("polyline").attr("points").split(" ");
				points[2] = endpoints.end.join();
				this.LINEDOMS[ins[i].id].children("polyline").attr("points", points.join(" "));
				ins[i].points = points.join(" ");
			}
			
			this.resetLineInfo(ins[i], endpoints, "end");
		}
	},
	/**
	 * 拖动线条时，线条的描述信息联动
	 * @param lineData
	 * @param endpoints
	 */
	resetLineInfo : function(lineData, endpoints, endOrStart){
		if(lineData.relationType == "aggregate" || 
		lineData.relationType == "associate" || 
		lineData.relationType == "compose"){
			Deg = this.getDeg(endpoints.end[1] - endpoints.start[1], endpoints.end[0] - endpoints.start[0]);
			if(lineData.lineType != "turning_line" || endOrStart == "start"){
				dy = Math.sin(Deg+7*Math.PI/4)*30-10;
				dx = Math.cos(Deg+7*Math.PI/4)*30-10;
				$("#"+lineData.id+" .start").css({
					top:endpoints.start[1] + dy,
					left:endpoints.start[0] + dx
				});
				
				lineData.multiplicity.start.position = {
					top : endpoints.start[1] + dy,
					left: endpoints.start[0] + dx
				};
			}
			
			if(lineData.lineType != "turning_line" || endOrStart == "end"){
				dy = Math.sin(Deg+5*Math.PI/4)*30 - 10;
				dx = Math.cos(Deg+5*Math.PI/4)*30 - 10;
				$("#"+lineData.id+" .end").css({
					top:endpoints.end[1] + dy,
					left : endpoints.end[0] + dx
				});
				
				lineData.multiplicity.end.position = {
						top : endpoints.end[1] + dy,
						left: endpoints.end[0] + dx
				};
			}
		}
	},
	
	/**
	 * 获取角度
	 * @param dx
	 * @param dy
	 * @returns {Number}
	 */
	getDeg : function(dx, dy){
		var sin = dx / Math.sqrt(dx*dx + dy*dy);
		var Deg = Math.abs(Math.asin(sin));
		
		if(dx > 0){
			if(dy < 0){
				Deg = Math.PI - Deg;
			}
		} else if(dx < 0){
			if(dy < 0){
				Deg = Math.PI + Deg;
			} else if(dy > 0){
				Deg = 2*Math.PI - Deg;
			}
		}
		
		return Deg;
	},
	
	/**
	 * 计算连线的起点和终点
	 * 有两种情况
	 * 1.点和矩形连线
	 * 2.矩形和矩形连线
	 * 
	 * 返回值:{
	 * 		start:[],
	 * 		end:[]
	 * }
	 * 
	 * @param startPoint
	 * @param endPoint
	 * @returns {___anonymous20654_20697}
	 */
	getEndpoints : function(startPoint, endPoint){
		var start , end , center;
		/*
		 * 在获取起点之前，要先知道第二个节点中心
		 * （其实是知道任意一个节点的中心点）
		 */
		if(endPoint instanceof Array){ //如果是数组，说endPoint是点
			center = [endPoint[0] ,endPoint[1]];
		} else { //否则是矩形，计算中心点
			var p2 = endPoint.position();
			center = [p2.left+endPoint.width()/2 , p2.top+endPoint.height()/2];
		}
		
		/*获取起点*/
		if(startPoint instanceof Array){ //如果是数组，说endPoint是点
			start = startPoint;
		} else { //
			var p1 = startPoint.position();
			start = this.getPoint([p1.left, p1.top],startPoint.outerWidth(),startPoint.outerHeight(),center);
		}
		
		/*获取终点*/
		if(endPoint instanceof Array){
			end = endPoint;
		} else {
			var p2 = endPoint.position();
			end = this.getPoint([p2.left, p2.top],endPoint.outerWidth(),endPoint.outerHeight(),start);
		}
		
		return {
			"start" : start,
			"end" 	: end
		};
	},
	
	/**
	 * 移动一条直线
	 * @param line
	 * @param start
	 * @param end
	 * @param turningPoint
	 * @returns 移动后线条的点
	 */
	moveLine : function(line, start, end, turningPoint){
		var points = start[0] + "," + start[1] 	+ " " + end[0] + "," + end[1] + " ";
		line.children("polyline").attr("points",points);
		return  points;
	},
	
	/**
	 * 拖动线段生成转折点
	 * @param startNode 开始节点
	 * @param endNode 结束节点
	 * @param turningPoint 转折点
	 * @param line 线段
	 */
	dragLine : function(startNode, endNode, turningPoint, line){
		var eps1 = this.getEndpoints(startNode, turningPoint);
		var eps2 = this.getEndpoints(turningPoint, endNode);
		
		line.attr("points", 
			eps1.start.join() + 
			" " +  turningPoint.join() +  " " + 
			eps2.end.join());
		
		var lineId = line.parents(".line:first").attr("id");
		
		this.resetLineInfo(this.LINES[lineId], eps1, "start");
		this.resetLineInfo(this.LINES[lineId], eps2, "end");
	},
	
	/**
	 * 计算连线的起点和终点
	 * 1.点和矩形连线
	 * 2.矩形和矩形连线
	 * 
	 * 返回值:{
	 * 		start:[],
	 * 		end:[]
	 * }
	 * @param startPoint 开始节点
	 * @param endPoint 结束节点
	 * @returns {___anonymous18592_18635}
	 */
	getEndpoints : function(startPoint, endPoint){
		var start , end , center;
		
		/*
		 * 在获取起点之前，要先知道第二个节点中心
		 * （其实是知道任意一个节点的中心点）
		 */
		if(endPoint instanceof Array){ //如果是数组，说endPoint是点
			center = [endPoint[0] ,endPoint[1]];
		} else { //否则是矩形，计算中心点
			var p2 = endPoint.position();
			center = [p2.left+endPoint.width()/2 , p2.top+endPoint.height()/2];
		}
		
		/*获取起点*/
		if(startPoint instanceof Array){ //如果是数组，说endPoint是点
			start = startPoint;
		} else { //
			var p1 = startPoint.position();
			start = this.getPoint([p1.left, p1.top],startPoint.outerWidth(),startPoint.outerHeight(),center);
		}
		
		/*获取终点*/
		if(endPoint instanceof Array){
			end = endPoint;
		} else {
			var p2 = endPoint.position();
			end = this.getPoint([p2.left, p2.top],endPoint.outerWidth(),endPoint.outerHeight(),start);
		}
		
		return {
			"start" : start,
			"end" 	: end
		};
	},
	
	/**
	 * 在矩形中心与矩形外任意一点作连心线时，获取该连线与矩形的边的交点
	 * @param p1 矩形左上角坐标，数组
	 * @param w 矩形的width
	 * @param h 矩形的height
	 * @param p2 矩形外的点，数组
	 * @returns {Array}
	 */
	getPoint : function(p1, w, h, p2){
		var x1,y1,x,y;
		
		x1 = p1[0] + w/2;
		y1 = p1[1] + h/2;
		
		var tan1 = (p2[1] - y1) / (p2[0] - x1);
		var tan2 = h/w;
		
		if(Math.abs(tan1) > Math.abs(tan2)){
			var dx = Math.abs( (h*(p2[0]-x1)) / (2*(p2[1]-y1)) );
			
			dx = (p2[0] > x1 ? dx : -dx);
			x = p1[0] + w/2 + dx;
			y = (p2[1] > y1 ? p1[1]+h : p1[1]);
		} else {
			var dy = Math.abs( (w*(p2[1]-y1)) / (2*(p2[0]-x1)) );
			
			dy = (p2[1] > y1 ? dy : -dy);
			y = p1[1] + h/2 + dy;
			x = (p2[0] > x1 ? p1[0]+w : p1[0]);
		}
		
		return [x, y];
	},
	
	/**
	 * 画一条线
	 * @param start 开始节点
	 * @param end 结束节点
	 * @param name 箭头的类型（名字，比如“继承”，“关联” ···）
	 * @returns
	 */
	drawLine : function(start, end, name){
		var line = $("#line-template ."+name).clone();
		var pline = line.children();
		
		/*线条的路径*/
		pline.attr("points", 
			start[0]	+ "," + start[1] 	+ " " + 
			end[0]		+ "," + end[1] 		+ " ");
			
		return line;
	},
	
	getModels : function(){
		var models = [];
		var model;
		for(temp in this.MODELS){
			model = JSON.parse(JSON.stringify(this.MODELS[temp]));
			delete model.position;
			
			console.log(JSON.stringify(this.MODELS[temp]));
			
			
			if(model.parentId){
				model.parentName = this.MODELS[model.parentId].name;
				delete model.parentId;
			} 
			
			if(model.implementsIdSet.length > 0){
				var impl;
				for(var i=0; i<model.implementsIdSet.length; i++){
					impl = this.MODELS[model.implementsIdSet[i]];
					
					model.implementsNameSet.push(impl.name);
					
					if(impl.actions.length > 0){
						for(var j=0; j<impl.actions.length; j++){
							model.actions.push(impl.actions[j]);
						}
					}
				}
			}
			
			models.push(model);
		}
		
		return models;
	},
	
	/**
	 * 获取当前uml图的所有线条（箭头）
	 * @returns {Array}
	 */
	getLines : function(){
		var lines = [];
		for(var temp in this.LINES){
			lines.push(this.LINES[temp]);
		}
		
		return lines;
	},
	
	/**
	 * 显示右键菜单
	 * @param target
	 * @param e
	 * @param menuName
	 * @param selector
	 * @param canvas
	 */
	showContextmenu : function(target, e, menuName, selector, canvas){
		e.preventDefault();
		$("#"+menuName)
		.css({ top : e.pageY, left : e.pageX})
		.data("target",target)
		.data("canvas",canvas)
		.removeClass(function(index, clazz){return clazz.split(" ")[1];})
		.addClass(selector)
		.slideDown().focus();
	}
};

/**
 * renderData:反向生成图的数据，可以为空
 */
$.fn.umlCanvas = function(renderData){
	$(this).find(".tools_bar:first").data("canvas", new umlCanvas($(this), renderData));
};

/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓全局性事件↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
/*收起右键菜单*/
$("#edit_contextmenus .contextmenu").blur(function(){
	$(this).slideUp(50);
});
//右键菜单添加领域模型
$("#add_nodes").delegate(".contextmenu_item", "click", function(e){
	var thiz 	= $(this), 
		canvas	= thiz.parent().data("canvas");
		
	var type;
	if(thiz.is(".add_entity")){
		type="ENTITY";
	} else if(thiz.is(".add_interface")){
		type = "INTERFACE";
	} else if(thiz.is(".add_enum")){
		type = "ENUM";
	} else {
		return;
	}
	
	var offset = canvas.UMLCANVAS.offset();
	var position = {
			x:e.pageX - offset.left,
			y:e.pageY - offset.top
		};
	
	var modelName = getName(type.toLowerCase(), getNodeNameSpace(canvas.MODELS)).firstUpcase();
	
	var model = null;
	if(type == "ENTITY"){
		model 		= new EntityShape(canvas.CHARTID, modelName, position, type, "", false, false);
	} else if(type == "INTERFACE"){
		model 		= new InterfaceShape(modelName, position, type, "");
	} else if(type == "ENUM"){
		model 		= new EnumShape(modelName, position, type, "");
	}
	
	addNode(canvas, model);
		
	thiz.parent(".contextmenu").blur();
});

/*右键菜单添加行为或属性*/
$("#add_members").delegate(".contextmenu_item","click",function(e){
	var thiz  	= $(this) ,
		target 	= thiz.parent().data("target"),
		canvas	= thiz.parent().data("canvas"),
		model = target.data("data");
	if(thiz.is(".add_property")){
			/*自动获取不重复的命名*/
			var name = getName("property", (function(){
				var namespace = [];
				$.each(model.properties, function(i,p){
					namespace.push(p.name);
				});
				return namespace;
			})());
			var property = new Property(name, "String");
		
		addProperty(model, property, true);
	} else if(thiz.is(".add_action")){
		/*自动获取不重复的命名*/
		var actionName = getName("action", (function(){
			var namespace = [];
			$.each(target.data("data").actions, function(i, a){
				namespace.push(a.name);
			});
			return namespace;
		})());
		var action = new Action(actionName);
		addAction(model, action, true);
	} else if(thiz.is(".add_enumItem")){
		var name = getName("ENUMITEM",(function(){
				var namespace = [];
				$.each(target.data("data").enumItems,function(i,p){
					namespace.push(p.name);
				});
				return namespace;
			})());
		
		var enumItem = new EnumItem(name);
		addEnumItem(model, enumItem, true);
	} else if(thiz.is(".delete")){
		deleteModel(model, canvas);
	}
	
	thiz.parent(".contextmenu").blur();
});

/*右键编辑线段 */
$("#edit_lines").delegate(".contextmenu_item", "click", function(){
	var thiz = $(this),
		target = thiz.parent().data("target"),
		canvas = thiz.parent().data("canvas"),
		line = canvas.LINES[target.attr("id")];
		
	if(thiz.is(".delete")){
		deleteLines([line], canvas);
	} else if(thiz.is(".line_of_centers")){
		line.turningPoint = null;
		line.lineType = "line_of_centers";
		canvas.resetLine(target);
	}
	thiz.parent(".contextmenu").blur();
});
/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑全局性事件↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
