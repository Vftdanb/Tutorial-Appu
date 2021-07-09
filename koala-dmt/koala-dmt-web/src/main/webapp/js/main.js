var contextPath = '/';
$(function() {
	$(window).on('resize', function(){
		var height = $(window).height();
		$('#widgetContainer').height(height);
		$('#gHead').height(0.06*height);
		$('#gMain').height(0.89*height);
		$('#gFooter').height(0.05*height);
		$('#projectExplorer .panel-body').height(0.36*height);
		$('#propertiesExplorer .panel-body').height(0.23*height);
		$('#gwtTabLayoutPanel .panel-body').height(0.74*height)
	});
	$(window).trigger('resize');
	openTab('xxxx', 'test', 'test');
});

$.ajaxSetup({
	error : function(XMLHttpRequest, textStatus) {
		if (XMLHttpRequest.status == 499) {
			window.location.href = contextPath + '/login/out';
		} else {
			if (XMLHttpRequest.status == 404 || XMLHttpRequest.status == 500) {
				$.get(contextPath + '/errors/' + XMLHttpRequest.status + '.html').done(function(html) {
					$('#tabContent .active').html(html);
				});
			} else {
				$.get(contextPath + '/errors/404.html').done(function(html) {
					$('#tabContent .active').html(html);
				});
			}
		}
	}
});

/*
 *打开一个Tab
 */
function openTab(url, title, mark){
    var mainc =   $('.g-mainc');
    var tabs = mainc.find('#navTabs');
    var contents =  mainc.find('#tabContent');
    var content = contents.find('#'+mark);
    if(content.length > 0){
	    $.get(contextPath + url).done(function(data){
	        content.html(data);
	    });
        tabs.find('a[href="#'+mark+'"]').tab('show');
        tabs.find('a[href="#'+mark+'"]').find('span').html(title);
        return;
    }
    content = $('<div id="'+mark+'" class="tab-pane"></div>');
    $.get(contextPath + url).done(function(data){
	    content.html(data);
	});
    contents.append(content);
    var tab =  $('<li>');
    tab.append($('<a href="#'+mark+'" data-toggle="tab"></a>')).find('a').html('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><span>'+title+'<span>');
    var closeBtn = tab.appendTo(tabs).on('click',function(){
        var $this = $(this);
        if($this.hasClass('active')){
            return;
        }
        $this.find('a:first').tab('show')
   		clearMenuEffect();
   		var $li = $('.g-sidec').find('li[data-mark="'+mark+'"]').addClass('active');
        if($li.parent().hasClass('collapse')){
        	var a = $li.parent().prev('a');
            a.hasClass('collapsed') &&　a.click();
        };
    }).find('a:first')
        .tab('show')
        .find('.close');
    closeBtn.css({position: 'absolute', right: (closeBtn.width()-10) + 'px', top: -1 + 'px'})
        .on('click',function(){
            var prev =  tab.prev('li').find('a:first');
            content.remove() && tab.remove();
            var herf = prev.tab('show').attr('href').replace("#", '');
            var $menuLi =  $('.g-sidec').find('li[data-mark="'+herf+'"]');
            if($menuLi.length){
                $menuLi.click();
            }else{
                clearMenuEffect();
            };
        });
};