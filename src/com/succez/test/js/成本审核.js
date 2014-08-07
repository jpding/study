/**
 *  
 */
 
var button = $flow.getButton("wisubmit");
button.off("click");
button.on("click", function(){
	var fillforms = $flow.getForm();
	fillforms.setValue("submited","hide_status_",$flow.getForm().getCurrentFormName());
	var dataMgr = fillforms.datamgr;
	fillforms.endEdit({
		success:function(){
			dataMgr.audit({
				success:function(){
					if(dataMgr.getFormsData().getFailAuditsCount()>0){
						fillforms.showAuditResults();
					}else{
						var url = "/meta/LAWCONT/collections/合同管理/LC_CONT_APPR/reports/script/apprcost.action"
						var cillform = $flow.getForm();
						var formName = "FM_CONT_APPR";
						var targetCost = cillform.getValue("target_cost_money", formName);
						var params = {};
						params["conttype"]=cillform.getValue("cont_type", formName);
						params["contnum"]=cillform.getValue("cont_num", formName);
						
						sz.commons.CheckSaved.getInstance().setModified();
						$.post(sz.sys.ctx(url), params, function(data){
							var datai = parseInt(data);
							var totalCost = datai+targetCost;
							if(totalCost > 100000){
								sz.commons.Alert.show({
													msg : "同月同项目签订合同累计金额不得超过10万元"
												});
								return ;							
							}else{
								$flow.startFlow({datas:{"dim":"value"},success:function(){
									sz.commons.CheckSaved.getInstance().setModified();
									window.location.href=sz.sys.ctx("/meta/LAWCONT/analyses/index/portal?selectedId=6619165-1");
								}});
							}
						});
					}
				}
			});
		}
	});
});


		


/**
 * 5万元以下的合同不得超过，总额不得超过10万元
 */
	$.addCallbacks("submit_"+$flow.getForm().getCurrentFormName(), function(){
		debugger;
		
	});

 
/**
 * =========================================
 * @param {} bbq
 * @param {} dept
 * @param {} contType
 */ 
 
 
function main(args){
	var vv = getAuditValue("0101", "1c246998cd0347cd88977f42ca42529c");
	println(vv);
	
	vv = getDeptAuditCost(null, "X00007","0101", "1c246998cd0347cd88977f42ca42529c");
	println(vv);
}

function execute(req, res){
	var contType = req.conttype;
	var contnum  = req.contnum;
	var auditValue = getAuditValue(contType, contnum);
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