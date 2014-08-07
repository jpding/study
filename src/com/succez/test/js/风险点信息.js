/**
 *  {form=STARTFORM, datas={"UID":"e4ca9a15d35549bfb17d0e9754cd2997","BID_NAME_":"AAAA","PRO_INTRO":"s324324","BID_WAY_ID":"01","CURR_ID":"CNY","BID_AMOUNT":123213234,"CONT_MAIN_TYPE":"","CONT_SUB_TYPE":"","AGENCY":"","INVITED_SUPPLY":"","QUALIFICATION_REQUIREMENTS":"","REMARK":"","ORG":"TEST","dim":"value"}, resid=6553629}
 */
var BeanGetterHolder = com.succez.commons.service.springmvcext.BeanGetterHolder;
var BeanGetter = BeanGetterHolder.getBeanGetter();
var WIFlowService = com.succez.bi.wi.WIFlowService;
var WIUtilStartInstance = com.succez.bi.wi.util.WIUtilStartInstance;
var WIWebUtilParams     = com.succez.bi.wi.util.web.WIWebUtilParams;
var ObjectMapper        = org.codehaus.jackson.map.ObjectMapper;
var StringUtils         = com.succez.commons.util.StringUtils;
var CIUtilDataInsert = com.succez.bi.ci.util.CIUtilDataInsert;
var MetaRepository = com.succez.metadata.api.MetaRepository;
var CITask = com.succez.bi.ci.meta.CITask;

function main(args){
	var params = {"form":"STARTFORM"};
	var flow = getWIFlow("LAWCONT:/workflows/法律业务系统/风险指标管理/RISKPOINT");
	var form = getWiForm(flow, params);
	println(form.name);
	println(form.caption);
	println(form.path);
	
	startWiFlow("LAWCONT:/workflows/法律业务系统/风险指标管理/RISKPOINT");
}

function testSynData(){
	var result = listRisk();
	println(result);
	var mp = genRiskData(result[0]);
	println(mp);
	var user = sz.security.getUser(mp["CREATEUSER"]);
	var pid = "ORG="+user.org.id;
	println(pid);
	addData("LAWCONT:/collections/风险指标管理/RISKPOINT", pid, mp);
}

/**
 * 列出所有的风险点，根据时间来启动
 * 0 风险提出人:starter
 * 1 风险点解决人：合同承办人
 * 2 风险点名称：
 * 3 风险点内容：
 * 4 开始时间：
 * 5 结束时间：
 * 6 合同编号：
 * 
 * 提出人;承办人;风险点名称;风险点内容;开始日期;结束日期;合同编号
 */
function listRisk(){
	var rptpath = "LAWCONT:/collections/风险指标管理/RISK_LIST/reports/RISK_REPORT";
	var entity = sz.metadata.get(rptpath);
	var rpt = entity.getObject();
	println("===========rpt============="+(rpt==null));
	var rptResult = rpt.calc({},"admin", null);
	var tableResult = rptResult.getComponent("table1");
	
	var result = [];
	for(var i=1; i<tableResult.getRowCount(); i++){
		var row = [];
		var startdate = tableResult.getCell(i,4).value;
		if(tostr(startdate,'yyyymmdd')==tostr(today(),'yyyymmdd')){
			continue;
		}
		
		row.push(tableResult.getCell(i,6).value);
		row.push(tableResult.getCell(i,8).value);
		row.push(tableResult.getCell(i,2).value);
		row.push(tableResult.getCell(i,3).value);
		row.push(tableResult.getCell(i,4).value);
		row.push(tableResult.getCell(i,5).value);
		row.push(tableResult.getCell(i,7).value);
		result.push(row);
	}
				   
	return result;
}

function generateDetailGrainId() {
	var uid = java.util.UUID.randomUUID().toString();
	return StringUtils.replace(uid, "-", "");
}

/**
 * 把风险点集合的数据插入到风险点表中
 * @param {} resid
 * @param {} pid
 * @param {} values
 */
function addData(resid, pid, values){
	var repo = BeanGetter.getBean(MetaRepository);
	var citask = repo.getMetaEntity(resid,true).getBusinessObject(CITask);
	var dataInsert = BeanGetter.getBean(CIUtilDataInsert);
	dataInsert.insertDetailData(citask, null, null, pid, values);
}

/**
 * 根据风险集合表里面查询出来的数据，生成表单字段
 * @param {} risk
 * @return {}
 */
function genRiskData(risk){
	var obj = {};
	obj["UID"]          = generateDetailGrainId();
	obj["CONT_UID"]     = risk[6];
	obj["RISK_NAME"]    = risk[2];
	obj["RISK_CONTENT"] = risk[3];
	obj["BEGINDATE"]    = risk[4];
	obj["ENDDATE"]      = risk[5];
	return obj;
}

/**
 * 把数据到表单，然后启动工作流
 * @param {} wiPath
 * @param {} user
 * @param {} businessKey
 */
function startWiFlow(wiPath){
	var result = listRisk();
	if(result == null || result.length == 0){
		return ;
	}
	
	var flow = getWIFlow(wiPath);
	var params = {"form":"STARTFORM"};
	
	for (var i = 0; i < result.length; i++) {
		var rows = result[i];
		var datas = genRiskData(rows);
		var user = sz.security.getUser(rows[0]);
		datas["CREATEUSER"]   = rows[0];
		datas["CREATEDEPT"]    =  user.org.id;
		var pid = "ORG="+user.org.id;
		println(datas);
		/**
		 * 
		 */
		addData("LAWCONT:/collections/风险指标管理/RISKPOINT", pid, datas);
		
		/**
		 * 启动流程
		 */
		datas["ORG"]   = user.org.id;
		datas["CBR"]   = rows[1];
		params["datas"] = datas;
		startFlow(flow, user.id, params);
	}
	
	
	/**
	 * 更新风险点集合表
	 */
	
}

function getWIFlow(path){
	var flowService = BeanGetter.getBean(WIFlowService);
	var obj = sz.metadata.get(path);
	return flowService.getWIFlow(obj.id, true);
}

function startFlow(flow, user, params){
	var startInst = BeanGetter.getBean(WIUtilStartInstance);
	startInst.reset();
	startInst.setFlow(flow);
	startInst.setStarter(user);
	
	var form = getWiForm(flow, params);
	var datas = params["datas"];
	var businesskey =getBusinesskeyFormVariables(form, datas);
	startInst.setFlowForm(form);
	startInst.setBusinessKey(businesskey);
	startInst.setVariables(datas);
	startInst.start();
}

function getWiForm(flow, params){
	var webParams = BeanGetter.getBean(WIWebUtilParams);
	return webParams.getWIFlowStartFormInf(flow, params);
}

function getBusinesskeyFormVariables(form, datas){
	if(!form){
		return null;
	}
	var key = form.getKeyField();
	if(!key){
		return null;
	}
	return datas[key];
}