/**
* 定制开始表单的工具条按钮，显示提交和保存
*/
function oninitwiform_STARTFORM($flow){
	$.addCallbacks("save_"+$flow.getForm().getCurrentFormName(), function(){
		sz.commons.CheckSaved.getInstance().setModified();
		window.location.href=sz.sys.ctx("/meta/LAWCONT/analyses/index/portal?selectedId=6193181-1");
	});
	
	var button = $flow.getButton("wisubmit");
	button.setCaption("提交");
	button.off("click");
	button.on("click", function(){
	
		sz.commons.CheckSaved.getInstance().setModified();
		var fillforms = $flow.getForm();
		fillforms.setValue("submited","hide_status_",fillforms.getCurrentFormName());
		var dataMgr = fillforms.datamgr;
		fillforms.endEdit({
			success:function(){
				
				dataMgr.audit({
					success:function(){
						
						if(dataMgr.getFormsData().getFailAuditsCount()>0){
							fillforms.showAuditResults();
						}else{
							var solve = fillforms.getValue("case_solve", fillforms.getCurrentFormName());
							
							fillforms.submit({hint:false,nodata:"true",success:function(){
								
								if(solve == "caseSolve2"){
									window.location.href=sz.sys.ctx("/meta/LAWCONT/analyses/index/portal?selectedId=373162011");
								}else{
									window.location.href=sz.sys.ctx("/meta/LAWCONT/analyses/index/portal?selectedId=370573339");
								}
							},error:function(errortype){
								if(errortype == "nodata"){
									if(solve == "caseSolve2"){
										window.location.href=sz.sys.ctx("/meta/LAWCONT/analyses/index/portal?selectedId=373162011");
									}else{
										window.location.href=sz.sys.ctx("/meta/LAWCONT/analyses/index/portal?selectedId=370573339");
									}
								}
							}});
						}
					}
				});
			}
		});
	});
}