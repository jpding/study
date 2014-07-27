/**
 * 添加管理合同
 */
var surl = sz.sys.ctx("/meta/LAWCONT/others/law.js");
$.getScript(surl, function(){
	var formdata = {"rure_uid":"",hiddenbutton:['submitstartform']};
	var currentForm = $form;
	sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/规章制度/LC_RURE",formdata,780,480,null, function(){
		var topDlg = sz.commons.DialogMgr.getTopDlg();
		var fillforms = topDlg.lastForm;

		var form = fillforms.getForm("JHZDGLZD"); 
		var zdId = form.getComponent("uid").val();
		
		var floatArea = currentForm.getFloatArea("table2.b2");
		var row = floatArea.lastRow();
		if(!row.isBlank()){
			row = floatArea.newRow();
		}
		var comp = row.getComponent("table2.b2");
		comp.val(zdId);
	});
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


/**
 * 添加纠纷 
 */
var surl = sz.sys.ctx("/meta/LAWCONT/others/law.js");
$.getScript(surl, function(){
	var dlgParams = {title:"纠纷信息",width:700,height:450};
	var url = "/meta/LAWCONT:/collections/案件管理/LC_CASE_INFO/reports/关联纠纷";
	sz.custom.wi.showReportDlg(url, dlgParams, {ok:function(){
		var uid = reldisp.getSelectedRowCellHint(0);
		var floatArea = $form.getFloatArea("table3.b2");
		var row = floatArea.lastRow();
		if(!row.isBlank()){
			row = floatArea.newRow();
		}
		var comp = row.getComponent("table3.b2");
		comp.val(uid);
	}});
});