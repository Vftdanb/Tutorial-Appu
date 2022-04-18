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

$("#dialog_container").delegate(".property", "click", function(){
	var property = $(this);
	
	/*选中的样式*/
	$("#dialog_container .properties .active").removeClass("active");
	property.parents(".property_item").addClass("active");
	editDialog.initPropertyForm(property.parents("fieldset:first").prev(), property.data("data"));
});

$("#dialog_container").find(".enumitem_panel").delegate(".enumItem", "click", function(){
	var enumItem = $(this);
	if(enumItem.attr("contenteditable") == undefined){
		enumItem.attr("contenteditable",true);
		enumItem.attr("spellcheck",false);
		enumItem.focus();
	}
}).delegate(".enumItem", "input", function(){
	var enumItem = $(this);
	updateEnumName(enumItem.data("data"), enumItem.text());
}).delegate(".enumItem", "blur", function(){
	$(this).removeAttr("contenteditable");
});


/*
 * 编辑方法
 */
$("#dialog_container").find(".action_panel:first").delegate(".edit_action", "click", function(){
	var btn = $(this);
	var actionData = btn.parents(".action_item:first").data("data");
	var editForm = btn.parents(".action_list:first").slideUp().next(".edit_action_detail").slideDown();
	editDialog.initActionForm(editForm, actionData);
	
}).delegate(".delete_action", "click", function(){
	var btn = $(this);
	var action = btn.parents(".action_item:first");
	var actionData = action.data("data");
	
	
}).delegate(".back_to_actionlist","click", function(){
	$(this).parents(".edit_action_detail:first").slideUp().prev(".action_list").slideDown();
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
			this.initClassPanel(dialog, entityData);
			this.initPropertyPanel(dialog, entityData.properties);
			this.initActionPanel(dialog, entityData.actions);
		} else if(node.is(".interface")){
			this.initInterfacePanel(dialog ,entityData ,node);
			this.initActionPanel(dialog, entityData.actions);
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
			this.initPropertyForm(panel.find("form"),properties[0]);
			var propertyDom = panel.find(".properties");	
			$.each(properties, function(i, property){
				//property 元素的副本
				var copy = $("#"+property.id).clone().data("data",property).removeAttr("id");
				$("#"+property.id).data("copy", copy);
				propertyDom.append($("<div class='property_item'/>").append(copy).append('<a href="javascript:void(0)" class="delete_property">删除</a>'));
			});
		}
	},
	
	/*初始化编辑对话框中的 编辑属性的 表单*/
	initPropertyForm : function(form, property){
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
	 * 
	 */
	initActionPanel : function(dialog, actions){
		var actionSet = dialog.find(".action_set:first").empty();
		var actionDom;
		
		console.log(actions);
		
		$.each(actions, function(i, action){
			var copy = $("#"+action.id).clone().removeAttr("id");
			$("#"+action.id).data("copy", copy);
			actionDom = $('<div class="action_item"/>').append(copy).append('<div class="edit_option"><a href="javascript:void(0);" class="edit_action">编辑</a><a href="javascript:void(0);" class="delete_action">删除</a></div>');
			actionSet.append(actionDom);
			actionDom.data("data", action);
		});
	},
	
	/**
	 * 初始化方法编辑框
	 * @param editForm
	 * @param actionData
	 */
	initActionForm : function(editForm, action){
		editForm.find("input[name='action_name']").val(action.name);
		editForm.find("input[name='action_returntype']").val(action.returnType);
		editForm.find("select[nam='action_modifier']").select(action);
		
		var temp = $("#dialog_template").children("parameter_item:first");
		/*
		 * 初始化方法参数
		 */
		$.each(action.arguments, function(i, argument){
			var paramDom = temp.clone();
			
			paramDom.children(".parameter_detail:first")
				.children(".parameter_name").html(argument.name).end()
				.children(".parameter_type").html(argument.type).end()
				.children(".genericity").html(argument.genericity);
		});
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