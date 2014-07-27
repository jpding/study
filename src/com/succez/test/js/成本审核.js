/**
 *  
 */

/**
 * 5万元以下的合同不得超过，总额不得超过10万元
 */
function checkAuditCost(htCost){
	var url = "/meta/LAWCONT/collections/%E5%90%88%E5%90%8C%E7%AE%A1%E7%90%86/LC_CONT_APPR/reports/script/apprcost.action"
	var cillform = $flow.getForm();
	cillform.getValue("target_cost_money","FM_CONT_APPR");
	var htCost = null;
	var params = {};
	params["bbq"]=NULL;
	params["conttype"]=NULL;
	
	$.post(sz.sys.ctx(url), params, function(data){
		var datai = parseInt(data);
		var totalCost = datai+0;
		if(totalCost > 100000){
			sz.commons.Alert.show({
								msg : "同月同项目签订合同累计金额不得超过10万元"
							});
			return ;							
		}else{
			
		}
	});
}


 
/**
 * =========================================
 * @param {} bbq
 * @param {} dept
 * @param {} contType
 */ 
 
 
function main(args){
	var vv = getAuditValue("201407","", "0101");
	println(vv);
}

function execute(req, res){
	var contType = req.conttype;
	var contnum  = req.contnum;
	var auditValue = getAuditValue(contType, auditValue);
	res.setReturnType("json");
	return auditValue;
}

function getAuditValue(contType, contnum){
	var rows = getDeptAuditCost(null, null, contType, contnum);
	if(rows.length != 1){
		return "";
	}
	return rows[0][2];
}

/**
 * 判断同一部门同一类型合同，签订不要超过10万元
 */ 
function getDeptAuditCost(bbq, dept, contType, contnum){
	if(bbq == null){
		bbq = tostr(today(), 'yyyymm');
	}
	var entity = sz.metadata.get('LAWCONT:/collections/合同管理/LC_CONT_APPR/reports/apprcost');
	var rpt = entity.getObject();
	if(dept == null){
		dept = sz.security.getCurrentUser().org.id;
	}
	var result = rpt.calc({"@ORG":dept,"bbq":bbq, "conttype":contType, "contnum":contnum});
	var tableResult = result.getComponent("table1");
	var rows = tableResult.getRows();
	var resultRows = [];
	for(var i=1; i<rows.length; i++){
		var obj = [];
		var row = rows[i];				   
		for(var j=0; j<tableResult.getColCount(); j++){
			var vv = tableResult.getCell(i,j).value;
			if(vv == null)
				continue;
			obj.push(vv);
		}
		if(obj.length > 0){
			resultRows.push(obj);
		}
	}
	return resultRows;
}