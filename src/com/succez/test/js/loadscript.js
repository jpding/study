$.extend({
	loadJsCss : function(file) {
		var files = typeof file == "string" ? [file] : file;
		var ctx = sz.sys.ctx();
		for (var i = 0; i < files.length; i++) {
			var name = files[i];
			var att = name.split('.');
			var ext = att[att.length - 1].toLowerCase();
			var isCSS = ext == "css";
			var tag = isCSS ? "link" : "script";
			var attr = isCSS
					? " type='text/css' rel='stylesheet' "
					: " language='javascript' type='text/javascript' ";
			var link = (isCSS ? "href" : "src") + "='" + sz.sys.ctx(name) + "'";
			if ($(tag + "[" + link + "]").length == 0){
				$("<" + tag + attr + link + "></" + tag + ">").appendTo("head");
			}
		}
	}
});


var surl = sz.sys.ctx("/meta/LAWCONT/others/law.js");
$.getScript(surl, function(){
	var dlgParams = {title:"合同信息",width:700,height:450};
	var url = "/meta/LAWCONT:/collections/案件管理/LC_CASE_INFO/reports/关联合同";
	sz.custom.wi.showReportDlg(url, dlgParams, {ok:function(){
		var uid = relcontract.getSelectedRowCellHint(0);
		$form.getComponent("table2.b2").val(uid);
	}});
});