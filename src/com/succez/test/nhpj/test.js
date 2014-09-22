// 勾选框的onclick事件处理函数
window._onclick_checkbox = function(event) {
	var rpt = event.target.closest("sz.bi.prst.Report");
	_setCalcParamsForRefresh();
	_refreshCharts.delayOnce(window, 0.1, $rpt);
}

function _setCalcParamsForRefresh() {
	var zq = $rptcomp("@BBZQ").val();
	if (zq == 10) {
		window._checkboxName = "@mc";
		window._curTableName = "table1";
		window._targetCompName = "ltable1.A2";
		window._targetComponent = "chart1";

	}

	if (zq == 20) {
		window._checkboxName = "@mc2";
		window._curTableName = "table5";
		window._targetCompName = "ltable2.A2";
		window._targetComponent = "chart2";

	}
	if (zq == 30) {
		window._checkboxName = "@mc3";
		window._curTableName = "table8";
		window._targetCompName = "ltable3.A2";
		window._targetComponent = "chart3";

	}
	if (zq == 40) {
		window._checkboxName = "@mc4";
		window._curTableName = "table11";
		window._targetCompName = "ltable4.A2";
		window._targetComponent = "chart4";

	}

}

// 在提交计算请求之前在计算参数中加入"@mc=xxx"的参数
$rpt.on("beforesubmit", function(event) {
			var data = event.taskparams.data;
			var dl = _getDls($rpt);
			if (dl)
				data[window._checkboxName] = dl;
		});

// 获取报表中所有被勾选的大类，返回值形如“01;02”
function _getDls(rpt) {
	var tableName = rpt.component(window._curTableName);
	if (!tableName)
		return null;
	var checkboxes = tableName.basedom().find(":checkbox:checked");
	var len = checkboxes.length;
	if (len == 0)
		return null;

	var arr = [];
	for (var i = 0, len = checkboxes.length; i < len; i++) {
		arr.push(_getDl(checkboxes[i]));
	}
	return sz.utils.formatMultiValue(arr);
}

// 获取勾选框对应的大类代码
function _getDl(checkbox) {
	var td = $(checkbox).closest(".sz-bi-prst-cell-child-component");
	return td.next().text();
}

// 刷新统计图
function _refreshCharts(rpt) {
	rpt.refreshcomponents({
				"$sys_target" : window._targetCompName,
				"$sys_targetComponent" : window._targetComponent
			});
}

$rpt.ondisplay = function() {
	var inputs = $("input[type=checkbox]:visible");
	if (inputs.length && inputs.eq(0).click) {
		inputs.eq(0).attr("checked", 'true');
		$$(inputs.eq(0)).fire('change')
	}
}