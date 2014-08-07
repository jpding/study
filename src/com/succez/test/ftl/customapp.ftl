<@sz.commons.dynamicImport depends="sz.commons.outputJses,sz.commons.dialog,sz.commons.button,sz.commons.radiogroup,sz.commons.listcombobox,sz.wi.wihistory,sz.security.securityselector,sz.commons.form.file"/>
<#--
完成任务时的审批对话框
@author guob
@depends sz.commons.dialog,sz.commons.radiogroup,sz.commons.listcombobox
@depends sz.wi.wihistory,sz.security.securityselector,sz.commons.form.file
-->
<@sz.commons.dialog title="${title}">
    <div class="sz-wi-task-approve">
        <div class="header">
            <div class="user-title">审批人</div><div class="user"><input type="text" value="${user}" readonly/></div>
            <div class="dept-title">审批部门</div><div class="dept"><input type="text" value="${dept}" readonly/></div>
        </div>
        <form action="${url('/wiapi/doCompleteTask')}" method="post" data-requiredassignee="${requiredassignee?string}">
            <table>
                <tr>
                    <td class="caption" valign="top" align="right">审批意见</td>
                    <td class="content"><textarea class="comment" name="comment"></textarea></td>
                </tr>
                <tr>
                    <td class="caption" align="right">流程流转</td>
                    <td class="content">
                        <div class="oper">
                            <@sz.commons.radiogroup name="operate" value="jump" options=operateOptions change="sz.wi.api.WITask.changeOperate(event);"/>
                        </div>
                        <div class="options">
                            <#if jumpoptions??>
                                <div class="jumpoptions">
                                    <@sz.commons.listcombobox name="jump" options=jumpoptions/>
                                </div>
                            </#if>
                            <#if rejectoptions??>
                                <div class="rejectoptions">
                                    <@sz.commons.listcombobox name="reject" options=rejectoptions/>
                                </div>
                            </#if>
                        </div>
                    </td>
                </tr>
                <#if assignee>
                    <tr>
                        <td class="caption" align="right">
                            <#if requiredassignee><font color="red">*</font>&nbsp;</#if>执行者
                        </td>
                        <td class="content">
                            <#if selectusermode=="list">
                                <@sz.commons.listcombobox id="nextassignee" name="nextassignee" multiple=assigneemulti options=assigneeoptions/>
                            <#else>
                                <@sz.security.securityselector id="nextassignee" name="nextassignee" multiple=assigneemulti types="MetaUser" title="选择执行者" filters=assigneefilters/>
                            </#if>
                        </td>
                    </tr>
                </#if>
                <#if enableattachment>
                    <tr>
                        <td class="caption" align="right">上传附件</td>
                        <td class="content">
                            <div class="sz-wiapi-approve-upload">
                                <@sz.commons.form.file name="attachments" viewmode="content"/>
                            </div>
                        </td>
                    </tr>
                </#if>
				<tr>
					<td class="caption" align="right">风险点</td>
					<td class="content">
						<div class="sz-wiapi-approve-upload">
							<@sz.commons.button name="risk" caption="录入风险点" click="sz.wi.api.WITask.showRiskDlg()"/>
						</div>
						<input type="hidden" id="RISKID" name="RISKID"/>
					</td>
				</tr>
            </table>
            <input type="hidden" name="form" value="${form}"/>
            <input type="hidden" name="resid" value="${resid}"/>
            <input type="hidden" name="taskid" value="${taskid}"/>
            <textarea class="datas" name="datas">${datas}</textarea>
        </form>
        <div class="history"><@sz.wi.wihistory resid=resid instanceid=instid classsuffix="approve"/></div>
    </div>
    <@script>
        var WITask = sz.sys.namespace("sz.wi.api.WITask");
        
        WITask.showRiskDlg = function(){
        	var url = sz.sys.ctx('/meta/LAWCONT/others/law.js');
        	$.getScript(url, function(){
        		var uid = "";
        		$("textarea.sz-wi-wibaseform-params").each(function(){
					var text = $(this).text();
					var obj = JSON.parse(text);
					if(obj["formsrcname"] == "LC_CONTRACTINFO"){
						var hiera = obj["datahierarchies"];
						/** ORG=X00007&UID=d64dea0ac644404d960fdd49651d2940 */
						var idx = hiera.indexOf("UID=");
						uid = hiera.substring(idx+4);
					}
				});
				
        		var formdata = {"cont_uid":uid, title:"风险点录入"};
        		sz.custom.wi.addFormData("LAWCONT:/workflows/法律业务系统/风险指标管理/RISKLIST",formdata, 730, 420);
        		
        		
        	});
        }
        
        WITask.changeOperate = function(event) {
            var radiogroup = $$(event);
            var $content = radiogroup.basedom().parent().parent();
            var $options = $content.children(".options");
            var $jumpoptions = $options.children(".jumpoptions");
            var $rejectoptions = $options.children(".rejectoptions");
            var v = $$(event).val();
            if (v == "jump") {
                if ($jumpoptions) {
                    $jumpoptions.show();
                }
                if ($rejectoptions) {
                    $rejectoptions.hide();
                }
            } else {
                if ($jumpoptions) {
                    $jumpoptions.hide();
                }
                if ($rejectoptions) {
                    $rejectoptions.show();
                }
            }
        };
        WITask.submit = function(event) {
            var dlg = $$.closest(event, "sz.commons.Dialog");
            var $form = dlg.getHtmlContent().find("form");
            if($form.data("requiredassignee")){
                var nextassignee = $$($form.find("#nextassignee"));
                if(nextassignee && !nextassignee.val()){
                    sz.commons.Alert.show({msg:"您还没有选择下一步执行人"});
                    return false;
                }
            }
            return true;
        };
    </@script>
    <@sz.commons.dialog.button id="submit" onclick="return sz.wi.api.WITask.submit(event)"/>
    <@sz.commons.dialog.button id="cancel"/>
</@sz.commons.dialog>