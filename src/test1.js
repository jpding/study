
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
	var select1 = ds.createTableUpdater("xx_table");
	
	/*
	 * 返回指定字段的值，row是一个一维数组，顺序是和["field1","filed2","field3"]一一对应的
	 * 
	 */
	var row = select1.get1(["field1","filed2","field3"], {bbq:dataperiod, datahierarchies:datahierarchies});
	
	/*
	 * 通过SQL更新字段的值
	 * http://wiki.succez.com/pages/viewpage.action?pageId=92635997
	 */
	var updater = ds.createTableUpdater("updater_table");
	updater.set("field1", "xxx", "bbq=201112");
	updater.commit();
}