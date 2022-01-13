(function(){
	/*获取长度为i的uuid*/
	function uuid(i){
		var uuid = "",len = i ? i : 32;
		for(var i = 0; i <= len; i++){
			uuid += Math.floor(Math.random() * 16.0).toString(16);
		}
		return uuid;
	}
	
	$.fn.tab = function(setting){
		setting = $.extend({
			onClose : function(){return true;}
		},setting);
		
		var TAB = $($(this)[0]).addClass("mint_tab"),
			tabs = TAB.children(".tabs"),
			panels = TAB.children(".panels");
		
		/*没有tabs时自动添加*/
		if(tabs.length == 0){
			tabs = $('<div class=".tabs"></div>');
			TAB.append(tabs);
		}
		if(panels.length == 0){
			panels = $('<div class=".panels"></div>');
			TAB.append(panels);
		}
		
		function active(tab){
			if(tab){
				tabs.children(".active").removeClass("active");
				panels.children(".active").removeClass("active");
				tab.addClass("active");
				panels.children("."+tab.attr("for")).addClass("active");
			}
		}
		
		tabs.delegate(".tab","click",function(e){
			var tab = $(this),
				panel = panels.children("."+tab.attr("for"));
				
			
			if($(e.target).is(".close_btn")){
				if(!setting.onClose(tab)){
					return;
				}
				var flag = false;
				if(tab.is(".active")){
					flag = true;
				}
				tab.remove();
				panel.remove();
				flag ? active(tabs.children(":first")) : "";
			} else {
				if(!tab.is(".active")){
					active(tab);
				}
			}
		});
		
		tabs.mousedown(function(){
			return false;
		});
		
		return {
			tabs 	: tabs,
			panels	: panels,
			
			/**
			 * 添加一个tab和对应的panel,
			 * 添加完成后执行afterAdd回调函数,
			 * 你可以为新加的tab指定一个class，方便以后查找
			 * 返回值是一个随机的字符串，这个字符串是新加tab的class，你可以通过这个class找到对应的tab
			 * opts = {title, content, afterAdd, closeable, identification}
			 * title	: 标题
			 * content	: 要在panel里显示的内容
			 * afterAdd		: 添加完成后要执行的回调函数，有两个内置参数tab、panel
			 * onTabClick : tab被点击时的回调函数
			 * onClose	: tab被点击的时候的回调函数
			 * force	: boolean.如果设为true，可以添加标题相同的tab
			 * selec	: 暂时忽略
			 * data		: 需要缓存在tab上的数据，以后可以通过tab.data("data")取出
			 */
			addTab : function(opts){
				if(!this.isExistTitle(opts.title) || opts.force){
					var cls = "panel_"+uuid(16),
						tab = $("<div class='tab " + cls + "' for='" + cls +"'><span class='title'>" + opts.title + "</span></div>"),
						panel = $("<div class='panel " + cls + "'></div>").html(opts.content);
					
					if(typeof(opts.closeable)==undefined || opts.closeable){
						tab.append($("<div class='close_btn' title='关闭'></div>")).addClass("closeable");
					}
					
					tabs.append(tab);
					panels.append(panel);
					
					opts.afterAdd ? opts.afterAdd(tab,panel) : '';
					opts.identification ? tab.addClass("tab_" + opts.identification) : "";
					
					this.active("."+cls);
					return cls;
				};
			},
			
			/**
			 * 判断某个标题是否已经存在
			 */
			isExistTitle : function(title){
				var exist = false;
				
				this.tabs.find(".title").each(function(i,t){
					if($(t).html() === title){
						exist = true;
						return false;	
					}
				});
				
				return exist;
			},
			
			/*根据class查找*/
			isExistTab : function(id){
				
			},
			
			/**
			 * 激活指定索引的tab
			 */
			active : function(sel){
				var tab = tabs.children(sel);
				
				tabs.children(".active").removeClass("active");
				panels.children(".active").removeClass("active");
				tab.addClass("active");
				panels.children("."+tab.attr("for")).addClass("active");
			},
			/*关闭*/
			close : function(index){
				var tab = tabs.children(".tab").get(index);
				/*TODO*/
			}
		};
	};
})();