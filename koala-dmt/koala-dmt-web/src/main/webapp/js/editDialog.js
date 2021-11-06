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

/*为了实现编辑结果在展示和数据同步上尽量自动化*/
editDialog = {
	initDialog : function(node ,UMLCANVAS){
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
		var p = dialog.find(".entity_panel");
		p.data("node",node);
		p.find("input[name='name']").val(data.name);
		p.find(".entityType").select(data.entityType);
		p.find(".entityScope").select(data.entityScope);
		p.find(".desc").val(data.description);
	},
	
	/*
	 * 初始化接口面板
	 */
	initInterfacePanel : function(dialog,m,n){
		var p = dialog.find(".interface_panel");
		p.data("node",n);
		p.find("input[name='name']").val(m.name);
		p.find("select[name='scope']").select(m.scope);
		p.find("input[name='description']").val(m.description);
	},
	
	/*初始化属性编辑窗口*/
	initPropertyPanel : function(dialog,node){
		var properties = node.find(".property");
		var p = dialog.find();
		if(properties.length > 0){
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