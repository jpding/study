// 勾选框的onclick事件处理函数
window._onclick_checkbox = function() {
	var calcParams = getCurrentCalcParams();
	_refreshCharts.delayOnce(window, 0.1, $rpt, calcParams);
}

// 刷新统计图
function _refreshCharts(rpt, calcParams) {
	rpt.refreshcomponents({
				"$sys_target" : calcParams.targetCompName,
				"$sys_targetComponent" : calcParams.targetComponent
			});
}

$rpt.getCurrentCalcParams=function() {
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
			var param = $rpt.getCurrentCalcParams();
			var dl = _getDls($rpt, param);
			if (dl){
				data[param.checkboxName] = dl;
			}
		});

// 获取报表中所有被勾选的大类，返回值形如“01;02”
function _getDls(rpt, param) {
	var tableName = rpt.component(param.curTableName);
	if (!tableName)
		return null;
	var checkboxes = tableName.basedom().find(":checkbox:checked");
	var len = checkboxes.length;
	if (len == 0)
		return null;

	var arr = [];
	for (var i = 0, len = checkboxes.length; i < len; i++) {
		var checkbox = checkboxes[i];
		var td = $(checkbox).closest(".sz-bi-prst-cell-child-component");
		var vv = td.next().text();
		arr.push(vv);
	}
	return sz.utils.formatMultiValue(arr);
}

$rpt.ondisplayEx = function(){
	var inputs = $("input[type=checkbox]:visible");
	if (inputs.length && inputs.eq(0).click) {
		inputs.eq(0).attr("checked", 'true');
		$$(inputs.eq(0)).fire('change')
	}
}


$rpt.ondisplayParamPanel = function() {
	$('#ltable6').hide()
}

$("#ltable5").find("img").parent()
		.append("<li style='width:28px;height:28px;'><>")
$("#ltable5").find("img").remove();

$("#image1").addClass("img1");
$("#image2").addClass("img2");
$("#image3").addClass("img3");

$rpt.toggleClass = function(idx) {
	$("#image1").addClass("img1");
	$("#image2").addClass("img2");
	$("#image3").addClass("img3");

	$("#image1").removeClass("img1selected");
	$("#image2").removeClass("img2selected");
	$("#image3").removeClass("img3selected");

	$("#image" + idx).removeClass("img" + idx);
	$("#image" + idx).addClass("img" + idx + "selected");
}

$rpt.setParamValue = function() {
	var zq = $rpt.comp("@BBZQ").val();
	if (zq == '10') {
		var q = $rpt.comp("@qsn").val();
		var z = $rpt.comp("@jzn").val();

		$rpt.comp("text2").val(q + "-" + z);
	} else if (zq == '20') {
		var q = $rpt.comp("@qsy").val();
		var z = $rpt.comp("@jzy").val();

		$rpt.comp("text2").val(q + "-" + z);
	} else if (zq == '30') {
		var q = $rpt.comp("@qsr").val();
		var z = $rpt.comp("@jzr").val();

		$rpt.comp("text2").val(q + "-" + z);
	} else if (zq == '40') {
		var q = $rpt.comp("@qsrq").val();
		var z = $rpt.comp("@jzrq").val();
		var q1 = $rpt.comp("@qsxs").text();
		var z1 = $rpt.comp("@jzxs").text();

		$rpt.comp("text2").val(q + " " + q1 + ":00" + " " + "-" + " " + z + " "
				+ z1 + ":00");
	}
}