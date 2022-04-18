(function($){
	$.fn.dialog = function(setting){
		var defaultSetting = {
			title:"",
			content:"",
			closeOnMaskClick:true,
			beforeClose : function(){return true;},
			onShow : $.noop
		};
		setting =  $.extend(defaultSetting, setting);
		var mask = $(
				'<div class="dialog_mask close">\
					<div class="mint_dialog">\
						<div class="head">\
							<div class="title"></div>\
							<span class="close_btn" title="关闭"></span>\
						</div>\
						<div class="body"></div>\
					</div>\
				</div>');
					
		var dialog = mask.children(":first"),
			title = dialog.find(".head .title"),
			body = dialog.children(".body");
			
		if(setting.title){title.html(setting.title);}
		if(setting.content){body.html(setting.content);}
		mask.appendTo("body");
		
		var out = {
			/*设置窗口标题*/
			setTitle : function(t){
				title.html(t);
				return this;
			},
			/*设置窗口内容*/
			setBody : function(b){
				body.html(b);
				return this;
			},
			/*显示窗口*/
			show : function(){
				mask.fadeIn(setting.onShow());
				return this;
			},
			/*隐藏窗口*/
			close : function(){
				if(setting.beforeClose()){
					mask.fadeOut();
				}
				return this;
			},
			/*销毁窗口*/
			distroy : function(){
				dialog.romve();
			}
		};
		
		dialog.find(".close_btn").click(function(){
			out.close();
		});
		
		if(setting.closeOnMaskClick){
			mask.mousedown(function(e){
				if(e.target == this){
					out.close();
				}
			});
		}
		
		return out;
	};
})($);