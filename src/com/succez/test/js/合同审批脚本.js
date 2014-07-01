/**
* 定制开始表单的工具条按钮，显示提交和保存
*/
function oninitwiform_STARTFORM($flow){
	if($flow.getButton("complete")){
		$flow.getButton("complete").setVisible(false);
	}
	$flow.addButton({id:'savestartform',caption:"提交",icon:"sz-app-icon-run",next:"cancel",click:function(event){
		$flow.getForm().setValue("submited","hide_status_","LC_CONT_INFO");
		$flow.startFlow({datas:{"dim":"value"},success:function(event){
			sz.commons.CheckSaved.getInstance().setModified();
			window.location.reload();
		}});
	}});
	$flow.addButton({id:'savestartform',caption:"保存",icon:"sz-app-icon-save",next:"savestartform",click:function(event){
		var fillforms = $flow.getForm();
		fillforms.setValue("saved","hide_status_","LC_CONT_INFO");
		
		var dataMgr = fillforms.datamgr;
		fillforms.endEdit({
			    success	: function() {
				    dataMgr.audit({
					        success	: function() {
						        if (dataMgr.getFormsData().getFailAuditsCount() > 0) {
							        sz.commons.messagebox.showMessage("fail", "*号标注项为必填项!");
						        }
						        else {
									$flow.getForm().submit({nodata:"true",success:function(event){
										
										
										sz.commons.CheckSaved.getInstance().setModified();
										window.location.reload();
										
									}});
						        }
					        }
				        });
			    }
		    });
	}});
	
	$.loadJsCss(['/meta/LAWCONT/others/jgrowl/jquery.jgrowl.css','/meta/LAWCONT/others/jgrowl/jquery.jgrowl.js']);
}

function test(){
}

/**
* 定制合同维护的查询界面，只显示删除按钮//////////////
*/
function oninitwiquery_MAINTAIN($flow){
	if($flow.getButton("start")){
		$flow.getButton("start").setVisible(false);
	}

	$flow.addButton({id:'savestartform',caption:"增加",icon:"sz-app-icon-add2",next:"deletedata",click:function(event){
        $flow.showForm({resid:'LAWCONT:/workflows/法律业务系统/CONT_INFO2',alias : "STARTFORM"});		
	}});
}
/**
* 定制合同维护的编辑界面，显示提交和保存
*/
function oninitwiform_MAINTAIN($flow){
	if($flow.getButton("complete")){
		$flow.getButton("complete").setVisible(false);
	}
	
	$flow.addButton({id:'savestartform',caption:"提交",icon:"sz-app-icon-run",next:"cancel",click:function(event){
		$flow.getForm().setValue("submited","hide_status_","LC_CONT_INFO");
		$flow.startFlow({datas:{"dim":"value"},success:function(event){
			sz.commons.CheckSaved.getInstance().setModified();
			window.location.reload();
		}});
	}});
	$flow.addButton({id:'savestartform',caption:"保存",icon:"sz-app-icon-save",next:"savestartform",click:function(event){
		var fillforms = $flow.getForm();
		fillforms.setValue("saved","hide_status_","LC_CONT_INFO");
		
		var dataMgr = fillforms.datamgr;
		fillforms.endEdit({
			    success	: function() {
				    dataMgr.audit({
					        success	: function() {
						        if (dataMgr.getFormsData().getFailAuditsCount() > 0) {
							        sz.commons.messagebox.showMessage("fail", "*号标注项为必填项!");
						        }
						        else {
									$flow.getForm().submit({nodata:"true",success:function(event){
										sz.commons.CheckSaved.getInstance().setModified();
										window.location.reload();
										
									}});
						        }
					        }
				        });
			    }
		    });
	}});
}

/**
* 测试showForm函数是否正常
*/
function oninitwiform_TEST4($flow){
	alert("test4");
	if($flow.getButton("complete")){
		$flow.getButton("complete").setVisible(false);
	}
	$flow.addButton({id:'savestartform',caption:"测试提交",icon:"sz-app-icon-run",next:"global",click:function(event){
		$flow.getForm().setValue("submited","hide_status_","LC_CONT_INFO");
		$flow.startFlow({datas:{"dim":"value"},success:function(event){
			$flow.showForm();
		}});
	}});
	$flow.addButton({id:'savestartform',caption:"测试保存",icon:"sz-app-icon-save",next:"global",click:function(event){
		$flow.getForm().setValue("saved","hide_status_","LC_CONT_INFO");
		$flow.getForm().submit({nodata:"true",success:function(event){
			$flow.showForm();
		}});
	}});
}


/**
*测试showQuery函数是否正常
*/
function oninitwiform_TEST5($flow){
	alert("test5");
	if($flow.getButton("complete")){
		$flow.getButton("complete").setVisible(false);
	}
	$flow.addButton({id:'savestartform',caption:"测试提交",icon:"sz-app-icon-run",next:"global",click:function(event){
		$flow.getForm().setValue("submited","hide_status_","LC_CONT_INFO");
		$flow.startFlow({datas:{"dim":"value"},success:function(event){
			$flow.showQuery();
		}});
	}});
	$flow.addButton({id:'savestartform',caption:"测试保存",icon:"sz-app-icon-save",next:"global",click:function(event){
		$flow.getForm().setValue("saved","hide_status_","LC_CONT_INFO");
		$flow.getForm().submit({nodata:"true",success:function(event){
			$flow.showQuery();
		}});
	}});
}

$.extend({
	loadJsCss : function(file) {
		var files = typeof file == "string" ? [file] : file;
		var ctx = sz.sys.ctx();
		for (var i = 0; i < files.length; i++) {
			var name = files[i];
			var att = name.split('.');
			var ext = att[att.length - 1].toLowerCase();
			var isCSS = ext == "css";
			var tag = isCSS ? "link" : "script";
			var attr = isCSS
					? " type='text/css' rel='stylesheet' "
					: " language='javascript' type='text/javascript' ";
			var link = (isCSS ? "href" : "src") + "='" + sz.sys.ctx(name) + "'";
			if ($(tag + "[" + link + "]").length == 0){
				$("<" + tag + attr + link + "></" + tag + ">").appendTo("head");
			}
		}
	}
});

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
