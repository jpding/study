/**
 * 表单之间同步数据，采用客户端事件来同步
 */

 
 
http://succez_tax:8080/succezbi/meta/LAWCONT/others/server/contrisk.action?method=listcontrisk&conttypeid=0100
http://succez_tax:8080/succezbi/meta/LAWCONT/others/server/contrisk.action?method=listcontrisk&conttypeid=0100

$.post("test.php", function(data){
   alert("Data Loaded: " + data);
 });conttypeid=0100

				
var url = sz.sys.ctx("/meta/LAWCONT/others/server/contrisk.action?method=listcontrisk");
var typeid = type;
$.post(url, {"conttypeid":typeid}, function(data){
	if(data==null || data.length == 0){
		data = [];
	}
	var content = [];
	for(var i=0; i<data.length; i++){
		var pkey = data[i][0];
		var name = data[i][1];
		content.push("<a href=\"javascript:void(0)\" onclick=\"sz.custom.showInfoDlg('"+pkey+"')\">"+name+"</a>");
	}
	$.jGrowl(content.join("<br>"), { 
				sticky: true,
				position:'bottom-right',
				theme:  'manilla',
				header: '风险提示'
			});
}, "json");

var custom = sz.sys.namespace("sz.custom");
custom.showInfoDlg=function(pkey){
	var dlg = window.showInfoDlg;
	if (!dlg){
		dlg =  window.showInfoDlg = sz.commons.Dialog.create();
	}
	
	dlg.showHtml({
		url : sz.sys.ctx(encodeURI("/meta/LAWCONT/others/knowlege/展示页面/showPage.action?method=showLawContent")),
		data : {
			pkey : pkey,
			tbName : "FACT_JUDGMENT"
		}
	})
}

//////////////////////////////////////////////////////////////////

var url = sz.sys.ctx("/meta/LAWCONT/others/server/contrisk.action?method=listcontrisk");
var typeid = subtype;
$.post(url, {"conttypeid":typeid}, function(data){
	if(data==null || data.length == 0){
		data = [];
	}
	var content = [];
	for(var i=0; i<data.length; i++){
		var pkey = data[i][0];
		var name = data[i][1];
		content.push("<a href=\"javascript:void(0)\" onclick=\"sz.custom.showInfoDlg('"+pkey+"')\">"+name+"</a>");
	}
	$.jGrowl(content.join("<br>"), { 
				sticky: true,
				position:'bottom-right',
				theme:  'manilla',
				header: '风险提示'
			});
}, "json");

var custom = sz.sys.namespace("sz.custom");
custom.showInfoDlg=function(pkey){
	var dlg = window.showInfoDlg;
	if (!dlg){
		dlg =  window.showInfoDlg = sz.commons.Dialog.create();
	}
	
	dlg.showHtml({
		url : sz.sys.ctx(encodeURI("/meta/LAWCONT/others/knowlege/展示页面/showPage.action?method=showLawContent")),
		data : {
			pkey : pkey,
			tbName : "FACT_JUDGMENT"
		}
	})
}

/////////////////////////////////////////////////////////////////
http://127.0.0.1:8080/cidatamgr/api/adddata?resid=587268106&A=xxx3&pid=ORG=TEST
$flow.getForm().ciforms['LC_CONT_INFO'].floatAreas['table2.b2'].getRow(0).getComponent("table2.c2").val()

$flow.getForm().ciforms['LC_CONT_INFO'].getComponent("uid").val()

function synData(form){
	var ciform = form.ciforms['LC_CONT_INFO'];
	var cont_id = ciform.getComponent("uid").val();
	var result = getPayPlan(form);
	for(var i=0; i<result.length; i++){
		var uid = i+""+(new Date()).getTime();
		var url = sz.sys.ctx("/cidatamgr/api/adddata?pid=ORG=TEST&UID="+uid+"&CONT_UID="+cont_id);
		var params = result[i];
		params['resid'] = 'LAWCONT:/collections/合同管理/LC_CONT_CRIT';
		$.post(url, params, function(){
		});
	}
}

function getPayPlan(form){
	var ciform = form.ciforms['LC_CONT_INFO'];
	var payModemId = ciform.getComponent("pay_modem_id").val();
	if(payModemId == "1"){
		return getOnetimePlan(form);
	}else{
		return getPlanTableValue(form);
	}
}


/**
 * 一次性付款产生的计划
 */
function getOnetimePlan(form){
	var result = [];
	var rowValue = {};
	var ciform = form.ciforms['LC_CONT_INFO'];
	rowValue['PAY_CLAUSE'] = '一次性';
	rowValue['BEGIN_DATE'] = ciform.getComponent("per_begin_date").val();
	rowValue['END_DATE']   = ciform.getComponent("per_end_date").val();
	rowValue['JSFHTK']     = ciform.getComponent("cont_zj").val();
	rowValue['PERFORM_DESC'] =  "一次性付款";
	result.push(rowValue);
	return result;
}

/**
 * 用户手工输入产生的计划
 * [{},{},{},{}]
 * 返回一个json数组
 */
function getPlanTableValue(form){
	var floatAreas = form.ciforms['LC_CONT_INFO'].floatAreas['table2.b2'];
	var result = [];
	for(var i=0; i<floatAreas.getRowCount(); i++){
		var row = floatAreas.getRow(i);
		var rowValue = {};
		rowValue['PAY_CLAUSE'] = row.getComponent("table2.b2").val();
		rowValue['BEGIN_DATE'] = row.getComponent("table2.c2").val();
		rowValue['END_DATE']   = row.getComponent("table2.d2").val();
		rowValue['JSFHTK']     = row.getComponent("table2.e2").val();
		rowValue['PERFORM_DESC'] =  row.getComponent("table2.g2").val();
		result.push(rowValue);
	}
	return result;
}

////////////////////////////////////////////////////////////
/**
 * 生成合同编号 CSSC-12-2004-0001
 */

function genId(userId){
	var user = sz.security.getUser(userId);
	var org = user.org;
	var deptId = right(org.id, 2);
	var prefix = "CSSC-"+deptId+"-"+tostr(today(),'yyyy')+"-";
	
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
/////////////////////////////////////////////////////////////////////
${od(od('20140101', 'd+'+(7-date(2014,1,1).weekDay())), 'd+'+(tonum(right('201401',2))-1)*7+1)}


function weekone(wk){
   var y = left(wk, 4);
   var oneWK = todate(y+"0101",'yyyymmdd').weekDay();
   var one = "";
   if(oneWK==1){
      one = od(y+"0101",'d-1');
   }else{
      one = od(y+"0101", 'd+'+(7-oneWK));
   }
   var wnum = tonum(right(wk,2))
   return od(one, 'd+'+((wnum-1)*7+1));
}

function weekend(wk){
}


