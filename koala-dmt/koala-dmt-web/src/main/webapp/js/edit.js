/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓对话框编辑，编辑结果实时同步↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
(function(){
	var dialogs = $(".dialog_container");
	dialogs.find(".entity_panel").delegate("input");
})();
/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑对话框编辑，编辑结果实时同步↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/

function ZOOM(t,canvas){
		var value = $(t).val();
		canvas.UMLCANVAS.css("transform","scale("+value+")");
}

/*显示右键菜单*/
function showContextmenu(target, e, menuName, selector, canvas){
	e.preventDefault();
	var position = commonTool.mousePosition(e);
	
	$("#"+menuName)
	.css({ top : e.pageY, left : e.pageX})
	.data("target",target)
	.data("canvas",canvas)
	.removeClass(function(index, clazz){return clazz.split(" ")[1];})
	.addClass(selector)
	.slideDown().focus();
}


/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓对模型的编辑↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/	
/*页面上添加一个节点，对应业务上的一个类或接口*/
function addNode(e, type, canvas){
	var id = commonTool.guid();
	var offset 	= canvas.UMLCANVAS.offset();
	var position = {
			x:e.pageX - offset.left,
			y:e.pageY - offset.top
		};
	var nodeType = type ? type : canvas.CURTOOL.name;
	var node = $("#node-template ."+nodeType.toLowerCase()).clone().css({
			left : position.x,
			top  : position.y
		});
		
	/*判断要生成那种领域模型*/
	var model = null ,name;
	if(nodeType == "ENTITY"){
		
		name 	= getName("entity", getNodeNameSpace(canvas.MODELS)).firstUpcase();
		model 	= new EntityShape(id,canvas.CHARTID,name,position,nodeType,"",false,false);
		
	} else if(nodeType == "INTERFACE"){
		
		name 	= getName("interface", getNodeNameSpace(canvas.MODELS)).firstUpcase();
		model 	= new InterfaceShape(id,canvas.CHARTID,name,position,nodeType,"Interface",false,false);
		
	} else if(nodeType == "ENUM"){
		
		name 	= getName("enum", getNodeNameSpace(canvas.MODELS)).firstUpcase();
		model 	= new EnumShape(id ,canvas.CHARTID ,name ,position ,nodeType ,"");
	}
	
	node.find(".name").html(name);
	node.attr("id",id).data("data",model); //把对应领域模型缓存在dom节点上，方便查找
	canvas.UMLCANVAS.append(node);
	
	canvas.MODELS[id] 	= model;						//节点的控制数据（前端用）
	canvas.NODEDOMS[id] = node;
	
	return id;
}
/**************************************添加节点的各种成员******************************************/
/*
 * 添加属性
 * autoBy:指定该属性是否由于连线而自动生成
 */
function addProperty(target, type, autoBy) {
	var dmodel = target.data("data"),
		name = getName("property",(function(){
			var namespace = [];
			$.each(dmodel.properties,function(i,p){
				namespace.push(p.name);
			});
			return namespace;
		})()),
		
		property = new Property(name, type, autoBy);
		dmodel.properties.push(property);
		
	/*如果属性由连线时自动生成，则记录生成属性对应的线段*/
	if(!autoBy) {
		propertyDom = $("#node-template .property").clone();
		propertyDom.find(".propertyType").html(type)
		propertyDom.find(".propertyName").html(name)
		
		target.find(".properties").append(propertyDom);
		
		/*把对应的属性对象缓存到dom节点上，方便查找*/
		propertyDom.data("data",property);
		
		/*如果该target正在编辑框中被编辑，将新添的属性添入编辑系列*/
		var dialog = $("#" + target.attr("dialogId"));
		if(dialog.length == 1){
			var copy = propertyDom.clone().data("data", propertyDom);
			propertyDom.data("copy",copy);
			dialog.find(".properties").append(copy);
			copy.click(); //设置为当前编辑项
			copy.data("data",propertyDom).addClass("active");
		}
	}
}

/*添加行为*/
function addAction(target){
	var dmodel = target.data("data");
	var action = new Action("action","void");
	var actDom = $("#node-template .action").clone();
	
	dmodel.actions.push(action);
	target.find(".actions").append(actDom);
	actDom.data("data",action);
}

/*添加枚举项*/
function addEnumItem(target){
	var enumDom = $("#node-template .enumItem").clone(),
		dmodel = target.data("data"),
		name = getName("ENUMITEM",(function(){
			var namespace = [];
			$.each(dmodel.enumItems,function(i,p){
				namespace.push(p.name);
			});
			return namespace;
		})());
		
	target.find(".enumItems").append(enumDom);
	enumDom.html(name);

	var enumItem = new EnumItem(name);
	enumDom.data("data",enumItem);
	dmodel.enumItems.push(enumItem);
	/*如果该target正在编辑框中被编辑，将新添的属性添入编辑系列*/
	var dialog = $("#" + target.attr("dialogId"));
	if(dialog.length == 1){
		var copy = enumDom.clone();
		enumDom.data("copy",copy);
		dialog.find(".enumitems").append(copy);
		copy.data("data",enumDom).addClass("active");
	}
}


/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓所有更新操作↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
/*更新名字，需要级联更改自动生成的属性的类型名*/
function updateNodeName(node, input, canvas){
	checkNodeName(node, input, canvas);
	
	/*该节点的所有连线*/
	var inAout 	= commonTool.findRelatedLines(node.attr("id"),canvas.LINES),
		newName = input.val(),
		data	= node.data("data"),
		ins 	= inAout.inLines,
		outs 	= inAout.outLines;
	
	var node,model; //node and domainmodel
	$.each(ins,function(i, line){
		line = ins[i];
		node = $("#"+line.fromShapeId);
		model = node.data("data");
		
		switch (line.relationType){
			/**
			 * 被继承者更名时，继承者的继承对象要更名 
			 */
			case "extends" : {
				model.parentName = newName;
				break;
			};
			
			/**
			 * 被实现者更名时，实现者的实现对象要更名
			 */
			case "implements" : {
				var set = model.implementsNameSet;
				for(var i=0 ;i<set.length ;i++){
					if(set[i] == data.name){
						set[i] = newName;
						break;
					}
				}
				break;
			};
			
			/**
			 * 被聚合（组合）者更名时，关联的属性（泛型）类型也要更名
			 */
			case "aggregate" :
			case "associate" :
			case "compose"   : {
				var propertyNode 	= node.find("." + line.lineId);
				var property = propertyNode.data("data");
				propertyNode.find(".genericity").html(newName);
				property.name = newName;
				break;
			};
		}
	});
	
	for(var i in ins){
	}
	
	data.name 	= newName;
	node.find(".name").html(newName);
}

/*更新实体类型*/
function updateEntityType(target, type){
	var data = target.data("data");
	target.find(".entityType").html(type);
	data.entityType = type;
}

/*编辑元素的描述信息*/
function updateDescription(target, val){
	var data = target.data("data");
	data.description = val;
}

/*更改属性的名字*/
function updatePropertyName(propertyDom, val){
	if(!propertyDom) return;
	
	var copy = propertyDom.data("copy"),
		property = propertyDom.data("data");
		
		property.name = val;
		copy ? copy.find(".propertyName").html(val) : "";
		propertyDom.find(".propertyName").html(val);
}

/*更改属性的类型*/
function updatePropertyType(propertyDom, val, form){
	if(!propertyDom) return;
	
	var copy = propertyDom.data("copy"),
		property = propertyDom.data("data");
		
		/*处理泛型*/
		if(!($.inArray(val, ["Set", "HashSet", "List", "ArrayList", "Hashtable", "Vector"]) < 0)){
			propertyDom.addClass("collection_type");
			copy.addClass("collection_type");
			copy.find(".genericity").html("?");
			propertyDom.find(".genericity_input").html("?");
			property.genericity = "?";
			form.find(".genericity_input").show();
		} else {
			propertyDom.removeClass("collection_type");
			copy.removeClass("collection_type");
			form.find(".genericity_input").hide();
			property.genericity = null;
		}
		
		property.type = val;
		copy ? copy.find(".propertyType").html(val) : "";
		propertyDom.find(".propertyType").html(val);
}

/*更改属性的泛型*/
function updatePropertyGenericity(propertyDom, val){
	if(!propertyDom) return;
	
	var copy = propertyDom.data("copy"),
		property = propertyDom.data("data");
	
	if(val == "") val = "?";
	
	property.genericity = val;
	propertyDom.find(".genericity").html(val);
	copy ? copy.find(".genericity").html(val) : "";
}

/*更改枚举项的名字*/
function updateEnumName(enumDom, val){
	if(!enumDom) return;
	
	var copy = enumDom.data("copy"),
		enumItem = enumDom.data("data");
		
		enumItem.name = val;
		copy ? copy.html(val) : "";
		enumDom.html(val);
}
/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑所有更新操作↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/

/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓所有检查操作↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
function checkNodeName(node, name, canvas){
	var models 	= canvas.MODELS,
		val 	= name.val(),
		model	= node.data("data");
		
	for(var i in models){
		if(val == models[i].name && models[i].shapeId != model.shapeId){
			name.addClass("duplication_name"); /*重名*/
			return;
		}
	}
	name.removeClass("duplication_name");/*不重名*/
}
/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑所有检查操作↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/


/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓所有删除操作↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
/*删除节点*/
function deleteNode(node, canvas){
	var id = node.attr("id");
	var ls = commonTool.findRelatedLines(id,canvas.LINES);
	
	/*删除节点的连线*/
	deleteLines(ls.inLines, canvas);
	deleteLines(ls.outLines, canvas);
	
	/*删除节点*/
	delete canvas.MODELS[id];
	delete canvas.NODEDOMS[id];
	node.remove();
}

/**
 * 删除连线.
 * 有级联操作
 */
function deleteLines(lines,canvas){
	var ldom,id;
	$.each(lines,function(i,line){
		id		= line.lineId;
		ldom 	= canvas.LINEDOMS[id];
		switch(line.relationType){
			/*如果*/
			case "extends" : {		//继承线的删除
				var from = canvas.MODELS[line.fromShapeId];
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
				var from = canvas.MODELS[line.fromShapeId], to	= canvas.MODELS[line.toShapeId];
				if(from){
					var set = from.implementsNameSet;
					set.remove($.inArray(set,to.name));
				}
				break;
			};
			
			/**
			 * 当线段是关联关系时，从关联处删除相应的属性
			 */
			case "aggregate":
			case "compose" 	: {
				var from = canvas.MODELS[line.fromShapeId];
				if(from){
					var to 			= canvas.MODELS[line.toShapeId],
						fromNode 	= canvas.NODEDOMS[from.shapeId],
						properties 	= from.properties,
						propertyDom = fromNode.find("."+id);
						
					properties.removeByEquals(propertyDom.data("data"));
					propertyDom.remove();
				}
				break;
			};
			case "" : {
				break;
			};
		}
		
		delete canvas.LINES[id];
		delete canvas.LINEDOMS[id];
		ldom.remove();
	});
}

/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑所有删除操作↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/


/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑对模型的编辑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/


/**
 * 自动命名。
 * 在某个命名空间内，采用递增的方式获取一个可用的命名
 */
function getName(nodeType, nameSpace){
	var name;
	
	for(var i=1 ; ; i++){
		name = nodeType + i;
		if($.inArray(name,nameSpace) < 0)  break;
	}
	return name;
}

/*获取所有已经被占用的节点名(忽略大小写)*/
function getNodeNameSpace(MS){
	var namespace = [];
	for(i in MS){
		namespace.push(MS[i].name.toLowerCase());
	}
	return namespace;
}