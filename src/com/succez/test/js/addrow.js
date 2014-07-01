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



function addRelZD(){
	$.loadJsCss(['/meta/LAWCONT/others/law.js']);
	var formdata = {"rure_uid":""};
	var currentForm = $form;
	sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/规章制度/关联制度/JHTZGLZD",formdata,915,500,null, function(){
		var topDlg = sz.commons.DialogMgr.getTopDlg();
		var fillforms = topDlg.lastForm;
		var form = fillforms.ciforms['JHTZGLZD']; 
		var zdId = form.getComponent("uid").val();
		var zdMc = form.getComponent("jhzdmc").val();
		var jsjh = form.getComponent("jsjh").val();
		var jhSj = form.getComponent("jhsssj").val();
		
		var floatArea = currentForm.getFloatArea("table2.a2");
		var row = floatArea.lastRow();
		if(!row.isBlank()){
			row = floatArea.newRow();
		}
		row.getComponent("table2.b2").val(zdId);
		row.getComponent("table2.c2").val(zdMc);
		row.getComponent("table2.d2").val(jsjh);
		row.getComponent("table2.e2").val(jhSj);
	});
}

addRelZD();

///////////////////////////////////修改///////////////////////////////////////////////////////
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

$.loadJsCss(['/meta/LAWCONT/others/law.js']);
var jsonUid = $component.getRow().getComponent("table2.b2").val();
var jsonParams = {"uid": jsonUid, "table":"JHZBGLZD_JHZBGLZD"};

sz.custom.wi.showWiForm("LAWCONT:/workflows/法律业务系统/规章制度/关联制度/JHTZGLZD", jsonParams,850, 650);