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
	node.attr("id", model.id).data("data", model); //把对应领域模型缓存在dom节点上，方便查找
	canvas.MODELS[model.id]	= model; //节点的控制数据（前端用）
	canvas.NODEDOMS[model.id] = node;
	
	canvas.UMLCANVAS.append(node);
	
	if(model.properties){
		$.each(model.properties, function(i, property){
			addProperty(model, property, false);
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
 * @param entity
 * @param propertyData
 * @param isAddToModel
 */
function addProperty(entity, propertyData, isAddToModel) {
	var targetNode = $("#"+entity.id);
	if(isAddToModel) entity.properties.push(propertyData);
		
	/*
	 * 如果属性由连线时自动生成，则记录生成属性对应的线段
	 * 把添加的属性显示出来
	 */
	if(!propertyData.autoBy) {
		propertyDom = $("#node-template .property").clone();
		propertyDom.find(".propertyType").html(propertyData.type);
		propertyDom.find(".propertyName").html(propertyData.name);
		
		targetNode.find(".properties").append(propertyDom);
		propertyDom.attr("id", propertyData.id);
		
		/*把对应的属性对象缓存到dom节点上，方便查找*/
		propertyDom.data("data", propertyData);
		
		/*如果该target正在编辑框中被编辑，将新添的属性添入编辑系列*/
		var dialog = $("#" + targetNode.attr("dialogId"));
		if(dialog.length == 1){
			editDialog.addPropertyToEdit(propertyData);
			propertyDom.data("copy").click(); //设置为当前编辑项
		}
	}
}

/*添加行为*/
/**
 * @param targetNode
 * @param actionData
 */
function addAction(model, actionData, isAddToModel){
	var targetNode = $("#"+model.id);
	var actDom = $("#node-template .action").clone();
	model.actions.push(actionData);
	targetNode.find(".actions").append(actDom);
	actDom.find(".actionName").html(actionData.name);
	actDom.find(".returnType").html(actionData.returnType);
	
	actDom.attr("id", actionData.id);
	
	/*把对应的属性对象缓存到dom节点上，方便查找*/
	actDom.data("data",actionData);
	
	/*如果该target正在编辑框中被编辑，将新添的属性添入编辑系列*/
	var dialog = $("#" + targetNode.attr("dialogId"));
	if(dialog.length == 1){
		editDialog.addActionToEdit(actionData);
	}
	
	if(actionData.arguments){
		$.each(actionData.arguments, function(i, argument){
			addActionArguments(action, argument, false);
		});
	}
}

/**
 * 为方法添加参数
 * @param action
 * @param argument
 * @param isAddToModel 当反向生成图时，不需要把
 */
function addActionArguments(action, argument, isAddToModel){
	var argumentDom = $("#node-template").children(".action_argument").clone();
	
	argumentDom.children(".argumentName").html(argument.name);
	argumentDom.children(".argumentType").html(argument.type);
	argumentDom.attr("id", argument.id);
	/*把对应的参数对象缓存到dom节点上，方便查找*/
	argumentDom.data("data", argument);
	$("#"+action.id).children(".arguments:first").append(argumentDom);
	if($("#"+action.id).data("copy")){
		$("#"+action.id).data("copy").children(".arguments:first").html("...");
	}
	editDialog.addActionArgumentToEdit(argument);
	if(isAddToModel){
		action.arguments.push(argument);
	}
}

/**
 *添加枚举项 TODO
 * @param targetNode
 * @param itemData
 * @param isAddToModel
 */
function addEnumItem(model, itemData, isAddToModel){
	var targetNode = $("#"+model.id);
	
	var enumDom = $("#node-template .enumItem").clone(),
		model = targetNode.data("data"),
		name = getName("ENUMITEM",(function(){
			var namespace = [];
			$.each(model.enumItems,function(i,p){
				namespace.push(p.name);
			});
			return namespace;
		})());
		
	targetNode.find(".enumItems").append(enumDom);
	enumDom.html(name);

	var enumItem = new EnumItem(name);
	enumDom.data("data",itemData);
	if(isAddToModel){
		model.enumItems.push(enumItem);
	}
	/*如果该target正在编辑框中被编辑，将新添的属性添入编辑系列*/
	var dialog = $("#" + targetNode.attr("dialogId"));
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
function updateModelName(model, input, canvas){
	var node = $("#"+model.id);
	checkNodeName(node, input, canvas);
	var newName = input.val();
	model.name 	= newName;
	node.find(".name").html(newName);
}

/*更新实体类型*/
/**
 * @param model
 * @param type
 */
function updateEntityType(model, type){
	$("#"+model.id).find(".entityType").html(type);
	model.entityType = type;
}

/*编辑元素的描述信息*/
/**
 * @param model
 * @param val
 */
function updateDescription(model, val){
	model.description = val;
}

/**
 * 更改属性的名字
 * @param property
 * @param val
 */
function updatePropertyName(property, val){
	if(!property) return;
	
	var propertyDom = $("#"+property.id);
	var copy = propertyDom.data("copy");		
		property.name = val;
		copy ? copy.find(".propertyName").html(val) : "";
		propertyDom.find(".propertyName").html(val);
}

/**
 *更改属性的类型
 * @param property
 * @param val
 * @param form
 */
function updatePropertyType(property, val, form){
	var propertyDom = $("#"+property.id);
	if(!propertyDom) return;
	
	var copy = propertyDom.data("copy");
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

/**
 *更改属性的泛型
 * @param property
 * @param val
 */
function updatePropertyGenericity(property, val){
	if(!property) return;
	var propertyDom = $("#"+property.id);
	var copy = propertyDom.data("copy");
	
	if(val == "") val = "?";
	property.genericity = val;
	propertyDom.find(".genericity").html(val);
	copy ? copy.find(".genericity").html(val) : "";
}

/**
 * 更改方法的名字
 * @param action
 * @param val
 */
function updateActionName(action, val){
	if(!action) return;
	
	var actionDom = $("#"+action.id);
	var copy = actionDom.data("copy");
	
	action.name = val;
	copy ? copy.find(".actionName").html(val):"";
	actionDom.find(".actionName").html(val);
}

/**
 * 更改方法返回值
 * @param action
 * @param val
 */
function updateActionReturnType(action, val){
	if(!action) return;
	
	var actionDom = $("#"+action.id);
	var copy = actionDom.data("copy");
	action.returnType = val;
	copy ? copy.find(".returnType").html(val):"";
	actionDom.find(".returnType").html(val);
}

/**
 * 更改方法修饰符
 * @param action
 * @param val
 */
function updateActionModifier(action, val){
	if(!action) return;
	
	var actionDom = $("#"+action.id);
	var copy = actionDom.data("copy");
	action.modifier = val;
	
	copy ? copy.removeClass("public private protected").addClass(val):"";
	actionDom.removeClass("public private protected").addClass(val);
}

/**
 * 更改枚举项的名字
 * @param enumItem
 * @param val
 */
function updateEnumItemName(enumItem, val){
	var enumDom = $("#"+enumItem.id);
	if(!enumDom) return;
	
	var copy = enumDom.data("copy");
	enumItem.name = val;
	copy ? copy.html(val) : "";
	enumDom.html(val);
}

/**
 * 更新argument的名字
 * @param argument
 * @param val
 */
function updateActionArgumentName(argument, val){
	argument.name = val;
}

/**
 * 更新argument的类型
 * @param argument
 * @param input
 */
function updateActionArgumentType(argument, input){
	var val = input.text();
	
	if(!($.inArray(val, ["Set", "HashSet", "List", "ArrayList", "Hashtable", "Vector"]) < 0) && argument.genericity == null){
		input.next(".genericity").show().html("?");
		argument.genericity = "?";
	} else {
		input.next(".genericity").hide();
		argument.genericity = null;
	}
	argument.type = input.text();
}

/**
 * 更新argument的泛型
 * @param argument
 * @param val
 */
function updateActionArgumentGenericity(argument, input){
	val = input.text();
	if(val == ""){
		input.html("?");
		argument.genericity = "?";
	} else {
		argument.genericity = val;
	}
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
		if(val == models[i].name && models[i].id != model.id){
			name.addClass("duplication_name"); /*重名*/
			return;
		}
	}
	name.removeClass("duplication_name");/*不重名*/
}
/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑所有检查操作↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/


/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓所有删除操作↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
/**
 * 删除领域模型
 * @param model
 * @param canvas
 */
function deleteModel(model, canvas){
	var node = $("#"+model.id);
	var ls = commonTool.findRelatedLines(model.id, canvas.LINES);
	
	/*删除节点的连线*/
	deleteLines(ls.inLines, canvas);
	deleteLines(ls.outLines, canvas);
	
	/*删除节点*/
	delete canvas.MODELS[model.id];
	delete canvas.NODEDOMS[model.id];
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
function deleteLines(lines, canvas){
	var ldom,id;
	$.each(lines, function(i,line){
		id		= line.id;
		ldom 	= canvas.LINEDOMS[id];
		switch(line.relationType){
			/*如果*/
			case "extends" : {		//继承线的删除
				canvas.MODELS[line.fromShapeId].parentId = null;
				break;
			};
			
			/**
			 * 如果被实现者被删除，要把被实现者从实现者的实现列表里删除
			 * 如果实现者被删除，不需要做任何级联操作
			 */
			case "implements" : {
				var from = canvas.MODELS[line.fromShapeId], to	= canvas.MODELS[line.toShapeId];
				from.implementsIdSet.removeByEquals(to.id);
				break;
			};
			
			/**
			 * 当线段是关联关系时，从关联处删除相应的属性
			 */
			case "aggregate":
			case "compose" 	:
			case "associate" : {
				var from = canvas.MODELS[line.fromShapeId];
				var to = canvas.MODELS[line.toShapeId];
				
				/*删除关联属性*/
				$.each(from.properties, function(i, property){
					if(property.autoBy == line.id){
						from.properties.remove(i);
						return false;
					}
				});
				
				/*删除关联属性*/
				$.each(to.properties, function(i, property){
					if(property.autoBy == line.id){
						from.properties.remove(i);
						return false;
					}
				});
				
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