=dim("CONTINFO",CONT_UID,"CONT_ID")

/**
 * 添加合同履行记录
 * @type 
 */
var planuid = performDetailTable.getSelectedRowCellHint(0);
var formdata = {"cont_uid":'${@uid}',"plan_uid":planuid};
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/CONT_CRIT",formdata,915,500);

/**
 * 编辑合同履行记录
 */
var exData = {businessKey:performDetailTable.getSelectedRowCellHint(1),url:"/wiapi/form/showForm",form:"STARTFORM"};		
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/CONT_CRIT",null, 915, 500, exData);	


/**
 * 删除合同履行记录 
 */
		

/**
 * 合同变更
 */		
var planuid = changeDetailTable.getSelectedRowCellHint(0);
var formdata = {"cont_uid":'${@uid}'};
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/CHANGE",formdata,915,500); 
		

/**
 * 变更编辑
 */		
var changeuid = changeDetailTable.getSelectedRowCellHint(0);
var exData = {businessKey:changeuid,url:"/wiapi/form/showForm",form:"STARTFORM"};	
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/CHANGE",null,915,500,exData);


/**
 * 合同评估ADD
 */
var formdata = {"cont_uid":'${@uid}'};
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/EVALUATE",formdata,915,500); 

/**
 * 合同评估编辑
 */		
var changeuid = evalDetailTable.getSelectedRowCellHint(0);
var exData = {businessKey:changeuid,url:"/wiapi/form/showForm",form:"STARTFORM"};	
sz.custom.wi.showWIFormDialog("LAWCONT:/workflows/法律业务系统/EVALUATE",null,915,500,exData);