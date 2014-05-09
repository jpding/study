/**
* 生成UUID作为明细填报ID 
* @params repo 元数据repository 
* @params task 采集任务对象 
* @params period 数据期字符串 
* @params hierachy 数据级次字符串 
*/ 
function generateDetailGrainId(repo, task, period, hierachy){ 
	var uid = java.util.UUID.randomUUID().toString(); 
	return uid.repaceAll("-",""); 
};

/**
* 获取用户的直接管理经理，参见：http://jira.succez.com/browse/BI-9408
* DEMO: 如何在工作流中调用脚本方法？可以使用${wiutil.rihino("", a,b,c)};
* @params initiator 流程启动者
*/
function getUserManager(initiator){
	var user = sz.security.getUser(initiator, true);
	var orgid = user.org.id;
	var userlist = sz.security.listUsers();
	for(var i = 0;i < userlist.length;i++){
		var sib = userlist[i];
		if(sib.org.id!=orgid){
			continue;
		}
		if(sib.isRole("部门经理")){
			return sib.id;
		}
	}
	return null;
};

/**
* 根据维表代码查询某个特定的属性的值
* @params dimpath 维表路径
* @params code 维代码
* @params property 维属性名称
* @return 返回维属性值
*/
function dim(dimpath, code, property){
	var beangetter = com.succez.commons.service.springmvcext.BeanGetterHolder.getBeanGetter();
	var repo = beangetter.getBean(com.succez.metadata.api.MetaRepository);
	var entity = repo.getMetaEntity(dimpath);
	var dim = entity.getBusinessObject(com.succez.bi.dw.DimensionTable);
	var treeitem = dim.getTreeItem(code).getField(property);
	return treeitem;
};