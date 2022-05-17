/**
 * 选择框的选择。
 * 给定选择框的值，对应的option会被选中
 */
(function($){
	$.fn.select = function(value){
		var select = $(this);
		if(select.is("select")){
			var options = select.find("option").removeAttr("selected");
			$.each(options,function(i,o){
				if($(o).val() == value){$(o).attr("selected","selscted");}
			});
		}
		return this;
	};
})($);

$("#dialog_container").find(".enumitem_panel").delegate(".enumItem", "click", function(){
	var enumItem = $(this);
	if(enumItem.attr("contenteditable") == undefined){
		enumItem.attr("contenteditable",true);
		enumItem.attr("spellcheck",false);
		enumItem.focus();
	}
}).delegate(".enumItem", "input", function(){
	var enumItem = $(this);
	updateEnumItemName(enumItem.data("data"), enumItem.text());
}).delegate(".enumItem", "blur", function(){
	$(this).removeAttr("contenteditable");
});

/*
 * 编辑属性
 */
$("#dialog_container").find(".property_panel:first").delegate(".property", "click", function(){
	var property = $(this);
	/*选中的样式*/
	$("#dialog_container .properties .active").removeClass("active");
	property.parents(".property_item").addClass("active");
	editDialog.initPropertyForm(property.data("data"));
}).delegate(".delete_property","click", function(){
	var btn = $(this);
	var entity = btn.parents(".dialog").data("data");
	var propertyDom = btn.parents(".property_item:first");
	var property = propertyDom.data("data");
	
	entity.properties.removeByEquals(property);
	propertyDom.remove();
	$("#"+property.id).remove();
}).delegate(".add_property", "click", function(){
	var entity = $(this).parents(".dialog").data("data");
	/*自动获取不重复的命名*/
	var propertyName = getName("property", (function(){
		var namespace = [];
		$.each(entity.properties, function(i,p){
			namespace.push(p.name);
		});
		return namespace;
	})());
	var property = new Property(propertyName, "String");
	addProperty(entity, property, true);
});

/*
 * 编辑方法
 */
$("#dialog_container").find(".action_panel:first").delegate(".edit_action", "click", function(){
	var btn = $(this);
	var actionData = btn.parents(".action_item:first").data("data");
	btn.parents(".action_list:first").slideUp().next(".edit_action_detail").slideDown();
	editDialog.initActionForm(actionData);
}).delegate(".delete_action", "click", function(){
	var btn = $(this);
	var entity = btn.parents(".dialog").data("data");
	var actionDom = btn.parents(".action_item:first");
	var action = actionDom.data("data");
	
	entity.actions.removeByEquals(action);
	$("#"+action.id).remove();
	actionDom.remove();
}).delegate(".back_to_actionlist","click", function(){
	$(this).parents(".edit_action_detail:first").slideUp().prev(".action_list").slideDown();
}).delegate(".add_action", "click", function(){
	var entity = $(this).parents(".dialog").data("data");
	
	/*自动获取不重复的命名*/
	var actionName = getName("action", (function(){
		var namespace = [];
		$.each(entity.actions, function(i, a){
			namespace.push(a.name);
		});
		return namespace;
	})());
	
	var action = new Action(actionName);
	addAction(entity, action, true);
}).delegate(".add_argument", "click", function(){
	var action = $(this).parents("#editActionDetailForm:first").data("data");
	/*自动获取不重复的命名*/
	var argumentName = getName("argument", (function(){
		var namespace = [];
		$.each(action.arguments, function(i, a){
			namespace.push(a.name);
		});
		return namespace;
	})());
	
	var argument = new Argument(argumentName, "String");
	addActionArguments(action, argument, true);
	return false;
}).delegate(".delete_argument", "click", function(){
	var btn = $(this);
	var action = btn.parents("#editActionDetailForm:first").data("data");
	var argument = btn.parents(".argument_item:first").data("data");
	
	action.arguments.removeByEquals(argument);
	$("#"+argument.id).remove();
	btn.parents(".argument_item:first").remove();
	
	console.log(action);
});

/*
 * 编辑属性
 */
$("#dialog_container").find(".enumitem_panel:first").delegate("", ".add_enumitems", function(){
	
});

/*为了实现编辑结果在展示和数据同步上尽量自动化*/
editDialog = {
	initDialog : function(node, UMLCANVAS){
		if(node.is(".node")){
			this.initEntityDialog(node, UMLCANVAS);
		} else if(node.is(".line")) {
			
		}
	},
	
	initEntityDialog : function(node, UMLCANVAS){
		var entityData	= node.data("data");
		
		/*隐藏上一个对话框*/
		$("#dialog_container>.active_dialog").removeClass("active_dialog");
		var dialog = $("."+entityData.shapeType.toLowerCase()+"_dialog").addClass("active_dialog");
		
		if(dialog.attr("id") && (dialog.attr("id") == node.attr("dialogid"))){
			return null;
		}
		
		/*每个被编辑的对象都持有对应窗口的id，id随机获取*/
		var dialogId = commonTool.guid();
		/*将在对话框中要用到的数据进行缓存，减少查找成本*/
		dialog
			.data("data",node.data("data"))	//被编辑的模型对象
			.data("node",node)				//被编辑的节点对象
			.data("canvas", UMLCANVAS)		//画布对象
			.attr("id",dialogId);
		
		node.attr("dialogId", dialogId);
		
		if(node.is(".entity")){
			dialog.removeClass("edit_interface").addClass("edit_entity");
			this.initClassPanel(dialog, entityData);
			this.initPropertyPanel(dialog, entityData.properties);
			this.initActionPanel(dialog, entityData.actions);
			
			//切换到适当的tab上
			var tabs = dialog.children(".tabs");
			if(tabs.children(".interface_tab").is(".active")){
				tabs.children(".interface_tab").removeClass("active");
				tabs.next(".panels").children(".interface_panel").removeClass("active");
				tabs.children(".entity_tab").addClass("active");
				tabs.next(".panels").children(".entity_panel").addClass("active");
			}
		} else if(node.is(".interface")){
			dialog.removeClass("edit_entity").addClass("edit_interface");
			this.initInterfacePanel(dialog ,entityData ,node);
			this.initActionPanel(dialog, entityData.actions);
			
			//切换到适当的tab上
			var tabs = dialog.children(".tabs");
			if(tabs.children(".entity_tab").is(".active") || tabs.children(".property_tab").is(".active")){
				tabs.children(".active").removeClass("active");
				tabs.next(".panels").children(".active").removeClass("active");
				tabs.children(".interface_tab").addClass("active");
				tabs.next(".panels").children(".interface_panel").addClass("active");
			}
		} else if(node.is(".enum")){
			this.initEnumPanel(dialog, entityData, node);
		}
		
		return dialog;
	},
	
	/**
	 * 初始化类编辑窗口。
	 * 同时会初始化该类的属性和行为编辑窗口
	 */
	initClassPanel : function(dialog, data, node){
		var panel = dialog.find(".entity_panel");
		panel.data("node",node);
		panel.find("input[name='name']").val(data.name).change();
		panel.find(".entityType").select(data.entityType);
		panel.find(".entityScope").select(data.entityScope);
		panel.find(".desc").val(data.description);
	},
	
	/*
	 * 初始化接口面板
	 */
	initInterfacePanel : function(dialog, data, node){
		var panel = dialog.find(".interface_panel");
		panel.data("node",node);
		panel.find("input[name='name']").val(data.name);
		panel.find("select[name='scope']").select(data.scope);
		panel.find("input[name='description']").val(data.description);
	},
	
	/**
	 * 枚举初始化面板
	 */
	initEnumPanel : function(dialog, data, node){
		var panel = dialog.find(".enum_panel");
		panel.data("node",node);
		panel.find("input[name='name']").val(data.name);
		panel.find("select[name='scope']").select(data.scope);
		panel.find("input[name='description']").val(data.description);
		
		var enumitems = dialog.find(".enumitems").empty();
		$.each(node.find(".enumItem"), function(i, n){
			enumitems.append($(n).clone().data("data",$(n)));
		});
	},
	
	/*初始化属性编辑窗口*/
	initPropertyPanel : function(dialog, properties){
		var panel = dialog.find(".property_panel");
		
		/*@TODO 防止误编辑上一个属性*/
		panel.find("form").data("data", null)[0].reset();
		panel.find(".properties").empty();
		
		if(properties.length > 0){
			this.initPropertyForm(properties[0]);
			$.each(properties, function(i, property){
				//property 元素的副本
				editDialog.addPropertyToEdit(property);
			});
		}
	},
	

	/**
	 * 将一个属性添加到编辑窗口
	 * @param action
	 */
	addPropertyToEdit : function(property){
		if(property.autoBy) return;
		var copy = $("#"+property.id).clone().data("data",property).removeAttr("id");
		var propertyItem = $("<div class='property_item'/>").append(copy).append('<a href="javascript:void(0)" class="delete_property">删除</a>');
		$("#"+property.id).data("copy", copy);
		propertyItem.data("data", property);
		$("#dialogPropertySet").append(propertyItem);
	},
	
	/*初始化编辑对话框中的 编辑属性的 表单*/
	initPropertyForm : function(property){
		var form = $("#editPropertyDetailForm");
		form.data("data", property);
		form[0].reset();
		form.find("input[name='name']").val(property.name);
		form.find("input[name='type']").val(property.type);
		form.find("select[name='scope']").select(property.scope);
		if(property.genericity){
			form.find(".genericity_input").show().find("input").val(property.genericity);
		} else {
			form.find(".genericity_input").hide();
		}
	},
	
	/**
	 * 初始化方法编辑面板
	 * @param dialog
	 * @param actions
	 */
	initActionPanel : function(dialog, actions){
		dialog.find("#dialogActionList").show().find("#dialogActionSet").empty();

		$.each(actions, function(i, action){
			editDialog.addActionToEdit(action);
		});
		
		$("#editActionDetailForm").hide();
	},
	
	/**
	 * 初始化方法编辑框
	 * @param editForm
	 * @param actionData
	 */
	initActionForm : function(action){
		var editForm = $("#editActionDetailForm");
		editForm.data("data", action);
		
		editForm.find("input[name='action_name']").val(action.name);
		editForm.find("input[name='action_returntype']").val(action.returnType);
		editForm.find("select[nam='action_modifier']").select(action);
		/*
		 * 编辑方法参数
		 */
		$("#dialogArgumentSet").empty();
		$.each(action.arguments, function(i, argument){
			editDialog.addActionArgumentToEdit(argument);
		});
	},
	
	/**
	 * 将一个方法添加到编辑窗口
	 * @param action
	 */
	addActionToEdit : function(action){
		var copy = $("#"+action.id).clone().removeAttr("id");
		$("#"+action.id).data("copy", copy);
		actionDom = $('<div class="action_item"/>').append(copy).append('<div class="edit_option"><a href="javascript:void(0);" class="edit_action">编辑</a><a href="javascript:void(0);" class="delete_action">删除</a></div>');
		$("#dialogActionSet").append(actionDom);
		actionDom.data("data", action);
	},
	
	/**
	 * 将一个方法参数添加到编辑窗口
	 * @param action
	 */
	addActionArgumentToEdit : function(argument){
		var temp = $("#dialog_template").children(".argument_item:first").clone().data("data", argument);
		var detail = temp.children(".argument_detail:first");
		
		detail.children(".argument_name").html(argument.name).end()
			.children(".argument_type").html(argument.type);
		
		if(argument.genericity){
			detail.children(".genericity").html(argument.genericity).show();
		}
		$("#dialogArgumentSet").append(temp);
	},
	
	/**
	 *激活对话框 
	 * @param name
	 * @returns
	 */
	activeDialog : function(name){
		$("#dialog_container>.active_dialog").removeClass("active_dialog");
		return $("."+name).addClass("active_dialog");
	}
};

dialog = {
	deleteNode : function(n){
		deleteNode();
	}
};