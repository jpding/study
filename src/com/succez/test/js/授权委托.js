/**
* 任务分配给用户时将触发这个函数，可以通过返回值修改分配用户信息，返回值为空时将按照原分配人进行分配
* @param flow 流程对象
* @param event activiti事件对象
* @param task actviti任务对象，可以从中获取当前任务assignee
* @param vars 流程参数，可以获取当前TASKTYPE_字段信息
* @return 返回被委托用户ID
*/
function WI_onTaskAssigned(flow, event, task, vars){
  /*
  var assignee = task.getAssignee();
  if(assignee == null){
    return null;   
  }
  var tasktype= vars.get("TASKTYPE_");
  if(tasktype == null){
    return null;   
  }
  //查询数据库表，获取委托信息
  var tablename= "BI_10413_DELEGATEMGR_F0";
  var sql = "select ASSIGNEE_ from " + tablename +" where OWNER_=? and TASKTYPE_=?";
  var time = java.lang.System.currentTimeMillis();
  var date = new java.sql.Date(time);
  var result = sz.db.getDefaultDataSource().select1(sql,assignee, tasktype);
  if(result == null){
    return null;
  }
  */
  println("委托代理："+task.getAssignee());
  return null;
}

function WI_onTaskAssigned(flow, event, task, vars){
	var assignee = task.getAssignee();
	if(assignee == null){
		return null;
	}
	
	println("委托代理："+task.getAssignee());
	var time = java.lang.System.currentTimeMillis();
  	var date = new java.sql.Date(time);
  	var tablename = "AUTH_ENT_AUTH_ENTR";
  	var sql = "select SQWTRMC from " + tablename +" where createuser=?";
  	var result = sz.db.getDefaultDataSource().select1(sql, assignee);
  	if(result == null){
  		return null;
  	}
	
	return result;
}
