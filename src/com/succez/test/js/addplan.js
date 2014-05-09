if (!window.formDlg) {
	window.formDlg = sz.commons.Dialog.create();
}

var data = {
	"cont_uid" : selectableTable.getSelectedRowCellHint(0)
};

window.formDlg.showHtml({
			url : sz.sys.ctx("/wiapi/form/showStartForm"),
			data : {
				resid : "LAWCONT:/workflows/法律业务系统/CONT_PERFORM",
				alias : "STARTFORM",
				openmode : "dialog",
				ownerid : "6717469$STARTFORM",
				width : 915,
				height : 550,
				formdatas : JSON.stringify(data)
			},
			load : function() {
				$$(sz.commons.DialogMgr.getTopDlg().getHtmlContent()
						.find(".sz-wi-component"));
			},
			cancel : function() {
			}
		});

function showWIFormDialog(residOrPath, formdata, width, height) {
	if (!window.formDlg) {
		window.formDlg = sz.commons.Dialog.create();
	}

	window.formDlg.showHtml({
				url : sz.sys.ctx("/wiapi/form/showStartForm"),
				data : {
					resid : residOrPath,
					alias : "STARTFORM",
					openmode : "dialog",
					ownerid : residOrPath + "$STARTFORM",
					"width" : width,
					"height" : height,
					formdatas : JSON.stringify(formdata)
				},
				load : function() {
					$$(sz.commons.DialogMgr.getTopDlg().getHtmlContent()
							.find(".sz-wi-component"));
				},
				cancel : function() {
				}
			});
}


window.formDlg.showHtml({
	url : sz.sys.ctx("/wiapi/form/showForm"),
	data : {
		resid : "6717469",
		form:'STARTFORM',
		openmode : "dialog",
		businessKey:'${L2}',
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




var formdata = {
	"cont_uid" : '${@uid}'
};
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/CONT_PERFORM",
		formdata, 915, 500)

var exData = {businessKey:planDetailTable.getSelectedRowCellHint(0),url:"/wiapi/form/showForm",form:"STARTFORM"};		
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/CONT_PERFORM",
		null, 915, 500, exData);		
		
showWIFormDialog("LAWCONT:/workflows/法律业务系统/CONT_PERFORM", null, 915, 500)

$rpt.drill({
			"$sys_customparameters":"@uid="+selectableTable.getSelectedRowCellHint(0),
			"$sys_drillto" : "LAWCONT:/analyses/maintain/二级表单/PLAN_LIST",
			"$sys_passparameters" : "true",
			"$sys_target" : "self"
		});

var drill = $(".sz-bi-prst-drillpath").children("li").eq(-2).find("a").attr("href");
var leftBr = drill.indexOf("(");
var rightBr = drill.indexOf(")");
eval(drill.substring(leftBr,rightBr+1))
		
		
var drill = $(".sz-bi-prst-drillpath").children("li").eq(-2).find("a").attr("href");
var leftBr = drill.indexOf("(");
var rightBr = drill.indexOf(")");
var obj = eval(drill.substring(leftBr,rightBr+1));
szshowresult(obj);

(function($rpt){$rpt.refreshcomponents({"$sys_customparameters":"$sys_disableCache=true","$sys_drillcell":"btn4","$sys_target":"lt_0.A3","$sys_targetComponent":"rpt1"});})(_sze_rpt(event));
