function WI_getUserManager(initiator) {
	var user = sz.security.getUser(initiator, true);
	var orgid = user.org.id;
	var userlist = sz.security.listUsers();
	for (var i = 0; i < userlist.length; i++) {
		var sib = userlist[i];
		if (sib.org.id != orgid) {
			continue;
		}
		if (sib.isRole("部门经理")) {
			return sib.id;
		}
	}

	throw new Error('找不到用户“' + user.id + "”的负责人，请查看该部门下是否有用户设置了“部门经理”角色!");
}

function WI_getUserByStarter(starter, roleName) {
	var user = sz.security.getUser(starter, true);
	var orgid = user.org.id;
	var userlist = sz.security.listUsers();
	for (var i = 0; i < userlist.length; i++) {
		var sib = userlist[i];
		if (sib.org.id != orgid) {
			continue;
		}
		if (sib.isRole(roleName)) {
			return sib.id;
		}
	}

	throw new Error('找不到用户“' + user.id + "”的负责人，请查看该部门下是否有用户设置了“"+roleName+"”角色!");
}

function WI_getUserByRole(dptid, roleName) {
	var userlist = sz.security.listUsers();
	for (var i = 0; i < userlist.length; i++) {
		var sib = userlist[i];
		if (sib.org.id != dptid) {
			continue;
		}
		if (sib.isRole(roleName)) {
			return sib.id;
		}
	}

	throw new Error('找不到用户“' + user.id + "”的负责人，请查看该部门下是否有用户设置了“"+roleName+"”角色!");
}

/**
 * 任务分配给用户时将触发这个函数，可以通过返回值修改分配用户信息，返回值为空时将按照原分配人进行分配
 * 1:合同;2:案件;3:所有
 * @param flow 流程对象
 * @param event activiti事件对象
 * @param task actviti任务对象，可以从中获取当前任务assignee
 * @param vars 流程参数，可以获取当前TASKTYPE_字段信息
 * @return 返回被委托用户ID
*/
function WI_onTaskAssigned(flow, event, task, vars){
	var assignee = task.getAssignee();
	if(assignee == null){
		return null;
	}
	
	println("委托代理："+task.getAssignee());
	var time = java.lang.System.currentTimeMillis();
  	var date = new java.sql.Date(time);
  	var tablename = "AUTH_ENT_AUTH_ENTR";
  	var sql = "select SQWTRMC from "+tablename+" t1 Inner Join ACT_HI_PROCINST h1 On t1.\"UID\"=h1.business_key_  Where h1.end_time_ Is Not Null And createuser=? and SQKind1=?" 
  	var result = null;
  	try{
  		var wiArr = ["",""];
  		var wiUid = flow.getId();
  		println("委托工作流："+wiUid);
  		var delType = 3;
  		result = sz.db.getDefaultDataSource().select1(sql, [assignee, delType]);
  	}catch(ex){
  		return null;
  	}
	
	return result;
}

function WI_generateDetailGrainId(repo, task, period, hierachy) {
	var uid = java.util.UUID.randomUUID().toString();
	return com.succez.commons.util.StringUtils.replace(uid, "-", "");
}

/**
* 根据维表代码查询某个特定的属性的值
* @params dimpath 维表路径
* @params code 维代码
* @params property 维属性名称
* @return 返回维属性值
*/
function WI_dim(dimpath, code, property){
	var beangetter = com.succez.commons.service.springmvcext.BeanGetterHolder.getBeanGetter();
	var repo = beangetter.getBean(com.succez.metadata.api.MetaRepository);
	var entity = repo.getMetaEntity(dimpath);
	var dim = entity.getBusinessObject(com.succez.bi.dw.DimensionTable);
	var treeitem = dim.getTreeItem(code).getField(property);
	return treeitem;
};

function listUsers(org){
	var userMgr = sz.security.getUserManager();
	var fullOrg = "security:/orgmgr/"+org;
	var orgUsers = userMgr.listUsers(fullOrg);
	if(orgUsers == null){
		return [];
	}
	var result = [];
	for(var i=0; i<orgUsers.size(); i++){
		var userBean = orgUsers.get(i);
		var user = {};
		
	}
	return result;
}

function doUpdateContent(args){
	var params = args.args;
	var pkey= params.pkey;
	var value = params.val;
	var tbName = params.tbName;
	
	print("pkey: " + pkey);
	print("value : " + value);
	var ds = sz.db.getDataSource('default');
	var upd = ds.createTableUpdater(tbName,"PKEY="+pkey);
	upd.set("CONTENT",value);
	upd.commit();
}

function doDeleteData(args){
	var params = args.args;
	var pkey= params.pkey;
	var tbName = params.tbName;
	var ds = sz.db.getDataSource('default');
	ds.update("delete from "+ tbName +" where PKEY=?",pkey);
}

function doGetContentForShow(args){
	var params = args.args;
	var pkey= params.pkey;
	var tbName = params.tbName;
	var ds = sz.db.getDataSource('default');
	var result = ds.select("select CONTENT from "+ tbName +" where PKEY=?",pkey);
        if (result && result.length>0 && result[0] && result[0].length>0){
                return result[0][0]
        }
}