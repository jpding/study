/**
* 定制开始表单的工具条按钮，显示提交和保存
*/
function oninitwiform_STARTFORM($flow){	
     $flow.addButton({id:'wisubmit',caption:"提交",icon:"sz-app-icon-run",next:"cancel",click:function(event){
          $flow.getForm().setValue("submited","hide_status_","LC_CONTRACTINFO");
          $flow.startFlow({datas:{"dim":"value"},success:function(event){
               sz.commons.CheckSaved.getInstance().setModified();
               window.location.reload();
          }});
     }});
     $flow.addButton({id:'wisave',caption:"保存",icon:"sz-app-icon-save",next:"savestartform",click:function(event){
          var fillforms = $flow.getForm();
          fillforms.setValue("saved","hide_status_","LC_CONTRACTINFO");
         
          var dataMgr = fillforms.datamgr;
          fillforms.endEdit({
                   success     : function() {
                        dataMgr.audit({
                                 success     : function() {
                                      if (dataMgr.getFormsData().getFailAuditsCount() > 0) {
                                            fillforms.showAuditResults();
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

function checkAudit($flow, formName, isSave){
	var fillforms = $flow.getForm();
	if(formName){
		fillforms.setValue(isSave ? "saved" : "submited","hide_status_",formName);
	}
	var dataMgr = fillforms.datamgr;
	fillforms.endEdit({
		success:function(){
			dataMgr.audit({
				success:function(){
					if(dataMgr.getFormsData().getFailAuditsCount()>0){
						fillforms.showAuditResults();
					}else{
						if(isSave){
							fillforms.sumbit({hint:false,nodata:"true",success:function(event){
								sz.commons.CheckSaved.getInstance().setModified();
								window.location.reload();
							}})
						}else{
							$flow.startFlow({datas:{"dim":"value"},success:function(event){
								sz.commons.CheckSaved.getInstance().setModified();
					            window.location.reload();
					         }});
						}
						
					}
				}
			});
		}
	});
}

/**
* 定制合同维护的查询界面，只显示删除按钮//////////////
*/
function oninitwiquery_MAINTAIN($flow){
     $flow.addButton({id:'savestartform',caption:"增加",icon:"sz-app-icon-add2",next:"deletedata",click:function(event){
        $flow.showForm({resid:'LAWCONT:/workflows/法律业务系统/CONT_INFO2',alias : "STARTFORM"});         
     }});
}