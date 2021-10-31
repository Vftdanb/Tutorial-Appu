;(function($){
	$.fn.umlCanvas = function(opts){
		/*全局变量*/
		var THIZ 		= $(this);
		var ZOOM		= 1;						//uml图的缩放值
		var EASEL		= THIZ.find(".uml_easel");	//画布容器（画架）
		var SVGLINES 	= THIZ.find(".uml_lines");  //线条容器
		var UMLCANVAS 	= THIZ.find(".uml_canvas");	//所有图形元素的容器
		var TOOLBAR		= THIZ.find(".tools");		//切换工具的工具栏
		var CURTOOL		= {type:"cursor",name:null};//当前的工具（currentTool）
		var FOCUSITEM	= null;						//当前被选中的节点或线条
		var CHARTID		= 000000000;				//当前uml图的id
		
		/*需要持久化的数据*/
		var LINES 		= {}; 	//所有线条的控制数据(json对象,需要持久化)
		var MODELS 		= {}; 	//所有节点的控制数据(json对象,需要持久化)
		/*全局缓存*/
		var LINEDOMS	= {};	//页面上的所有线条对象
		var NODEDOMS	= {};	//页面上的所有节点对象
		
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
			UMLCANVAS.delegate(".node","mousedown",function(e){
				if(CURTOOL.type != "line" || $(this).is(".illegal")) return;
				offset 		= UMLCANVAS.offset();
				drawing 	= true;
				startP 		= [e.clientX - offset.left,e.clientY-offset.top];
				line 		= svgGraph.drawLine(startP,[e.clientX - offset.left,e.clientY - offset.top],CURTOOL.name);
				n1 			= $(this);
				
				line.attr("id",commonTool.guid());
				SVGLINES.append(line);
			})
			
			
			.delegate(".node","mouseenter",function(e){ 	//结束节点的获取
				if(CURTOOL.type != "line") return;
				
				var thiz  = $(this),
					tname = CURTOOL.name, 						//toolname
					nodeT = thiz.attr("class").split(" ")[1];	//nodeType
				
				/*连线起点的合法性检查*/
				if(!drawing){
					m1 = thiz.data("model");
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
					m2 = n2.data("model");
					
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
					LINES[id] = new Line(CHARTID, id ,type ,n1.attr("id") ,n2.attr("id"),null);
					LINEDOMS[id] = line;	//把新增的连线缓存起来
					
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
					top : startPosition.top  + e.clientY - downPosition.top  + EASEL.scrollTop(),
					left: startPosition.left + e.clientX - downPosition.left + EASEL.scrollLeft()
				});
				/*改变连线*/
				svgGraph.resetLines(target, NODEDOMS, LINEDOMS, relatedLines.outLines, relatedLines.inLines);
			};
			
			UMLCANVAS.delegate(".header","mousedown",function(e){
				if(CURTOOL.type != "line" && !$(e.target).is("input")){
					target 			= $(this).parent();
					startPosition 	= target.position();
					downPosition 	= {left : e.clientX ,top : e.clientY};
					relatedLines 	= commonTool.findRelatedLines(target.attr("id"),LINES);
					startPosition.top = startPosition.top - EASEL.scrollTop();
					startPosition.left = startPosition.left - EASEL.scrollLeft();
					UMLCANVAS.bind("mousemove",drag);
					moving = true;
				}
			}).mouseup(function(){
				if(moving){
					UMLCANVAS.unbind("mousemove",drag);
					var model  = MODELS[target.attr("id")];
					model.leftTopPoint.x = target.position().left;
					model.leftTopPoint.y = target.position().top;
					
					moving = false;
				}
			});
		})();
		
		/*点击鼠标添加节点*/
		UMLCANVAS.delegate("svg","click",function(e){
			if(CURTOOL.type == "node"){
				addNode(e);
			}
			
			/*当画布被点击一次时，如果当前不是线条工具，将工具切换回鼠标工具*/
			if(CURTOOL.type == "node"){
				swichTool("cursor");
			}
		});
		
		UMLCANVAS.contextmenu(function(e){
			var target = $(e.target);
			if(target.is("svg")){
				showContextmenu(target,e,"add_nodes");
			}
		});
		
		/*点击节点，添加属性或行为*/
		UMLCANVAS.delegate(".node","click",function(e){
			if(CURTOOL.name == "property"){			//添加属性
				addProperty($(this),"String");
			} else if(CURTOOL.name == "action"){ 	//添加行为
				addAction($(this));
			} 
			var relatedLines = commonTool.findRelatedLines($(this).attr("id"),LINES);
			svgGraph.resetLines($(this),NODEDOMS,LINEDOMS,relatedLines.outLines,relatedLines.inLines);
			
			swichTool("cursor");
		});
		
		/*点击工具切换*/
		TOOLBAR.delegate(".cursor,.node,.line,.component","click",function(e){
			swichTool($(this).attr("class").split(" ")[1]);
		});
		
		/** 
		 * 编辑节点名字 
		 */
		UMLCANVAS.delegate(".name","dblclick",function(e){
			var node = $(this).parents(".node"),
				dmodel = node.data("model");
				
			/*编辑节点名字*/
			$(this).miniedit({
				type:'input',
				afterEdit:function(target,input){
					if($.trim(input.val()) == ""){
						alert("请输入模型名");
						input.focus();
						return false;
					} else {
						updateNodeName(node,input.val(),target.html());
						return true;
					}
				}
			});
		});
		
		/* 双击方式编辑属性或行为 */
		UMLCANVAS.delegate(".properties,.actions,.name","dblclick",function(e){
			e.preventDefault();
			var thiz = $(this),t=$(e.target);
			var property,action;
			
			var model = t.parents(".node").data("model");
			
			if(thiz.is(".properties")){ 
				property = t.parent().data("property");
			} else if(thiz.is(".actions")){
				action = t.parent().data("action");
			}
			var css = {"font-size":"12px",width:"50%",height:"20px","margin-top":"-1px"};
			if(t.is(".propertyName")){ 		//编辑节点名字
				t.miniedit({ //利用一个行内编辑插件编辑
					type:'input',
					css:css,
					afterEdit:function(target,input){
						if($.trim(input.val()) == ""){
							alert("请输入属性名");
							input.focus();
							return false;
						} else {
							property.propertyName = input.val(); //同步更新
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
							property.propertyType = input.val();
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
		
		/*工具栏切换*/
		TOOLBAR.find(".swich_tool_view").click(function(){
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
		//右键菜单添加领域模型
		$("#add_nodes").delegate(".contextmenu_item","click",function(e){
			var thiz = $(this);
			if(thiz.is(".add_entity")){
				addNode(e,"entity");
			} else if(thiz.is(".add_interface")){
				addNode(e,"interface");
			} else if(thiz.is(".add_enum")){
				addNode(e,"enum");
			}
		});
		
		/*右键菜单添加行为或属性*/
		$("#add_members").delegate(".contextmenu_item","click",function(e){
			var thiz = $(this) ,target = thiz.parent().data("target");
			
			if(thiz.is(".add_property")){
				addProperty(target,"String");
			} else if(thiz.is(".add_action")){
				addAction(target);
			} else if(thiz.is(".add_enumItem")){
				addEnumItem(target);
			} else if(thiz.is(".delete")){
				deleteNode(target);
			}
		});
		
		/*右键编辑 */
		$("#edit_lines").delegate(".contextmenu_item","click",function(){
			var thiz = $(this),
				target = thiz.parent().data("target"),
				line = LINES[target.attr("id")];
				
				if(thiz.is(".delete")){
					deleteLines([line]);
				}
		});
		/*右键添加属性或行为或枚举项等等*/
		UMLCANVAS.delegate(".node","contextmenu",function(e){
			var thiz = $(this);
			var selector;
			
			if(thiz.is(".entity")){ 			//右键实体，添加属性和行为
				selector = "entity";
			} else if(thiz.is(".interface")){ 	//右键接口，添加行为和常量
				selector = "interface";
			} else if(thiz.is(".enum")){ 		//右键枚举，添加枚举项
				selector = "enum";
			}
			
			showContextmenu(thiz,e,"add_members",selector);
		});
		
		/*编辑线条的右键菜单*/
		SVGLINES.delegate(".line","contextmenu",function(e){
			showContextmenu($(this),e,"edit_lines");
		});
		
		/*收起右键菜单*/
		$("body").click(function(){
			$("#edit_contextmenus .contextmenu").slideUp(50);
		});
		/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑右键功能↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
		
		
		
		/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓鼠标滑过线条提示，增加体验↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/		
		SVGLINES.delegate(".line:not(.templine)","mouseenter",function(e){
			var line = LINES[$(this).attr("id")],
				from = NODEDOMS[line.fromShapeId],
				l	= LINEDOMS[line.lineId];	
				
				
				
			l.attr("class",l.attr("class") + " active");
			from.find("."+line.lineId).addClass("active");
		}).delegate(".line:not(.templine)","mouseout",function(e){
			var line = LINES[$(this).attr("id")],
				from = NODEDOMS[line.fromShapeId],
				l	= LINEDOMS[line.lineId];
				
			l.attr("class",l.attr("class").replace(" active" , ""));
			from.find("."+line.lineId).removeClass("active");
		});
		
		/*自动生成 */
		UMLCANVAS.delegate(".auto_generated","mouseenter",function(e){
			if(CURTOOL.type == "common"){
				var thiz = $(this),
					line = LINEDOMS[thiz.attr("generated_by")];
					
				thiz.addClass("active");
				line.attr("class",line.attr("class") + " active");
			}
		}).delegate(".auto_generated","mouseleave",function(e){
			if(CURTOOL.type == "common"){
				var thiz = $(this),
					line = LINEDOMS[thiz.attr("generated_by")];
					
				thiz.removeClass("active");
				line.attr("class",line.attr("class").replace(" active" , ""));
			}
		});
		/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑鼠标滑过线条提示，增加体验↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
		
		
		
		
		
		
		
		
		
		
		
		
		
		function ZOOM(t){
			var value = $(t).val();
			$(".uml_canvas").css("transform","scale("+value+")");
		}
		/*切换工具的方法*/
		function swichTool(name){
			var tool = TOOLBAR.find("."+name);
			var curtool  = tool.attr("class").split(" ");
			
			CURTOOL.type = curtool[0];
			CURTOOL.name = curtool[1];
			
			TOOLBAR.find(".current-tool").removeClass("current-tool");
			tool.addClass("current-tool");
		}
		
		/*显示右键菜单*/
		function showContextmenu(target,e,menuName,selector){
			e.preventDefault();
			$("#edit_contextmenus .contextmenu").slideUp(50);
			var position = commonTool.mousePosition(e);
			
			$("#"+menuName)
			.css({ top : position.top,left : position.left})
			.data("target",target)
			.removeClass(function(index,clazz){
				return clazz.split(" ")[1];
			})
			.addClass(selector)
			.slideDown(50);
		}
		
		/*页面上添加一个节点，对应业务上的一个类或接口*/
		function addNode(e,type){
			var id = commonTool.guid();
			var offset 	= UMLCANVAS.offset();
			var position = {
					x:e.clientX - offset.left,
					y:e.clientY - offset.top
				};
			var nodeType = type ? type : CURTOOL.name;
			var node = $("#node-template ."+nodeType).clone().css({
					left : position.x,
					top  : position.y
				});
				
			/*判断要生成那种领域模型*/
			var model = null ,name;
			if(nodeType == "entity"){
				
				name 	= getName("entity",getNodeNameSpace()).firstUpcase();
				model 	= new EntityShape(id,CHARTID,name,position,"entity","",false,false);
				
			} else if(nodeType == "interface"){
				
				name 	= getName("interface",getNodeNameSpace()).firstUpcase();
				model 	= new InterfaceShape(id,CHARTID,name,position,"interface","Interface",false,false);
				
			} else if(nodeType == "enum"){
				
				name 	= getName("enum",getNodeNameSpace()).firstUpcase();
				model 	= new EnumShape(id,CHARTID,name,position,"enum","");
			}
			
			node.find(".name").html(name);
			node.attr("id",id).data("model",model); //把对应领域模型缓存在dom节点上，方便查找
			UMLCANVAS.append(node);
			
			MODELS[id] = model;						//节点的控制数据（前端用）
			NODEDOMS[id] = node;
			return id;
		}
		
		/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓对话框编辑功能↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
		UMLCANVAS.delegate(".node,.line","click",function(){
			editDialog.initDialog($(this));
		});
		/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑对话框编辑功能↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
		
				
		/**************************************添加节点的各种成员******************************************/
		/*添加属性*/
		function addProperty(target,type,genericity,autoBy){
			/*TODO:同步添加缓存数据*/
			var dmodel = target.data("model"),
				name = getName("property",(function(){
					var namespace = [];
					$.each(dmodel.properties,function(i,p){
						namespace.push(p.name);
					});
					return namespace;
				})()),
				property = new Property(name,type),
				proDom = $("#node-template .property").clone(); 
			
			proDom.find(".propertyType").html(type);
			proDom.find(".propertyName").html(name);
			
			/*如果属性由连线时自动生成，则记录生成属性对应的线段*/
			if(autoBy){
				proDom.addClass(autoBy);
				proDom.addClass("auto_generated");
				proDom.attr("generated_by",autoBy);
			}
			
			if(genericity){
				property.genericity = genericity;
				proDom.find(".genericity").css("display","inline-block");
				proDom.find(".genericity .value").html(genericity);
			}
			
			dmodel.properties.push(property);
			target.find(".properties").append(proDom);
			/*把对应的属性对象缓存到dom节点上，方便查找*/
			proDom.data("property",property);
		}
		/*添加行为*/
		function addAction(target){
			var dmodel = target.data("model");
			var action = new Action("action","void");
			var actDom = $("#node-template .action").clone();
			
			dmodel.actions.push(action);
			target.find(".actions").append(actDom);
			actDom.data("action",action);
		}
		/*添加枚举项*/
		function addEnumItem(target){
			target.find(".enumItems").append($("#node-template .enumItem").clone());
			/*TODO:同步更新缓存数据*/
			var id = target.attr("id");
			var enumItem = new EnumItem("enum item");
		}
		
		/*更新名字，需要级联更改自动生成的属性的类型名*/
		function updateNodeName(target,newName,oldName){
			var inAout 	= commonTool.findRelatedLines(target.attr("id"),LINES);
			var model	= target.data("model");
			
			var ins 	= inAout.inLines;
			var outs 	= inAout.outLines;
			
			model.name 	= newName;
			
			var n,m; //node and domainmodel
			$.each(ins,function(i,line){
				line = ins[i];
				n = $("#"+line.fromShapeId);
				m = n.data("model");
				
				switch (line.lineType){
					/**
					 * 被继承者更名时，继承者的继承对象要更名 
					 */
					case "extends" : {
						m.extends = newName;
						break;
					};
					
					/**
					 * 被实现者更名时，实现者的实现对象要更名
					 */
					case "implements" : {
						var list = m.implementsList;
						for(var i=0 ;i<list.length ;i++){
							if(list[i] == oldName){
								list[i] = newName;
								break;
							}
						}
						break;
					};
					
					/**
					 * 被聚合（组合）者更名时，关联的属性（泛型）类型也要更名
					 */
					case "aggregate" : 
					case "compose"   : {
						var pnode 	= n.find("." + line.lineId);
						var property = pnode.data("property");
						pnode.find(".value").html(newName);
						property.name = newName;
						break;
					};
					
					/**
					 * 联合
					 */
					case "associate" : {
						
						
						break;
					};
				}
			});
			
			for(var i in ins){
			}
		}
		
		/*删除节点*/
		function deleteNode(node){
			var id = node.attr("id");
			var ls = commonTool.findRelatedLines(id,LINES);
			
			/*删除节点的连线*/
			deleteLines(ls.inLines);
			deleteLines(ls.outLines);
			
			/*删除节点*/
			delete MODELS[id];
			delete NODEDOMS[id];
			node.remove();
		}
		
		/**
		 * 删除连线.
		 * 有级联操作
		 */
		function deleteLines(lines){
			var ldom,id;
			$.each(lines,function(i,line){
				id		= line.lineId;
				ldom 	= LINEDOMS[id];
				
				switch(line.lineType){
					/*
					 * 如果
					 */
					case "extends" : {		//继承线的删除
						var from = MODELS[line.fromShapeId];
						if(from){
							from.extends = null;
						}
						break;
					};
					
					/**
					 * 如果被实现者被删除，要把被实现者从实现者的实现列表里删除
					 * 如果实现者被删除，不需要做任何级联操作
					 * TODO:还可能要级联删除实现的方法
					 */
					case "implements" : {
						var from = MODELS[line.fromShapeId], to	= MODELS[line.toShapeId];
						if(from){
							var list = from.implementsList;
							list.remove($.inArray(list,to.name));
						}
						break;
					};
					
					/**
					 * 
					 */
					case "aggregate":
					case "compose" 	: {
						var from 	= MODELS[line.fromShapeId];
						if(from){
							var to 			= MODELS[line.toShapeId],
								fromNode 	= NODEDOMS[from.shapeId],
								properties 	= from.properties,
								propertyDom = fromNode.find("."+id);
								
							properties.removeByEquals(propertyDom.data("property"));
							propertyDom.remove();
						}
						break;
					};
					case "" : {
						break;
					};
				}
				
				delete LINES[id]
				delete LINEDOMS[id];
				ldom.remove();
			});
		}
		
		/*删除属性*/
		function deleteProperty(){
			/*TODO:同步更新缓存数据*/
		}
		/*删除行为*/
		function deleteAction(){
			/*TODO:同步更新缓存数据*/
		}
		/*删除枚举项*/
		function deleteEnumItem(){
			/*TODO:同步更新缓存数据*/
		}
		
		/**
		 * 自动命名。
		 * 在某个命名空间内，采用递增的方式获取一个可用的命名
		 */
		function getName(nodeType,nameSpace){
			var name;
			for(var i=1 ; ; i++){
				name = nodeType + i;
				if($.inArray(name,nameSpace) < 0)  break;
			}
			return name;
		}
		
		/*获取所有已经被占用的节点名(忽略大小写)*/
		function getNodeNameSpace(){
			var namespace = [];
			for(i in MODELS){
				namespace.push(MODELS[i].name.toLowerCase());
			}
			return namespace;
		}
		
		THIZ.find("#print").click(function(){
			console.log("LINES:"+JSON.stringify(LINES));
			console.log("MODELS:"+JSON.stringify(MODELS));
			//console.log(JSON.stringify());
			//console.log(JSON.stringify(LINES));
		});
		
		/*移除数组的指定索引的元素*/
		Array.prototype.remove = function(i){
			this.splice(i,1);
		}
		
		/*内部使用 "===" 实现*/
		Array.prototype.removeByEquals = function(target){
			for(var i=this.length-1 ; i>=0 ; i--){
				if(this[i] === target){
					this.remove(i);
				}
			}
		}
		String.prototype.firstUpcase = function(){	
			var str = this.toString();	
			return (str.substr(0,1).toUpperCase() + str.substr(1));
		}
	};
})($);