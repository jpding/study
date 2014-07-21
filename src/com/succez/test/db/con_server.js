
function generateDetailGrainId(repo, task, period, hierachy) {
	var uid = java.util.UUID.randomUUID().toString();
	return com.succez.commons.util.StringUtils.replace(uid, "-", "");
}

function getUserManager(initiator) {
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

function dim(dimpath, code, property) {
	var beangetter = com.succez.commons.service.springmvcext.BeanGetterHolder
			.getBeanGetter();
	var repo = beangetter.getBean(com.succez.metadata.api.MetaRepository);
	var entity = repo.getMetaEntity(dimpath);
	var dim = entity.getBusinessObject(com.succez.bi.dw.DimensionTable);
	var treeitem = dim.getTreeItem(code).getField(property);
	return treeitem;
}

function test(uid, user){
	println("================================");
	println("uid\t"+uid);
	println("user\t"+user);
	updateHTBHId(user,uid);
	synData(uid, user);
	println("=================================");
}

function updateHTBHId(userid, uid){
	var cont_id = genHTBHId(userid);
	var ds = sz.db.getDefaultDataSource();
	ds.update("update LAWCI_LC_CONTRACTINFO set cont_id=? where \"UID\"=?", [cont_id, uid]);
}

function genHTBHId(userId){
	var prefix = genPrefixHTBH(userId);
	var num = tostr(genHTBHNum(userId)["num"], '0000');
	return prefix+num;
}

function genPrefixHTBH(userId){
	var user = sz.security.getUser(userId);
	var org = user.org;
	var deptId = right(org.id, 2);
	var prefix = "CSSC-"+deptId+"-"+tostr(today(),'yyyy')+"-";
	return prefix;
}

function genHTBHNum(userId){
	var prefix = genPrefixHTBH(userId);
	
	var ds = sz.db.getDefaultDataSource();
	var result = sz.db.getDefaultDataSource().select("select CONT_ID from LAWCI_LC_CONTRACTINFO where CONT_ID like '"+prefix+"%' order by CONT_ID desc");
	if(result == null||result.length==0){
		return {num:1}
	}
	var line = result[0];
	if(line == null||line.length == 0){
		return {num:1};
	}
	var max = line[0];
	max = max.substring(prefix.length+1, max.length);
	var num = com.succez.commons.util.NumberUtils.toInt(max, 0);
	return {num:num+1}
}

/**
 *  通过脚本自动添加数据
 */
var BeanGetter = com.succez.commons.service.springmvcext.BeanGetterHolder.getBeanGetter();
var ActionCIAddDataComponent = com.succez.bi.ci.impl.pages.cidatamgr.adddata.ActionCIAddDataComponent;
var CIUtilDataInsert = com.succez.bi.ci.util.CIUtilDataInsert;
var MetaRepository = com.succez.metadata.api.MetaRepository;
var CITask = com.succez.bi.ci.meta.CITask;
var NumberUtils = com.succez.commons.util.NumberUtils;

function synData(uid, userId){
	var values = getPlanValues(uid);
	if(values == null || values.length ==0){
		println("===========================");
		println("获取不到数据,uid:"+uid+"user:"+userId);
		println("===========================");
	}
	var user = sz.security.getUser(userId);
	for(var i=0; i<values.length; i++){
		var mp = values[i];
		mp["UID"] = generateDetailGrainId();
		mp["CONT_UID"] = uid;
		mp["CREATEUSER"] = userId;
		addData("LAWCONT:/collections/合同管理/LC_CONT_CRIT", "ORG="+user.org.id, mp);
		println("加入数据：uid:"+mp["UID"]+";CONT_ID:"+uid+";user:"+userId);
	}
}


function generateDetailGrainId() {
	var uid = java.util.UUID.randomUUID().toString();
	return com.succez.commons.util.StringUtils.replace(uid, "-", "");
}

function getPlanValues(uid){
	var ds = sz.db.getDefaultDataSource();
	var result = ds.select1("select PAY_MODEM_ID from LAWCI_LC_CONTRACTINFO where \"UID\"=?", [uid])
	/**
	 * 1:一次性；  2:分期
	 */
	println("付款方式："+result);
	if(result == '1'){
		return getOneTimeValues(uid);
	}else{
		return getMoreTimeValues(uid);
	}
}

/**
 * 获取一期的值，返回的是一个数组
 */
function getOneTimeValues(uid){
	var ds = sz.db.getDefaultDataSource();
	var query1 = ds.select("select per_begin_date, per_end_date, cont_zj from LAWCI_LC_CONTRACTINFO where \"UID\"=?", [uid])
	
	var result = [];
	var values = {};
	values['PAY_CLAUSE'] = '一次性';
	values['BEGIN_DATE'] = query1[0][0];
	values['END_DATE']   = query1[0][1];
	values['JSFHTK']     = (query1[0][2] == null ? 0 : NumberUtils.toDouble(query1[0][2],0));
	values['PERFORM_DESC'] =  "一次性付款";
	
	result.push(values);
	return result;
}

/**
 * 获取多期的值，返回的是一个数组
 */
function getMoreTimeValues(uid){
	var ds = sz.db.getDefaultDataSource();
	var query1 = ds.select("select fxproj, sjq, sjz, fkje, fkzb, fkyj, kxnr from LAWCI_LC_CONTRACTINFO_F1 where \"UID\"=?", [uid])
	if(query1 == null || query1.length == 0){
		return [];
	}
	
	var result = [];
	for(var i=0; i<query1.length; i++){
		var values = {};
		if(query1[i] == null)
			continue;
		values['PAY_CLAUSE'] = query1[i][0];
		values['BEGIN_DATE'] = query1[i][1];
		values['END_DATE']   = query1[i][2];
		values['JSFHTK']     = (query1[i][3] == null ? 0 : NumberUtils.toDouble(query1[i][3],0));
		values['PERFORM_DESC'] =  query1[i][6];
		result.push(values);
	}
	return result;
}

function addData(resid, pid, values){
	var repo = BeanGetter.getBean(MetaRepository);
	var citask = repo.getMetaEntity(resid,true).getBusinessObject(CITask);
	var dataInsert = BeanGetter.getBean(CIUtilDataInsert);
	dataInsert.insertDetailData(citask, null, pid, values);
}