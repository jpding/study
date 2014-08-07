(function($){
	var _level0Pro = function() {
		$('.sz-commons-faccordion-item.level0>.sz-commons-faccordion-item-minus').parent().addClass('level0_minus');
	};
	$(window).on('load', function() {_level0Pro()});
	
	var oldClickEvent = sz.commons.FAccordion.clickEvent;
	sz.commons.FAccordion.clickEvent = function(env) {
		oldClickEvent.call(this, env);
		_level0Pro();
	};
	
	var rptlayout = $('.sz-commons-fsplitpanel-h-b2-portal>.portal-layout-right-pltree');
	if (!rptlayout.length) return;

	var content = rptlayout.children('.portal-layout-content');
	if (!content.children().length) return;
	
	var rptlayoutHeader = rptlayout.children('.rptlayout-header');
	if (!rptlayoutHeader.length) {
		rptlayoutHeader = $('<div class="rptlayout-header"/>').insertBefore(content);
	}
	
	var currentTitle = $('.sz-commons-faccordion-item.currentTreeNode').text().trim();
	rptlayoutHeader.html('<div class="rptlayout-header-title">' + currentTitle + '</div>');
	
})(jQuery);