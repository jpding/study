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
var planuid = planPerformDetailTable.getSelectedRowCellHint(0);
var formdata = {"cont_uid":'${@uid}',"plan_uid":planuid};
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/CONT_PERFORM",formdata,815,600,null, function(){
	sz.custom.wi.refreshcomp($rpt,"rpt1","lt_0.A3");
});


/**
 * 编辑合同履行记录
 */
var exData = {businessKey:'${H2}',url:"/wiapi/form/showForm",form:"STARTFORM"};		
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/CONT_CRIT",null, 815, 600, exData, function(){
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
 * 合同履行==================
 */
var formdata = {"cont_uid":'${@uid}'};
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/CHANGE",formdata,915,500, null, function(){
	sz.custom.wi.refreshcomp($rpt,"rpt1","lt_0.A3");
});


//=======================================

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


var exData = {businessKey:'${A2}',url:"/wiapi/form/showForm", org:"${p2}", form:"STARTFORM"};
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/CONT_INFO2",null,850,500,exData);



/**
 * 合同评估删除
 */
var changeuid = evalDetailTable.getSelectedRowCellHint(0);
sz.custom.wi.deleteWIFormData("LAWCONT:/workflows/法律业务系统/EVALUATE", "STARTFORM", changeuid, function(){
	sz.custom.wi.refreshcomp($rpt,"rpt1","lt_0.A3");
});



var pdom= $("#text1");
var url  = sz.sys.ctx("/wiapi/form/showForm");
var data = {resid:6717469,form:'MAINTAIN',businessKey:'8f85572bc1264e82905be14034890ac0'};
sz.custom.wi.showHtml(pdom,url,data);





/**
 * 嵌入表单到报表中
 */
$rpt.on("calcsuccess", function(){
	window.planDetailTable = sz.custom.wi.initSelectedTable($rpt,"table1");
    window.planDetailTable.on("select", function(row){
    	var uid = window.planDetailTable.getSelectedRowCellHint(0);
    	var data = {resid:6717469,form:'MAINTAIN',businessKey:uid};
    });           
});



var surl = sz.sys.ctx("/meta/LAWCONT/others/law.js");
$.getScript(surl, function(){
	var dlgParams = {title:"合同信息",width:700,height:450};
	var url = "/meta/LAWCONT:/collections/案件管理/LC_CASE_INFO/reports/关联合同";
	sz.custom.wi.showReportDlg(url, dlgParams, {ok:function(){
		alert("111");
	}});
});


var dim = fillforms.datamgr.dimmgr.getDimension("FJHZDGLZD");
if(dim){
	dim.clearCache();
}
