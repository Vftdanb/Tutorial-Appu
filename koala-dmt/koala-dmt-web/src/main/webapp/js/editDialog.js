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
	}
})($);

$("#dialog_container").delegate("input,select,textarea","change",function(e){
	var panel 	= $(this).parents(".panel"),
		model 	= panel.data("model"),
		node	= panel.data("node"),
		data 	= panel.data("data"),
		attr 	= $(this).attr("name");
	
	node.find("."+attr).html($(this).val());
	data[attr] = $(this).val();
	
	console.log(JSON.stringify(data));
	console.log(attr);
});


/*为了实现编辑结果在展示和数据同步上尽量自动化*/
editDialog = {
	initDialog : function(node){
		var dialog = null;
		if(node.is(".node")){
			dialog = this.initEntityDialog(node);
		} else if(node.is(".line")) {
			
		}
		
		dialog.data("model",node.data("model")).data("node",node);
		dialog.tab();
	},
	
	initEntityDialog : function(node){
		var dialog 	= null,
			model	= node.data("model");
			
		if(node.is(".entity")){
			dialog 	= $("#dialog-template .entity_dialog").clone();
			this.initClassPanel(dialog.find(".entity_panel") ,model ,node);
			this.initPropertyPanel(dialog.find(".property_panel") , node.find(".property"));
			this.initActionPanel(dialog , node.find(".action"));
		} else if(node.is(".interface")){
			dialog = $("#dialog-template .interface_dialog").clone();
			
			this.initInterfacePanel(dialog.find(".interface_panel") ,model ,node);
			this.initPropertyPanel(dialog.find(".property_panel") , node.find(".property"));
			this.initActionPanel(dialog , node.find(".action"));
		} else if(node.is(".enum")){
			dialog = $("#dialog-template .enum_dialog").clone();
			
			this.initInterfacePanel(dialog.find(".enum_panel") ,model ,node);
			//this.initPropertyPanel(dialog.find(".enumItem_panel") , node.find(".property"));
			//this.initActionPanel(dialog , node.find(".action"));
		}
		
		$("#dialog_container").html(dialog);
		return dialog;
	},
	
	/**
	 * 初始化类编辑窗口。
	 * 同时会初始化该类的属性和行为编辑窗口
	 */
	initClassPanel : function(p,m,n){
		p.data("data",m);
		p.data("node",n);
		p.find(".entityName").val(m.name);
		p.find(".entityType").select(m.entityType);
		p.find(".entityScope").select(m.entityScope);
		p.find(".desc").val(m.description);
	},
	
	/*
	 * 初始化接口面板
	 */
	initInterfacePanel : function(p,m,n){
		p.data("data",m);
		p.data("node",n);
		p.find("input[name='name']").val(m.name);
		p.find("select[name='scope']").select(m.scope);
		p.find("input[name='description']").val(m.description);
	},
	
	/*初始化属性编辑窗口*/
	initPropertyPanel : function(d,ps){
		var	table = $("<table/>");
			
		d.append(table);
		$.each(ps,function(i,p){});
	},
	
	initActionPanel : function(dialog,as){
		
	}
};