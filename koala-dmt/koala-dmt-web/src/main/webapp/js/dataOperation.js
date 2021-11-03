dataOperation = {
	ZOOM : function(t){
			var value = $(t).val();
			$(".uml_canvas").css("transform","scale("+value+")");
	},
	/*切换工具的方法*/
	swichTool : function(name){
		var tool = TOOLBAR.find("."+name);
		var curtool  = tool.attr("class").split(" ");
		
		CURTOOL.type = curtool[0];
		CURTOOL.name = curtool[1];
		
		TOOLBAR.find(".current-tool").removeClass("current-tool");
		tool.addClass("current-tool");
	},
	
	/*显示右键菜单*/
	 showContextmenu : function(target,e,menuName,selector){
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
	},
	
	/*页面上添加一个节点，对应业务上的一个类或接口*/
	addNode : function(e,type){
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
	},
	
	/**************************************添加节点的各种成员******************************************/
	/*添加属性*/
	addProperty : function(target,type,genericity,autoBy){
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
	},
	/*添加行为*/
	addAction : function(target){
		var dmodel = target.data("model");
		var action = new Action("action","void");
		var actDom = $("#node-template .action").clone();
		
		dmodel.actions.push(action);
		target.find(".actions").append(actDom);
		actDom.data("action",action);
	},
	/*添加枚举项*/
	addEnumItem : function(target){
		target.find(".enumItems").append($("#node-template .enumItem").clone());
		/*TODO:同步更新缓存数据*/
		var id = target.attr("id");
		var enumItem = new EnumItem("enum item");
	},
	
	/*更新名字，需要级联更改自动生成的属性的类型名*/
	updateNodeName : function(target,newName,oldName){
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
	},
	
	/*删除节点*/
	deleteNode : function(node){
		var id = node.attr("id");
		var ls = commonTool.findRelatedLines(id,LINES);
		
		/*删除节点的连线*/
		deleteLines(ls.inLines);
		deleteLines(ls.outLines);
		
		/*删除节点*/
		delete MODELS[id];
		delete NODEDOMS[id];
		node.remove();
	},
	
	/**
	 * 删除连线.
	 * 有级联操作
	 */
	deleteLines : function(lines){
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
			
			delete LINES[id];
			delete LINEDOMS[id];
			ldom.remove();
		});
	},
	
	/*删除属性*/
	deleteProperty : function(){
		/*TODO:同步更新缓存数据*/
	},
	/*删除行为*/
	deleteAction : function(){
		/*TODO:同步更新缓存数据*/
	},
	/*删除枚举项*/
	deleteEnumItem : function(){
		/*TODO:同步更新缓存数据*/
	},
	
	/**
	 * 自动命名。
	 * 在某个命名空间内，采用递增的方式获取一个可用的命名
	 */
	getName : function(nodeType,nameSpace){
		var name;
		for(var i=1 ; ; i++){
			name = nodeType + i;
			if($.inArray(name,nameSpace) < 0)  break;
		}
		return name;
	},
	
	/*获取所有已经被占用的节点名(忽略大小写)*/
	getNodeNameSpace : function(){
		var namespace = [];
		for(i in MODELS){
			namespace.push(MODELS[i].name.toLowerCase());
		}
		return namespace;
	}
};