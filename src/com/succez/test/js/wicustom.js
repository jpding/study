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
     },
	  
	 /**
	 * 在上报时，先检查是否已经通过审核，如果没有通过则弹出审核提示信息
	 * isSave true|false
	 */
	 checkSubmitAudit:function($flow, formName, isSave, callback){
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
								fillforms.submit({hint:false,nodata:"true",success:function(){
									var funcname = "save_"+formName;
									if($.wicallbacks && $.wicallbacks[funcname]){
										$.wicallbacks[funcname]();
									}else{
										sz.commons.CheckSaved.getInstance().setModified();
										window.location.reload();
									}
								}});
							}else{
								$flow.startFlow({datas:{"dim":"value"},success:function(){
									var funcname = "submit_"+formName;
									if($.wicallbacks && $.wicallbacks["submit_"+formName]){
										$.wicallbacks[funcname]();
									}else{
										sz.commons.CheckSaved.getInstance().setModified();
										window.location.reload();
									}
								}});
							}
						}
					}
				});
			}
		});
	},
	
	addCallbacks : function(key, func){
		var callbacks = $.wicallbacks;
		if(!callbacks){
			$.wicallbacks = callbacks = {};
		}
		callbacks[key] = func;
	}
});

function oninitwiform($flow){
	var buttons = ['save'];
	if($flow.form && ($flow.form == "STARTFORM" || $flow.form == "MAINTAIN")){
		buttons.push("complete");
	}
	
	hiddenWIButtons($flow, buttons);
	
	if($flow.form && ($flow.form == "STARTFORM")){
		var form = $flow.getForm();
		var formName = form.getCurrentFormName();
		
		$flow.addButton({id:'wisubmit',caption:"送审",icon:"sz-app-icon-run",next:"cancel",click:function(event){
			 $.checkSubmitAudit($flow, formName, false);
	     }});
	     $flow.addButton({id:'wisave',caption:"临时保存",icon:"sz-app-icon-save",next:"wisubmit",click:function(event){
			 $.checkSubmitAudit($flow, formName, true);
	     }});
	}
	
	if($flow.form && ($flow.form == "MAINTAIN")){
		$flow.addButton({id:'wiadd',caption:"增加",icon:"sz-app-icon-add2",next:"deletedata",click:function(event){
	        $flow.showForm({resid:$flow.resid,alias : "STARTFORM"});         
	    }});
	}
	
	/**
	 * ===========================================================
	 */
	
	$flow.addButton({id:'wiedit',caption:"编辑表单",icon:"sz-app-icon-edit",next:"deletedata",click:function(event){
		var resid = $flow.getForm().resid; 
        var url = sz.sys.ctx("/citask/meta?resid="+resid);
        window.open(url);
    }});
    
    $flow.addButton({id:'wieditflow',caption:"编辑流程",icon:"sz-app-icon-reset",next:"deletedata",click:function(event){
		var resid = $flow.resid; 
        var url = sz.sys.ctx("/wi/dsn?resid="+resid);
        window.open(url);
    }});
}

function oninitwiquery($flow){
	var buttons = ['start'];
	hiddenWIButtons($flow, buttons);
	
	if(($flow.form && ($flow.form == "MAINTAIN")) || ($flow.query && ($flow.query == "MAINTAIN"))){
		$flow.addButton({id:'wiadd',caption:"增加",icon:"sz-app-icon-add2",next:"deletedata",click:function(event){
	        $flow.showForm({resid:$flow.resid,alias : "STARTFORM"});         
	     }});
	}
	
	/**
	 * ===========================================================
	 */
	
	$flow.addButton({id:'wieditflow',caption:"编辑流程",icon:"sz-app-icon-edit",next:"wiadd",click:function(event){
		var resid = $flow.resid; 
        var url = sz.sys.ctx("/wi/dsn?resid="+resid);
        window.open(url);
    }})
}

function hiddenWIButtons($flow, buttons){
	$.each(buttons, function(){
		if($flow.getButton(this)){
          $flow.getButton(this).setVisible(false);
     	}	
	})
}