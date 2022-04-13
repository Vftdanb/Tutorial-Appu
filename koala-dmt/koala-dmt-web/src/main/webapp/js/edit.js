/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓对话框编辑，编辑结果实时同步↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
(function(){
	var dialogs = $(".dialog_container");
	dialogs.find(".entity_panel").delegate("input");
})();
/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑对话框编辑，编辑结果实时同步↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/

/**
 * @param t
 * @param canvas
 */
function ZOOM(t,canvas){
	var value = $(t).val();
	canvas.UMLCANVAS.css("transform","scale("+value+")");
}

/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓对模型的编辑↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
/**
 * @param canvas
 * @param lineData
 */
function addLine(canvas, lineData){
	lineDom = $("#line-template ."+name).clone();
	var pline = lineDom.children();
	
	pline.attr("points",lineData.points);
	
	if(lineData){
		
	}
}

/*页面上添加一个节点，对应业务上的一个类或接口*/
/**
 * @param canvas
 * @param model
 * @returns
 */
function addNode(canvas, model){
	var node = $("#node-template ."+model.shapeType.toLowerCase()).clone().css({
			left : model.position.x,
			top  : model.position.y
		});
	
	node.find(".name").html(model.name);
	node.attr("id", model.shapeId).data("data", model); //把对应领域模型缓存在dom节点上，方便查找
	canvas.MODELS[model.shapeId]	= model; //节点的控制数据（前端用）
	canvas.NODEDOMS[model.shapeId] = node;
	
	canvas.UMLCANVAS.append(node);
	
	if(model.properties){
		$.each(model.properties, function(i, property){
			addProperty(node, property, false);
		});
	}
	
	return node;
}

/**************************************添加节点的各种成员******************************************/
/*
 * 添加属性
 * autoBy:指定该属性是否由于连线而自动生成
 */
/**
 * @param target
 * @param propertyData
 * @param isAddToModel
 */
function addProperty(target, propertyData, isAddToModel) {
	var dmodel = target.data("data");
		
		if(isAddToModel) dmodel.properties.push(propertyData);
		
	/*
	 * 如果属性由连线时自动生成，则记录生成属性对应的线段
	 * 把添加的属性显示出来
	 */
	if(!propertyData.autoBy) {
		propertyDom = $("#node-template .property").clone();
		propertyDom.find(".propertyType").html(propertyData.type);
		propertyDom.find(".propertyName").html(propertyData.name);
		
		target.find(".properties").append(propertyDom);
		
		/*把对应的属性对象缓存到dom节点上，方便查找*/
		propertyDom.data("data", propertyData);
		
		/*如果该target正在编辑框中被编辑，将新添的属性添入编辑系列*/
		var dialog = $("#" + target.attr("dialogId"));
		if(dialog.length == 1){
			var copy = propertyDom.clone().data("data", propertyDom);
			propertyDom.data("copy", copy);
			dialog.find(".properties").append(copy);
			copy.click(); //设置为当前编辑项
			copy.data("data",propertyDom).addClass("active");
		}
	}
}

/*添加行为*/
/**
 * @param target
 * @param actionData
 */
function addAction(target, actionData, isAddToModel){
	var dmodel = target.data("data");
	var actDom = $("#node-template .action").clone();
	dmodel.actions.push(actionData);
	console.log(dmodel);
	target.find(".actions").append(actDom);
	actDom.data("data",actionData);
	actDom.find(".actionName").html(actionData.name);
	actDom.find(".returnType").html(actionData.returnType);
}

/**
 * 
 * @param target
 * @param parameterData
 * @param isAddToModel 当反向生成图时，不需要把
 */
function addActionParameter(target, parameterData, isAddToModel){
	var paramDom = $("#node-template").children(".action_parameter");
	
	paramDom.children(".parameterName").html(parameterData.name);
	paramDom.children(".parameterType").html(parameterData.type);
	target.children(".paramters").append(paramDom);
	
	if(isAddToModel){
		var action = target.data("data");
		action.parameters.push(prameterData);
	}
}

/*添加枚举项*/
/**
 * @param target
 * @param itemData
 * @param isAddToModel
 */
function addEnumItem(target, itemData, isAddToModel){
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
	enumDom.data("data",itemData);
	if(isAddToModel){
		dmodel.enumItems.push(enumItem);
	}
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
/**
 * @param node
 * @param input
 * @param canvas
 */
function updateNodeName(node, input, canvas){
	checkNodeName(node, input, canvas);
	
	/*该节点的所有连线*/
	var inAout 	= commonTool.findRelatedLines(node.attr("id"),canvas.LINES),
		newName = input.val(),
		data	= node.data("data"),
		ins 	= inAout.inLines;
	
	var model; //node and domainmodel
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
	
	data.name 	= newName;
	node.find(".name").html(newName);
}

/*更新实体类型*/
/**
 * @param target
 * @param type
 */
function updateEntityType(target, type){
	var data = target.data("data");
	target.find(".entityType").html(type);
	data.entityType = type;
}

/*编辑元素的描述信息*/
/**
 * @param target
 * @param val
 */
function updateDescription(target, val){
	var data = target.data("data");
	data.description = val;
}

/*更改属性的名字*/
/**
 * @param propertyDom
 * @param val
 */
function updatePropertyName(propertyDom, val){
	if(!propertyDom) return;
	
	var copy = propertyDom.data("copy"),
		property = propertyDom.data("data");
		
		property.name = val;
		copy ? copy.find(".propertyName").html(val) : "";
		propertyDom.find(".propertyName").html(val);
}

/*更改属性的类型*/
/**
 * @param propertyDom
 * @param val
 * @param form
 */
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
/**
 * @param propertyDom
 * @param val
 */
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
/**
 * @param enumDom
 * @param val
 */
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
/**
 * @param node
 * @param name
 * @param canvas
 */
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
/**
 * @param node
 * @param canvas
 */
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
/**
 * @param lines
 * @param canvas
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
					var fromNode 	= canvas.NODEDOMS[from.shapeId],
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
/**
 * @param nodeType
 * @param nameSpace
 * @returns
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
/**
 * @param MS
 * @returns {Array}
 */
function getNodeNameSpace(MS){
	var namespace = [];
	for(i in MS){
		namespace.push(MS[i].name.toLowerCase());
	}
	return namespace;
}