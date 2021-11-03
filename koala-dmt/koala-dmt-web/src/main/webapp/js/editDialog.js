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
		attr 	= $(this).attr("name"),
		claz	= $(this).attr("class");
	
	node.find("."+claz).html($(this).val());
	data[attr] = $(this).val();
	
	console.log(JSON.stringify(data));
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
			//this.initActionPanel(dialog , node.find(".action"));
		} else if(node.is(".interface")){
			dialog = $("#dialog-template .interface_dialog").clone();
			
			this.initInterfacePanel(dialog.find(".interface_panel") ,model ,node);
			//this.initActionPanel(dialog , node.find(".action"));
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
		p.find("input[name='name']").val(m.name);
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
	initPropertyPanel : function(p,ps){
		if(ps.length > 0){
			this.initPropertyForm(p,$(ps[0]));
			this.initPropertyTable(p,ps);
		}
	},
	
	/**
	 * 初始化对话框中的属性表格 
	 */
	initPropertyTable : function(p,ps){
		var table = p.find("table"),
			tr 	= null,
			data = null;
			
		$.each(ps,function(i,t){
			data = $(t).data("property");
			tr = $("<tr><td>"+data.name+"</td>"+
					"<td>"+data.type+"</td>"+
					"<td>"+data.type+"</td></tr>");

			tr.data("node",$(t)); 
			
			table.append(tr);
		});
		
		var initForm = this.initPropertyForm;
		table.delegate("tr","click",function(){
			initForm(p,$(this).data("node"));
		});
	},
	
	initPropertyForm : function(p,pro){
		var node = pro,
			data = node.data("property");
			
		p.data("node",node);
		p.data("data",data);
		
		p.find("input[name='name']").val(data.name);
		p.find("input[name='scope']").select(data.scope);
		p.find("input[name='type']").val(data.type);
	},
	
	initActionPanel : function(dialog,as){
		
	}
};