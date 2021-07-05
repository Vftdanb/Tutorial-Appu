$(function() {
	$(window).on('resize', function(){
		var height = $(window).height();
		$('#widgetContainer').height(height);
		$('#gHead').height(0.06*height);
		$('#gMain').height(0.89*height);
		$('#gFooter').height(0.05*height);
		$('#projectExplorer .panel-body').height(0.36*height);
		$('#propertiesExplorer .panel-body').height(0.21*height);
		$('#gwtTabLayoutPanel .panel-body').height(0.72*height)
	});
	$(window).trigger('resize');
});