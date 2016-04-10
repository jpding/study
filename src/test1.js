
/**
 * 上报后执行该脚本
 * @param {} args
 */
function aftersubmitdata(args){
	/**
	 * 采集任务对象 CIAPIObj_Task
	 * @type 
	 */
	var task = args.task;
	
	/**
	 * 数据期，是一个字符串
	 * @type 
	 */
	var dataperiod = args.dataperiod;
	
	/*
	 * 当前上报单位
	 */
	var datahierarchies = args.datahierarchies;
	println("aftersubmitdata:taskid:"+task.taskid+";datahierarchies:"+datahierarchies);
	
	
	/*
	 * 获取当前上报采集的值，直接使用sql获取，xxx为连接池名，sz.db.getDefaultDataSource()获取默认的数据库连接池
	 * DataSource 帮助 http://wiki.succez.com/pages/viewpage.action?pageId=92635993
	 */
	var ds = sz.db.getDataSource("xxx");
	/*
	 *xx_table bbq  datahierarchies 为实际对应的字段
	 */
	var sql = "select * from xx_table where bbq=? and datahierarchies=?";
	
	/*
	 * 为二维数组
	 */
	var rs = ds.select(sql, dataperiod, datahierarchies);
	for(var i=0; i<rs.length; i++){
		var row = rs[i];
		/*
		 * row[x] 取到每一列的值
		 */
	}
	
	/*
	 * 通过SQL更新字段的值
	 */
	var updateSQL = "update xxx set f1 = ? where w=?";
	var ds2 = sz.db.getDataSource("xxx");
	ds2.update(updateSQL, f1, w);
}