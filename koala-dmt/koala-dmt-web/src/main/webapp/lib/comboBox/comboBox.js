(function(){
	var ComboBox = function(){}
	ComboBox.prototype = {
		/**
		 * 显示combobox
		 */
		show : function(combobox, target, opt){
			if(combobox.css("display") === "block") return;
			
			var offset = target.offset();
			if(!opt.width){
				combobox.css("width",target.outerWidth() - 2);
			} else {
				combobox.css("width",opt.width);
			}
			
			combobox
				.css({
					top 	: offset.top + target.outerHeight() + 1,
					left	: offset.left
				})
				.slideDown(150)
				.focus();
		},
		
		/**
		 * select事件处理
		 */
		select : function(combobox, target, opt, option){
			var val = opt.format(target, option);
			if(!(val === undefined)){
				if(target.is('input[type="text"],textarea')){
					target.val(val)
				} else {
					target.html(val);
				}
			}
		}
	}
	
	$.fn.comboBox = function(opt){
		var comboBox = new ComboBox();
		var target = $(this);
		
		function hide(currentTarget){
			var combobox = currentTarget.data("comboBox");
			setTimeout(function(){
				if(!combobox.is(":focus") && combobox.css("display") === "block"){
					combobox.slideUp(150);
				}
			},5);
		}
		
		function show(currentTarget){
			var combobox = currentTarget.data("comboBox");
			if(combobox == null){
				combobox = $('<div class="mint_combobox" tabindex=0 hidefocus="true"></div>');
				combobox.html(opt.optionList);
				opt.render ? opt.render(currentTarget, combobox) : "";
				/*注册选择事件*/
				combobox.delegate(opt.option, "click", function(e){
					var option = $(this);
					/*“重新选中”的效果*/
					combobox.find("."+opt.selected).removeClass(opt.selected);
					option.addClass(opt.selected);
					/*赋值*/
					comboBox.select(combobox, currentTarget, opt, option);
					combobox.blur();
				}).blur(function(e){
					hide(currentTarget)
				});
				
				currentTarget.data("comboBox", combobox);
				combobox.appendTo("body");
			} else {
				opt.refresh ? opt.refresh(currentTarget, combobox) : "";
			}
			
			comboBox.show(combobox, currentTarget, opt);
		}
		
		/*默认触发*/
		if(opt.target){
			target.delegate(opt.target, "click focus", function(){
				show($(this));
			});
			
			target.delegate(opt.target, "blur", function(){
				hide($(this));
			})
		} else {
			target.on("click focus",function(){
				show($(this));
			});
			target.blur(function(){
				hide($(this));
			});
		}
		
		return {
			update : function(content){
				opt.optionList = content;
			}
		}
	}
})($);