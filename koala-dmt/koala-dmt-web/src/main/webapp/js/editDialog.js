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
	var property = $(this),
		form	= property.parent().parent().find("form");
	
	/*选中的样式*/
	$("#dialog_container .properties .active").removeClass("active");
	property.addClass("active");
	
	editDialog.initPropertyForm(form, property.data("data"));
});

/*为了实现编辑结果在展示和数据同步上尽量自动化*/
editDialog = {
	initDialog : function(node, UMLCANVAS){
		var dialog = null;
		if(node.is(".node")){
			dialog = this.initEntityDialog(node);
		} else if(node.is(".line")) {
			
		}
		
		/*将在对话框中要用到的数据进行缓存，减少查找成本*/
		dialog
			.data("data",node.data("data"))	//被编辑的模型对象
			.data("node",node)				//被编辑的节点对象
			.data("canvas",UMLCANVAS);		//画布对象
		
		node.data("dialog",dialog);	
	},
	
	initEntityDialog : function(node){
		var data	= node.data("data");
		
		/*隐藏上一个对话框*/
		$("#dialog_container>.active_dialog").removeClass("active_dialog");
		
		
		var dialog = $("."+data.shapeType+"_dialog").addClass("active_dialog");
		
		if(node.is(".entity")){
			this.initClassPanel(dialog ,data, node);
			this.initPropertyPanel(dialog ,node);
			
			
			
		} else if(node.is(".interface")){
			this.initInterfacePanel(dialog ,data ,node);
		} else if(node.is(".enum")){
			this.initInterfacePanel(dialog ,data ,node);
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
		panel.find("input[name='name']").val(data.name);
		panel.find(".entityType").select(data.entityType);
		panel.find(".entityScope").select(data.entityScope);
		panel.find(".desc").val(data.description);
	},
	
	/*
	 * 初始化接口面板
	 */
	initInterfacePanel : function(dialog,m,n){
		var panel = dialog.find(".interface_panel");
		panel.data("node",n);
		panel.find("input[name='name']").val(m.name);
		panel.find("select[name='scope']").select(m.scope);
		panel.find("input[name='description']").val(m.description);
	},
	
	/*初始化属性编辑窗口*/
	initPropertyPanel : function(dialog,node){
		var properties = node.find(".property");
		var panel = dialog.find(".property_panel");
		
		/*@TODO 防止误编辑上一个属性*/
		panel.find("form").data("data", null)[0].reset();
		panel.find(".properties").empty();
		
		if(properties.length > 0){
			this.initPropertyForm(panel.find("form"),$(properties[0]));
			
			var propertyDom = panel.find(".properties"),
				property,
				copy;	//property 元素的副本
			$.each(properties, function(i, p){
				property = $(p);
				copy = property.clone().data("data",property);
				
				property.data("copy", copy); //互相持有引用，方便数据更新时同步显示
				propertyDom.append(copy);
			});
			
			propertyDom.find(".property:first").click();
		}
	},
	
	/*初始化编辑对话框中的 编辑属性的 表单*/
	initPropertyForm : function(form, property){
		var data = property.data("data");
		
		form.data("data",property);
		form.find("input[name='name']").val(data.name);
		form.find("input[name='type']").val(data.type);
		form.find("select[name='scope']").select(data.scope);
		if(data.genericity){
			form.find(".genericity_input").show().find("input").val(data.genericity);
		} else {
			form.find(".genericity_input").hide();
		}
	},
	
	initActionPanel : function(dialog,as){
		
	},
	
	/*激活对话框*/
	activeDialog : function(name){
		$("#dialog_container>.active_dialog").removeClass("active_dialog");
		return $("."+name).addClass("active_dialog");
	}
};

dialog = {
	deleteNode : function(n){
		deleteNode();
	}
}