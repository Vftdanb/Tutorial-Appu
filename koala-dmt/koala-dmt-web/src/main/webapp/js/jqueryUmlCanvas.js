function umlCanvas(thiz){
	/*全局变量*/
	var THIS			= this;
	
	this.ZOOM		= 1;						//uml图的缩放值
	this.EASEL		= thiz.find(".uml_easel");	//画布容器（画架）
	this.SVGLINES 	= thiz.find(".uml_lines");  //线条容器
	this.UMLCANVAS 	= thiz.find(".uml_canvas");	//所有图形元素的容器
	this.TOOLBAR	= thiz.find(".tools");		//切换工具的工具栏
	this.CURTOOL	= {type:"cursor",name:null};//当前的工具（currentTool）
	
	this.FOCUSITEM	= null;						//当前被选中的节点或线条
	this.CHARTID	= 000000000;				//当前uml图的id
	
	
	/*需要持久化的数据*/
	this.LINES 		= {}; 	//所有线条的控制数据(json对象,需要持久化)
	this.MODELS 	= {}; 	//所有节点的控制数据(json对象,需要持久化)
	/*全局缓存*/
	this.LINEDOMS	= {};	//页面上的所有线条对象
	this.NODEDOMS	= {};	//页面上的所有节点对象
	
	/*拖动鼠标画连线*/
	(function(){
		var drawing = false; 				//标志当前状态是否划线状态
		var n1 = n2 = null;		//划线的开始结束节点
		var m1 = m2 = null;		//起点和终点分别对应领域模型
		var startP 	= null;
		var endpoints = null;
		var line;
		var offset;
		
		/*拖动划线*/
		THIS.UMLCANVAS.delegate(".node","mousedown",function(e){
			if(THIS.CURTOOL.type != "line" || $(this).is(".illegal")) return;
			offset 		= THIS.UMLCANVAS.offset();
			drawing 	= true;
			startP 		= [e.clientX - offset.left,e.clientY-offset.top];
			line 		= svgGraph.drawLine(startP,[e.clientX - offset.left,e.clientY - offset.top],THIS.CURTOOL.name);
			n1 			= $(this);
			
			line.attr("id",commonTool.guid());
			THIS.SVGLINES.append(line);
		})
		
		
		.delegate(".node","mouseenter",function(e){ 	//结束节点的获取
			if(THIS.CURTOOL.type != "line") return;
			
			var thiz  = $(this),
				tname = THIS.CURTOOL.name, 						//toolname
				nodeT = thiz.attr("class").split(" ")[1];	//nodeType
			
			/*连线起点的合法性检查*/
			if(!drawing){
				m1 = thiz.data("data");
				if(tname == "extends") {
					((nodeT == "entity") && (m1.extends == null)) ? //只能继承类，并且只能单继承
						thiz.addClass("legal") : thiz.addClass("illegal");
				} else if(tname == "implements"){
					((nodeT == "entity")) ? //只能有类实现接口
						thiz.addClass("legal") : thiz.addClass("illegal");
				} else if(tname == "aggregate" || tname == "compose") {
					((nodeT != "interface")) ? 
						thiz.addClass("legal") : thiz.addClass("illegal");
				} else {
					thiz.addClass("illegal");
				}
			}
			
			/*连线终点的合法性检查*/
			if(drawing){
				n2 = $(this);
				m2 = n2.data("data");
				
				if(tname == "extends"){
					(nodeT == "entity") ? 
						thiz.addClass("legal") : thiz.addClass("illegal");
				} else if(tname == "implements"){
					((nodeT == "interface") && ($.inArray(m2.name, m1.implementsList) < 0)) ? 
						thiz.addClass("legal") : thiz.addClass("illegal");
				} else if(tname == "aggregate" || tname == "compose"){
					thiz.addClass("legal");
				} else {
					thiz.addClass("illegal");
				}
				
				if($(this).is(".illegal")) n2 = null;
			}
		})
		.delegate(".node","mouseleave",function(e){ 	//结束节点的取消
			$(this).removeClass("illegal legal");
			n2 = null;
		})
		.mousemove(function(e){						//拖动划线效果
			if(drawing){
				e.preventDefault();
				
				if(n2){
					endpoints = svgGraph.getEndpoints(n1,n2);
				} else {
					endpoints = svgGraph.getEndpoints(n1,[e.clientX - offset.left,e.clientY - offset.top]);
				}
				svgGraph.moveLine(line, endpoints.start , endpoints.end);
			}
		}).mouseup(function(e){ 						//划线成功效果
			if((drawing && n2 == null)){
				line.remove();
			} else if(n2 != null && drawing){
				/*连线的相关逻辑.根据连线生成或更改某些属性*/
				if(line.is(".extends")){
					m1.extends = m2.name;
				} else if(line.is(".implements")){
					m1.implementsList.push(m2.name);
				} else if(line.is(".aggregate,.compose")){
					addProperty(n1,"List",m2.name,line.attr("id"));
				} else if(line.is(".")){
					
				}
				
				endpoints = svgGraph.getEndpoints(n1,n2);
				svgGraph.moveLine(line,endpoints.start ,endpoints.end);
				
				var id 	= line.attr("id");
				var type = line.attr("class").split(" ")[1];
				THIS.LINES[id] = new Line(THIS.CHARTID, id ,type ,n1.attr("id") ,n2.attr("id"),null);
				THIS.LINEDOMS[id] = line;	//把新增的连线缓存起来
				
				line.attr("class",line.attr("class").replace("templine",""));
			}
			line = null;
			n2 = null;
			n1 = null;
			m1 = null;
			m2 = null;
			drawing = false;
			startP 	= null;
		});
	})();
	
	/*拖拽节点，线条联动*/
	(function(){
		var target 			= null;	//被拖动的元素
		var startPosition 	= null;	//被拖动元素开始的位置
		var downPosition 	= null;	//鼠标点击的初始位置
		var relatedLines 	= null;	//与被拖动节点相连的线
		var moving			= false;
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
		
		THIS.UMLCANVAS.delegate(".header","mousedown",function(e){
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
				model.leftTopPoint.x = target.position().left;
				model.leftTopPoint.y = target.position().top;
				
				moving = false;
			}
		});
	})();
	
	/*点击鼠标添加节点*/
	THIS.UMLCANVAS.delegate("svg","click",function(e){
		if(THIS.CURTOOL.type == "node"){
			addNode(e,null,THIS);
		}
		
		/*当画布被点击一次时，如果当前不是线条工具，将工具切换回鼠标工具*/
		if(THIS.CURTOOL.type == "node"){
			swichTool("cursor",THIS);
		}
	});
	
	THIS.UMLCANVAS.contextmenu(function(e){
		var target = $(e.target);
		if(target.is("svg")){
			showContextmenu(target,e,"add_nodes",null,THIS);
		}
	});
	
	/*点击节点，添加属性或行为*/
	THIS.UMLCANVAS.delegate(".node","click",function(e){
		if(THIS.CURTOOL.name == "property"){			//添加属性
			addProperty($(this),"String");
		} else if(THIS.CURTOOL.name == "action"){ 	//添加行为
			addAction($(this));
		} 
		var relatedLines = commonTool.findRelatedLines($(this).attr("id"),THIS.LINES);
		svgGraph.resetLines($(this),THIS.NODEDOMS,THIS.LINEDOMS,relatedLines.outLines,relatedLines.inLines);
		
		swichTool("cursor",THIS);
	});
	
	/*点击工具切换*/
	THIS.TOOLBAR.delegate(".cursor,.node,.line,.component","click",function(e){
		swichTool($(this).attr("class").split(" ")[1],THIS);
	});
	
	/** 
	 * 编辑节点名字 
	 */
	THIS.UMLCANVAS.delegate(".name","dblclick",function(e){
		var node 	= $(this).parents(".node"),
			dmodel 	= node.data("data");
			
		/*编辑节点名字*/
		$(this).miniedit({
			type:'input',
			afterEdit:function(target,input){
				if($.trim(input.val()) == ""){
					alert("请输入模型名");
					input.focus();
					return false;
				} else {
					updateNodeName(node,input.val(),THIS);
					return true;
				}
			}
		});
	});
	
	/*双击方式编辑属性或行为 */
	/*
	THIS.UMLCANVAS.delegate(".properties,.actions,.name","dblclick",function(e){
		e.preventDefault();
		var thiz = $(this),t=$(e.target);
		var property,action;
		
		var model = t.parents(".node").data("data");
		
		if(thiz.is(".properties")){ 
			property = t.parent().data("data");
		} else if(thiz.is(".actions")){
			action = t.parent().data("data");
		}
		var css = {"font-size":"12px",width:"50%",height:"20px","margin-top":"-1px"};
		if(t.is(".propertyName")){ 	//编辑节点名字
			t.miniedit({			//利用一个行内编辑插件编辑
				type:'input',
				css:css,
				afterEdit:function(target,input){
					if($.trim(input.val()) == ""){
						alert("请输入属性名");
						input.focus();
						return false;
					} else {
						property.name = input.val(); //同步更新
						return true;
					}
				}
			});
		} else if(t.is(".propertyType")){ //编辑参数
			t.miniedit({
				type:'input',
				dataList:"property_type_tip",
				css:css,
				afterEdit:function(target,input){
					if($.trim(input.val()) == ""){
						alert("请输入属性类型");
						input.focus();
						return false;
					} else {
						property.type = input.val();
						return true;
					}
				}
			});
		} else if(t.is(".actionName")){
			t.miniedit({
				type:'input',
				css:css,
				afterEdit:function(target,input){
					if($.trim(input.val()) == ""){
						alert("请输入方法名");
						input.focus();
						return false;
					} else {
						action.actionName = input.val();
						return true;
					}
				}
			});
		} else if(t.is(".returnType")){
			t.miniedit({
				type:'input',
				dataList:"property_type_tip",
				css:css,
				afterEdit:function(target,input){
					if($.trim(input.val()) == ""){
						alert("请输入方法名");
						input.focus();
						return false;
					} else {
						action.returnType = input.val();
						return true;
					}
				}
			});
		}
		//TODO:节点尺寸改变，需要重画连线
		
	});
	*/
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
	THIS.SVGLINES.delegate(".line:not(.templine)","mouseenter",function(e){
		var line = THIS.LINES[$(this).attr("id")],
			from = THIS.NODEDOMS[line.fromShapeId],
			l	= THIS.LINEDOMS[line.lineId];	
			
		l.attr("class",l.attr("class") + " active");
		from.find("."+line.lineId).addClass("active");
	}).delegate(".line:not(.templine)","mouseout",function(e){
		var line = THIS.LINES[$(this).attr("id")],
			from = THIS.NODEDOMS[line.fromShapeId],
			l	= THIS.LINEDOMS[line.lineId];
			
		l.attr("class",l.attr("class").replace(" active" , ""));
		from.find("."+line.lineId).removeClass("active");
	});
	
	/*自动生成 */
	THIS.UMLCANVAS.delegate(".auto_generated","mouseenter",function(e){
		if(THIS.CURTOOL.type == "common"){
			var thiz = $(this),
				line = THIS.LINEDOMS[thiz.attr("generated_by")];
				
			thiz.addClass("active");
			line.attr("class",line.attr("class") + " active");
		}
	}).delegate(".auto_generated","mouseleave",function(e){
		if(THIS.CURTOOL.type == "common"){
			var thiz = $(this),
				line = THIS.LINEDOMS[thiz.attr("generated_by")];
				
			thiz.removeClass("active");
			line.attr("class",line.attr("class").replace(" active" , ""));
		}
	});
	/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑鼠标滑过线条提示，增加体验↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
	
	
	/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓右键功能↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
	/*右键添加属性或行为或枚举项等等*/
	THIS.UMLCANVAS.delegate(".node","contextmenu",function(e){
		var thiz = $(this);
		var selector;
		
		if(thiz.is(".entity")){ 			//右键实体，添加属性和行为
			selector = "entity";
		} else if(thiz.is(".interface")){ 	//右键接口，添加行为和常量
			selector = "interface";
		} else if(thiz.is(".enum")){ 		//右键枚举，添加枚举项
			selector = "enum";
		}
		
		showContextmenu(thiz,e,"add_members",selector,THIS);
	});
	
	/*编辑线条的右键菜单*/
	THIS.SVGLINES.delegate(".line","contextmenu",function(e){
		showContextmenu($(this),e,"edit_lines",null,THIS);
	});
	/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑右键功能↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
	
	thiz.find("#print").click(function(){
		console.log("LINES:"+JSON.stringify(THIS.LINES));
		console.log("MODELS:"+JSON.stringify(THIS.MODELS));
	});
	
	/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓对话框编辑功能↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
	THIS.UMLCANVAS.delegate(".node,.line","click",function(){
		editDialog.initDialog($(this),THIS);
	});
	/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑对话框编辑功能↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
};

$.fn.umlCanvas = function(){
	new umlCanvas($(this));
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
		addNode(e,"entity",canvas);
	} else if(thiz.is(".add_interface")){
		addNode(e,"interface",canvas);
	} else if(thiz.is(".add_enum")){
		addNode(e,"enum",canvas);
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