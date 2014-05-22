//=dim("CONTINFO",CONT_UID,"CONT_ID")



$rpt.ondisplay = function() {
	var selectTable = $rpt.getCurrentBodyDom().find("#rpt1");
	window.planDetailTable = sz.commons.SelectableTable.build(selectTable);
}

$rpt.on("calcsuccess", function(){
	window.planDetailTable = sz.custom.wi.initSelectedTable($rpt,"rpt1");
});

sz.custom.wi.drillback();

/**
 * 签订维护详情
 * @type 
 */
var exData = {businessKey:'${L2}',url:"/wiapi/form/showForm",form:"STARTFORM"};	
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/CONT_SIGN",null, 915, 500, exData);

//录入签订信息
var formdata = {"cont_uid":selectableTable.getSelectedRowCellHint(0)};
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/CONT_SIGN",formdata,915,500,null, function(){
	sz.custom.wi.refreshcomp($rpt,"table1");
	window.selectableTable = sz.custom.wi.initSelectedTable($rpt, "table1");
});



var formdata = {"cont_uid":'${@uid}'};
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/CONT_PERFORM",formdata,915,500,null, function(){
	sz.custom.wi.refreshcomp($rpt,"rpt1","lt_0.A3");
});

/**
 * 添加合同履行记录
 * @type 
 */
var planuid = performDetailTable.getSelectedRowCellHint(0);
var formdata = {"cont_uid":'${@uid}',"plan_uid":planuid};
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/CONT_CRIT",formdata,915,500,null, function(){
	sz.custom.wi.refreshcomp($rpt,"rpt1","lt_0.A3");
});

/**
 * 编辑合同履行记录
 */
var exData = {businessKey:performDetailTable.getSelectedRowCellHint(1),url:"/wiapi/form/showForm",form:"STARTFORM"};		
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/CONT_CRIT",null, 915, 500, exData, function(){
	sz.custom.wi.refreshcomp($rpt,"rpt1","lt_0.A3");
});	


/**
 * 删除合同履行记录
 */
var performId = performDetailTable.getSelectedRowCellHint(1);
sz.custom.wi.deleteWIFormData("LAWCONT:/workflows/法律业务系统/CONT_CRIT", "STARTFORM", performId, function(){
	sz.custom.wi.refreshcomp($rpt,"rpt1","lt_0.A3");
});

/**
 * 合同变更
 */		
var formdata = {"cont_uid":'${@uid}'};
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/CHANGE",formdata,915,500, null, function(){
	sz.custom.wi.refreshcomp($rpt,"rpt1","lt_0.A3");
}); 
		

/**
 * 变更编辑
 */		
var changeuid = changeDetailTable.getSelectedRowCellHint(0);
var exData = {businessKey:changeuid,url:"/wiapi/form/showForm",form:"STARTFORM"};	
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/CHANGE",null,915,500,exData, function(){
	sz.custom.wi.refreshcomp($rpt,"rpt1","lt_0.A3");
});


/**
 * 合同变更删除
 */
var performId = changeDetailTable.getSelectedRowCellHint(0);
sz.custom.wi.deleteWIFormData("LAWCONT:/workflows/法律业务系统/CHANGE", "STARTFORM", performId, function(){
	sz.custom.wi.refreshcomp($rpt,"rpt1","lt_0.A3");
});


/**
 * 合同解除
 */
var uid = selectableTable.getSelectedRowCellHint(0);
var formdata = {"cont_uid":uid};
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/RELIEV",formdata,915,500, null,function(){
	//sz.custom.wi.refreshcomp($rpt,"rpt1","lt_0.A3");
}); 



/**
 * 合同评估ADD
 */
var formdata = {"cont_uid":'${@uid}'};
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/EVALUATE",formdata,915,500, null,function(){
	sz.custom.wi.refreshcomp($rpt,"rpt1","lt_0.A3");
}); 

/**
 * 合同评估编辑
 */		
var changeuid = evalDetailTable.getSelectedRowCellHint(0);
var exData = {businessKey:changeuid,url:"/wiapi/form/showForm",form:"STARTFORM"};	
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/EVALUATE",null,915,500,exData, function(){
	sz.custom.wi.refreshcomp($rpt,"rpt1","lt_0.A3");
});

/**
 * 合同评估删除
 */
var changeuid = evalDetailTable.getSelectedRowCellHint(0);
sz.custom.wi.deleteWIFormData("LAWCONT:/workflows/法律业务系统/EVALUATE", "STARTFORM", changeuid, function(){
	sz.custom.wi.refreshcomp($rpt,"rpt1","lt_0.A3");
});




