;(function($){
	$.fn.miniedit = function(opts){
		var dfs = {
			/**
			 * 两个内置参数
			 * 第一个：被编辑的目标元素
			 * 第二个：编辑框
			 * 当不返回true时，需要自己处理编辑结果
			 */
			dataList	: "",
			limit		: null,
			type		: "input",
			afterEdit	: function(){return true;},
			css	: {}
		};
		
		opts = $.extend(true,dfs,opts);
		
		var input = $("<"+opts.type+" />");
		var tar = $(this);//被编辑的目标元素
		var css = $.extend(true,{
					"height"	: tar.height(),
					"width"		: tar.width(),
					"position"	: "absolute",
					"left"		: tar.position().left+parseInt(tar.css("padding-left")),
					"top"		: tar.position().top+parseInt(tar.css("padding-right"))
				},opts.css);
				
		if(tar[0].miniinput){
			tar[0].miniinput.focus();
		}else{
			input.val((opts.value == undefined ? tar.html():opts.value)).attr("placeholder",opts.placeholder).attr("list",opts.dataList);
			input
				.addClass("mini_inlineinput")
				.css(css)
				.blur(function(){
					if(opts.afterEdit(tar,input)){
						tar.html(input.val());
						input.finish();
					}
				})
				.finish = function(){
					$(this).remove();
					tar[0].miniinput = null;
					tar.css("visibility","visible");
				};
			
			if(opts.limit){
				input.on("input propertychange",function(){
					input.val(input.val().substring(0,opts.limit));
				});
			}
			
			tar.before(input).css("visibility","hidden")[0].miniinput = input;
			input.focus();
		}
	};
})($);