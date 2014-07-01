/**
* 定制开始表单的工具条按钮，显示提交和保存
*/
function oninitwiform_STARTFORM($flow){
	if($flow.getButton("complete")){
		$flow.getButton("complete").setVisible(false);
	}
	$flow.addButton({id:'savestartform',caption:"提交",icon:"sz-app-icon-run",next:"global",click:function(event){
		$flow.getForm().setValue("submited","hide_status_","LC_CONT_INFO");
		$flow.startFlow({datas:{"dim":"value"},success:function(event){
			sz.commons.CheckSaved.getInstance().setModified();
			window.location.reload();
		}});
	}});
	$flow.addButton({id:'savestartform',caption:"保存",icon:"sz-app-icon-save",next:"global",click:function(event){
		var fillforms = $flow.getForm();
		$flow.getForm().setValue("saved","hide_status_","LC_CONT_INFO");
		var dataMgr = fillforms.datamgr;
		fillforms.endEdit({
			    success	: function() {
				    dataMgr.audit({
					        success	: function() {
						        if (dataMgr.getFormsData().getFailAuditsCount() > 0) {
							        sz.commons.messagebox.showMessage("warn", "*号标注项为必填项!");
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
	
	$.loadJsCss(['/meta/LAWCONT/others/jgrowl/jquery.jgrowl.min.css','/meta/LAWCONT/others/jgrowl/jquery.jgrowl.min.js']);
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
        $flow.showForm({resid:'LAWCONT:/workflows/法律业务系统/CONT_INFO2'});		
	}});
}

/**
* 定制合同维护的编辑界面，显示提交和保存
*/
function oninitwiform_MAINTAIN($flow){
	if($flow.getButton("complete")){
		$flow.getButton("complete").setVisible(false);
	}
	
	$flow.addButton({id:'savestartform',caption:"提交",icon:"sz-app-icon-run",next:"global",click:function(event){
		var fillforms = $flow.getForm();
		$flow.getForm().setValue("submited","hide_status_","LC_CONT_INFO");
		var dataMgr = fillforms.datamgr;
		fillforms.endEdit({
			    success	: function() {
				    dataMgr.audit({
					        success	: function() {
						        if (dataMgr.getFormsData().getFailAuditsCount() > 0) {
							        fillforms.showPanelAudit();
						        }
						        else {
									$flow.startFlow({datas:{"dim":"value"},success:function(event){$flow.showQuery();}});
						        }
					        }
				        });
			    }
		    })
	}});
	$flow.addButton({id:'savestartform',caption:"保存",icon:"sz-app-icon-save",next:"global",click:function(event){
		var fillforms = $flow.getForm();
		$flow.getForm().setValue("saved","hide_status_","LC_CONT_INFO");
		var dataMgr = fillforms.datamgr;
		fillforms.endEdit({
			    success	: function() {
				    dataMgr.audit({
					        success	: function() {
						        if (dataMgr.getFormsData().getFailAuditsCount() > 0) {
							        fillforms.showPanelAudit();
						        }
						        else {
							       fillforms.submit({nodata:"true",success:function(event){$flow.showQuery();}});
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
			var link = (isCSS ? "href" : "src") + "='" + ctx + name + "'";
			if ($(tag + "[" + link + "]").length == 0){
				$("<" + tag + attr + link + "></" + tag + ">").appendTo("head");
			}
		}
	}
});