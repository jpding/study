if(!window.formDlg){
	window.formDlg = sz.commons.Dialog.create();
}

var data = {"cont_uid":selectableTable.getSelectedRowCellHint(0)};

window.formDlg.showHtml({
	url : sz.sys.ctx("/wiapi/form/showStartForm"),
	data : {
		resid : "6717469",
		alias : "STARTFORM",
		openmode : "dialog",
		ownerid : "6717469$STARTFORM",
		width:915,
		height:550,
		formdatas : JSON.stringify(data)
	},
	load : function() {
		$$(sz.commons.DialogMgr.getTopDlg().getHtmlContent()
				.find(".sz-wi-component"));
	},
	cancel : function() {
	}
});


JSON.stringify(data)


$flow.showForm({resid:6717469,form:'MAINTAIN',businessKey:'1074'})


if(!window.formDlg){
	window.formDlg = sz.commons.Dialog.create();
}

window.formDlg.showHtml({
	url : sz.sys.ctx("/wiapi/form/showForm"),
	data : {
		resid : "6717469",
		form:'STARTFORM',
		openmode : "dialog",
		businessKey:'1074',
		width:915,
		height:550
	},
	load : function() {
		$$(sz.commons.DialogMgr.getTopDlg().getHtmlContent()
				.find(".sz-wi-component"));
	},
	cancel : function() {
	}
});