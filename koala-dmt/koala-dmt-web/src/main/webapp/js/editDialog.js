/*
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

editDialog = {
	/*
	 * 初始化类编辑窗口。
	 * 同时会初始化该类的属性和行为编辑窗口
	 */
	initClassDialog : function(node){
		var m = node.data("m");
		var d = $(".entity_dialog");
		
		d.find(".entityName").val(m.name);
		d.find(".entityType").select(m.entityType);
		d.find(".entityScope").select(m.entityScope);
		d.find(".desc").val(m.description);
		
		this.initPropertyDialog(m.properties);
	},
	
	/*初始化属性编辑窗口*/
	initPropertyDialog : function(ps){
		var d = $(".property_dialog"),
			table = $("<table/>");
			
		d.append(table);
		$.each(ps,function(i,p){
			table.append("<tr> \
				<td>你好</td> \
				<td>我好</td> \
				<td>大家好</td> \
			</tr>");
		});
	},
	
	initActionDialog : function(as){
		
	}
}

initClassDialog(m);