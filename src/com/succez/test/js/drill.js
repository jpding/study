/**
 * 编辑计划
 */
var uid = selectableTable.getSelectedRowCellHint(0);
$rpt.drill({
		"$sys_customparameters" : "sys_disableCache=true;@uid=" + uid,
		"$sys_drillto" : "LAWCONT:/analyses/maintain/二级表单/PLAN_LIST",
		"$sys_passparameters" : "true",
		"$sys_target" : "self"
	});
	
	
/**
 * 履行记录
 */	
var uid = selectableTable.getSelectedRowCellHint(0);
$rpt.drill({
		"$sys_customparameters" : "sys_disableCache=true;@uid=" + uid,
		"$sys_drillto" : "LAWCONT:/analyses/maintain/二级表单/PERFORM_LIST",
		"$sys_passparameters" : "true",
		"$sys_target" : "self"
	});
	
/**
 * 变更记录
 */
var uid = selectableTable.getSelectedRowCellHint(0);
$rpt.drill({
		"$sys_customparameters" : "sys_disableCache=true;@uid=" + uid,
		"$sys_drillto" : "LAWCONT:/analyses/maintain/二级表单/CHANGE_LIST",
		"$sys_passparameters" : "true",
		"$sys_target" : "self"
	});	
	