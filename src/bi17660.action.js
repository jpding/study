/**
 * 导入上一版本历史数据，分一下集中情况
 * 1.当年的数据，直接拷贝上一期
 * 2.年份错位拷贝，年份错位，要根据表单拷贝
 */
 
function copyTask(taskid, srcPeriod, destPeriod) {
	var config = getConfig(taskid);
}

function getConfig(taskid){
}

/**
 * 返回当前采集任务的所有表单
 * @param {} taskid
 */
function getTaskForms(taskid){
}

/**
 * 返回指定表单对应的数据库表
 * @param {} form
 */
function getTaskFactTables(form){
}

/**
 * 拷贝上一期数据，整个采集任务一起拷贝
 * @param {} taskid
 * @param {} srcPeriod    源数据期
 * @param {} destPeriod   拷贝到的数据期
 */
function copyLastPeriod(taskid, srcPeriod, destPeriod){
	//sz.ci.copy
}

/**
 * 拷贝表单的历史数据，是直接拷贝，不带配置文件的拷贝
 * @param {} taskid
 * @param {} formName
 * @param {} srcPeriod
 * @param {} destPeriod
 */
function copyDataForm(taskid, srcPeriod, destPeriod, formName){
	// insert into vv()
}

/**
 * {src:dest, src:dest}
 * delete from vv where bbq=? and dw = ?
 * insert into vv(bbq, dw, dest1,dest2,dest3) select bbq, dw,  src1, src2, src3 from vv where xxx  
 * @param {} taskid
 * @param {} formName
 * @param {} srcPeriod
 * @param {} destPeriod
 */
function copyDataFormForConfig(taskid, srcPeriod, destPeriod, formName, config){
	
}
 
