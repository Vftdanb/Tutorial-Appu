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

/*$("#dialog_container").delegate("input,select,textarea","change",function(e){
	var panel 	= $(this).parents(".panel"),
		data 	= panel.data("data"),
		node	= panel.data("node"),
		data 	= panel.data("data"),
		attr 	= $(this).attr("name"),
		claz	= $(this).attr("class");
	
	node.find("."+claz).html($(this).val());
	data[attr] = $(this).val();
	
	console.log(JSON.stringify(data));
});*/


/*为了实现编辑结果在展示和数据同步上尽量自动化*/
editDialog = {
	initDialog : function(node ,C){
		var dialog = null;
		if(node.is(".node")){
			dialog = this.initEntityDialog(node);
		} else if(node.is(".line")) {
			
		}
		
		dialog
			.data("data",node.data("data"))	//被编辑的模型对象
			.data("node",node)					//被编辑的节点对象
			.data("canvas",C);					//画布对象
		
		node.data("dialog",dialog);	
		
		dialog.tab();
	},
	
	initEntityDialog : function(node){
		var dialog 	= null,
			data	= node.data("data");
			
		if(node.is(".entity")){
			dialog 	= this.activeDialog("entity_dialog");
			this.initClassPanel(dialog.find(".entity_panel") ,data ,node);
			this.initPropertyPanel(dialog.find(".property_panel") , node.find(".property"));
		} else if(node.is(".interface")){
			dialog = this.activeDialog("interface_dialog");
			this.initInterfacePanel(dialog.find(".interface_panel") ,data ,node);
		} else if(node.is(".enum")){
			dialog = this.activeDialog("enum_dialog");
			this.initInterfacePanel(dialog.find(".enum_panel") ,data ,node);
		}
		return dialog;
	},
	
	/**
	 * 初始化类编辑窗口。
	 * 同时会初始化该类的属性和行为编辑窗口
	 */
	initClassPanel : function(p,m,n){
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
		} else {
			
		}
	},
	
	/**
	 * 初始化对话框中的属性表格 
	 */
	initPropertyTable : function(p,ps){
		var t = p.find(".properties_table"),
			tr 	= null,
			data = null;
		
		t.html("");
		var table = $('<table class="properties" border="1" cellspacing="1" cellpadding="0" width="100%" style="font-size:14px"> \
							<tr class="property"><th>属性名</th><th>属性类型</th><th>初始值</th></tr> \
						</table>');
		t.append(table);
		$.each(ps,function(i,t){
			data = $(t).data("data");
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
			data = node.data("data");
			
		p.data("node",node);
		p.find("input[name='name']").val(data.name);
		p.find("select[name='scope']").select(data.scope);
		p.find("input[name='type']").val(data.type);
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