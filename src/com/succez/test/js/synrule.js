/**
 *  1.当“计划制定”审批完成以后，那么把数据同步到“调整”
 *  2.当修订、废止一条记录后，审批通过后，自动向调整表里面，删除相应的记录，调整里面也增加计划
 *  3.增补的计划，同计划制定，但不用同步到调整
 *  
 *  关联制度状态：修订、删除、废止、为空(未完成)
 *  
 *  制定  BM_BMJHZD_F0
 *  调整  BM_BMJHTZ_F0   
 *  增补  BM_BMJHZB_F1
 *  
 *  10:计划审批中
 *  20:计划审批完成
 *  30:执行审批中
 *  40:执行审批完成
 *  50:逻辑删除
 *  60:已颁布
 *  70:调整计划审批中
 *  80:调整计划审批完成
 */
 
/**
 * 流程节点，线条等完成的事件回调函数
 */
function onActivityCompleted(flow, event, vars){
	var nodeId = event.getActivityId();
	var org = vars.get("ORG");
	var year = vars.get("YEAR");
	if("startevent1".equals(nodeId)){
		synJHStart(org, year);
		return "开始节点"	
	}else if("endevent1".equals(nodeId)){
		synJH2TZ(org,year);
		return "结束节点";
	}
	return "非结束节点";
}

function synJHStart(org, year){
	var ds = sz.db.getDefaultDataSource();
	var sql = "update BM_BMJHZD_F0 set status='10' where org=? and year=?";
	ds.update(sql, [org, year]);
}

/**
 * 当计划制定审批完成后，数据同步到调整表中，便于用户在里面进行修订
 */
function synJH2TZ(org, year){
	var ds = sz.db.getDefaultDataSource();
	/**
	 * 指定计划表
	 */
	var insql = "Insert Into BM_BMJHTZ_F0(Year, ORG, GLID, status) (Select Year, ORG, GLID, status From BM_BMJHZD_F0 Where ORG = ? And Year =? And GLID Not In (Select GLID From BM_BMJHTZ_F0))";
	ds.update(insql, [org, year]);
	
	var upsql = "update BM_BMJHZD_F0 set status='20' where org=? and year=?";
	ds.update(upsql, [org, year]);
}

/*
 * 调整
 * ===========================================================================================================
 */
function onActivityCompleted(flow, event, vars){
	var nodeId = event.getActivityId();
	
	var org = vars.get("ORG");
	var year = vars.get("YEAR");
	if("startevent1".equals(nodeId)){
		synTZStart(org, year);
		return "开始节点"	
	}else if("endevent1".equals(nodeId)){
		synTZ2JH(org, year);
		return "结束节点";
	}
	return "非结束节点";
}

/**
 * 修改“计划制定”中的状态
 * @param {} org
 * @param {} year
 */
function synTZStart(org, year){
	var ds = sz.db.getDefaultDataSource();
	var uJhSQL = "update BM_BMJHZD_F0 set status='70' where org=? and year=? and glid in (select glid from BM_BMJHTZ_F0 where org=? and year=?) ";
	var uTzSQL = "update BM_BMJHTZ_F0 set status='70' where org=? and year=?";
	ds.update(uJhSQL, [org,year,org,year]);
	ds.update(uTzSQL, [org,year]);
}

/**
 * 调整经过审批，要把相关状态同步到计划表里面，调整可能出现如下操作：
 * 1.删除，
 * 2.增加？？？增加不是计划外的叫增补吗？
 */
function synTZ2JH(org, year){
	var ds = sz.db.getDefaultDataSource();
	var uJhSQL = "update BM_BMJHZD_F0 set status='80' where org=? and year=? and glid in (select glid from BM_BMJHTZ_F0 where org=? and year=?) ";
	var uJhDEL = "update BM_BMJHZD_F0 set status='50' where (status='20') and org=? and year=? and glid not in (select glid from BM_BMJHTZ_F0 where org=? and year=?) ";
	var uTzSQL = "update BM_BMJHTZ_F0 set status='80' where org=? and year=?";
	ds.update(uJhSQL, [org,year,org,year]);
	ds.update(uJhDEL, [org,year,org,year]);
	ds.update(uTzSQL, [org,year]);
}

/**
 * 增补 
 */



/*
 * 修订
 * ============================================================================================================
 */

/**
 * 流程节点，线条等完成的事件回调函数
 */
function onActivityCompleted(flow, event, vars){
	var nodeId = event.getActivityId();
	
	var glid = vars.get("UID");
	if("startevent1".equals(nodeId)){
		synXDStart(glid);
		return "开始节点"	
	}else if("endevent1".equals(nodeId)){
		synXD(glid);
		return "结束节点";
	}
	return "非结束节点";
}

function synXDStart(glid){
	synUpdateXD(glid, '30');
}

/**
 * 修订一条后：
 * 1.从调整表中删除一条记录
 * 2.并且在计划里面设置该字段的修订状态
 * 3.如果调整表已经通过审批状态了，那么就不得从里面删除了。
 * 
 * 删除一条记录：
 * 1.计划里面的删除，设置为逻辑删除标记
 * 2.其他删除标记为直接删除
 * 
 * 并且修改计划里面的状态。
 * 废止？？？？
 * 
 */
function synXD(glid){
	var ds = sz.db.getDefaultDataSource();
	var delTz = "delete from BM_BMJHTZ_F0 where glid=? and Exists (Select glid From BM_BMJHZD_F0 Where glid=?)";
	ds.update(delTz, [glid,glid]);
	synUpdateXD(glid, '40');
}

function synUpdateXD(glid, status){
	var ds = sz.db.getDefaultDataSource();
	var updateZd = "update BM_BMJHZD_F0 set status=? where glid=?";
	var updateTz = "update BM_BMJHTZ_F0 set status=? where glid=?";
	var updateZb = "update BM_BMJHZB_F1 set status=? where glid=?";
	ds.update(updateZd, [status, glid]);
	ds.update(updateTz, [status, glid]);
	ds.update(updateZb, [status, glid]);
}