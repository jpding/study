function oninitfillforms(fillforms) {
	fillforms.on("aftereditcell", function(event) {
		sz.custom.limitcheck.check(fillforms);
	});
}

/**
 * 初始化的函数必须写在custom.js中，不能写在外部的js中
 * @param {} $cidatapanel
 */
function oninitdatapanel($cidatapanel) {
	$.getScript(sz.sys.ctx("/meta/SCWSZBCI/analyses/limitcheck/limitcheck.js"),function(){
		sz.custom.limitcheck.initLimitObject();
	});
}