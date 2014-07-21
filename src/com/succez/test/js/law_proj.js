/**
 * 可选中表格中一行或多行的表格控件 默认只能选中一行，要启用多选，请在执行控件的build方法后执行setMulti(true)
 */
(function($) {
	var widlg = sz.sys.namespace("sz.custom.wi");
	
	/**
	 * exJson 传递showForm相关参数，查看详情的时候是使用showForm来实现的，不需要保存按钮
	 * 
	 * {hidebutton:"xxx"}
	 * {showbutton:"xxx"}
	 * 
	 */
	widlg.showWIFormDialog = function(residOrPath, formdata, width, height, exJson, callbackfunc) {
		var self = this;
		if(callbackfunc){
			sz.custom.wi.on_callback=callbackfunc;
		}
		
		var hiddenButton = formdata['hiddenbutton'];
        
		formdata['hiddenbutton'] = null;
		delete formdata['hiddenbutton']; 
		
		var datas = {
			resid : residOrPath,
			form : "STARTFORM",
			openmode : "dialog",
            width : width,
			height : height,
			ownerid : residOrPath + "$STARTFORM",
			datas : JSON.stringify(formdata)
            //success:"sz.custom.wi.callback();"
		};
		
		$.extend(datas, exJson);
		
		var url="/wiapi/form/showStartForm";
		if(exJson && exJson["url"]){
			url = exJson["url"];
		}
		
		/**
		 * url1:"/wiapi/form/showStartForm"
		 * url2:"/wiapi/form/showForm"
		 */
		if (!this.formDlg) {
			this.formDlg = sz.commons.Dialog.create();
			this.formDlg.one(sz.commons.Dialog.EVENTS.SHOW, function() {
					var htmlContent = self.formDlg.getHtmlContent();
					$$(htmlContent.find(".sz-wi-component"));
					if(hiddenButton){
						setTimeout(function(){
							self.formDlg.$dom.find(".sz-commons-button").each(function(){
									var btn = $(this);
									var id = btn.attr("id");
									if(hiddenButton.indexOf(id)>-1){
										btn.hide();
									}
								}
							);	
						}, 150);
					}
				});
		}
		
		//this.setParams({"title":"对话框"});
		
		this.formDlg.show({
					url : sz.sys.ctx(url),
					data : datas,
                    width  : width,
			        height : height
				});
	}
	
	/**
	 * 新增一条数据
	 */
	widlg.addFormData = function(wiPath,formData, width, height, callback){
		widlg.showWIFormDialog(wiPath, formdata, width, height, null, callback);
	}
	
	/**
	 * 查看数据
	 */
	widlg.showFormData = function(wiPath,formData, width, height){
		formData["url"]="/wiapi/form/showForm";
		if(!formData["businesskey"]){
			sz.commons.Alert.show({
			    type	: sz.commons.Alert.TYPE.WARNING,
			    msg		: "请选择一行数据"
		    });
			return ;
		}
		widlg.showWIFormDialog(wiPath, null, width, height, formData);
	}
	
	/**
	 * 修改数据
	 */
	widlg.modifyFormData = function(wiPath,formData, width, height, callback){
		formData["url"]="/wiapi/form/showForm";
		if(formData["selectedtable"]){
			if(!formData["businesskey"]){
				sz.commons.Alert.show({
				    type	: sz.commons.Alert.TYPE.WARNING,
				    msg		: "请选择一行数据"
			    });
				return ;
			}
		}
		
		widlg.showWIFormDialog(wiPath, null, width, height, formData, callback);
	}
	
	/**
	 * 重新初始化，当编辑、删除相关表单后，当前表单需要refresh，而refresh时的内容
	 * 时table的样式会丢失，故需要重建
	 */
	widlg.initSelectedTable = function(rpt, tableId){
		var selectTable = rpt.getCurrentBodyDom().find("#"+tableId);
		return sz.commons.SelectableTable.build(selectTable);
	}
	
	widlg.refreshAndInitSelectedTable = function(rpt, tableId){
		
	}
	
	/**
	 * 钻取后返回上一次钻取
	 */
	widlg.drillback = function() {
		var drill = $(".sz-bi-prst-drillpath").children("li").eq(-2).find("a")
				.attr("href");
		var leftBr = drill.indexOf("(");
		var rightBr = drill.indexOf(")");
		var obj = eval(drill.substring(leftBr, rightBr + 1));
		szshowresult(obj);
	}
	
	/**
	 * var pdom = $("#xxx");
	 * var url  = sz.sys.ctx("/wiapi/form/showForm");
	 * var data = {resid:6717469,form:'MAINTAIN',businessKey:'8f85572bc1264e82905be14034890ac0'}
	 * 
	 * 将外部链接的内容显示在指定的控件中
	 * args是json对象，包含以下属性：
	 * pdom  
	 * url
	 * data  {obj:'',dd:''}
	 */
	widlg.showHtml = function(pdom, url, data, success, fail) {
		$.ajax({
			"url" : url,
			cache : false,
			dataType : "html",
			"data" : data,
			success : function(form) {
				if (!form) {
					sz.commons.Alert.show({
								msg : "表单内容不存在，请确认绑定了正常的表单？"
							});
					return;
				}
				sz.utils.setInnerHTML(form, pdom, function() {
							$$(pdom.find(".sz-wi-component"));
							success && success();
						});
			},
			error : function() {
				if (fail) {
					fail();
				}
			}
		});
	};
	
	/**
	 * 嵌入外部的网页到系统中
	 */
	widlg.showIFrame = function(args){
		//TODO
	}

	/**
	 * 在报表里面不能直接调用sz.wi.api下面的js代码 copy wiapi.js相关函数
	 */
	/**
	 * 获取对话框，该对话框应该是一个单例的，避免重复创建多个对话框
	 */
	widlg._getDialog = function() {
		if (!this.taskDlg) {
			this.taskDlg = sz.commons.Dialog.create();
		}
		this.taskDlg.setParams({"title":sz.sys.message("正在打开对话框...")});
		return this.taskDlg;
	}
	
	
	/**
	 * 
	 */
	widlg.deleteFormData = function(wiPath, rpt){
		/**
		 * TODO 目前都是使用工作流表单进行删除，待以后根据需要在实现
		//var url = sz.sys.ctx("/cidatamgr/delete");
		var performId = planDetailTable.getSelectedRowCellHint(0);
		sz.custom.wi.deleteWIFormData("LAWCONT:/workflows/法律业务系统/CONT_PROJ", "STARTFORM", performId, function(){
			sz.custom.wi.refreshcomp($rpt,"table1","lt_0.A3");
		});
		*/
		
	}
	
	/**
	 * 删除流程表单数据，调用该方法时，和该流程表单相关联的数据都会一起删除
	 * {"resid":6488093,"form":"MAINTAIN","keys":["3130f575-553b-4366-9a19-03b89220d0ae"]}
	 * @resid 工作流的资源ID，一般调用时传递路径
	 * @formAlias 工作流对应表单的别名
	 * @keys keys是待删除该表单主键的列表，是一个数组
	 */
	widlg.deleteWIFormData = function(resid, formAlias, key, success){
		var keys = [];
		keys.push(key);
		
		var args = {
			"resid":resid,
			"form":formAlias,
			"businesskeys":keys,
			"success":success
		};
		
		var dlg = this._getDialog();
		dlg.func = args.success || function() {
			window.location.reload();
		};
		dlg.showHtml({
			url : sz.sys.ctx("/wiapi/deleteFormDatas"),
			data : {
                               resid:args.resid,
                               params:JSON.stringify(args)
                        }
		});
	}
		
	
	/**
	 * 在工作流表单脚本中调用
	 */
	widlg.saveFormCallback = function(){
		var topDlg = sz.commons.DialogMgr.getTopDlg();
		if(sz.custom.wi.on_callback){
			sz.custom.wi.on_callback();
		}
		topDlg.close();
	}
	
	widlg.refreshcomp = function(rpt, compid, target){
		//$sys_target:"lt_0.A3"
		//$sys_targetComponent
		var refreshParams = {"$sys_customparameters":"$sys_disableCache=true","$sys_targetComponent":compid};
		if(target){
			$.extend(refreshParams, {"$sys_target":target});
		}
		rpt.refreshcomponents(refreshParams);
	}
	
	
	/**
	 * 行选择Table
	 */

	if (sz.commons.SelectableTable)
		return;
	var SelectableTable = sz.sys.createClass("sz.commons.SelectableTable",
			"sz.commons.ComponentBase");

	SelectableTable.createSelectable = function(tableid) {
		var selectTable = $rpt.getCurrentBodyDom().find(tableid);
		return sz.commons.SelectableTable.build(selectTable);
	}

	SelectableTable.DEFAULT_ARGS = {
		/**
		 * @arg{String} 控件的唯一标识
		 */
		"id" : null
	};

	SelectableTable.EVENTS = {
		/**
		 * 选择了列表中一行的事件
		 */
		SELECT : "select"
	};

	/**
	 * 初始化控件的界面元素
	 * 
	 * @method
	 * @param{Object} args 属性配置
	 */
	SelectableTable.prototype.init = function(args) {
		SelectableTable.superClass.prototype.init.apply(this, arguments);
	};

	/**
	 * 此方法是SelectableTable.build需要调用的，用于从已有的DOM元素来构造与初始化列表控件，支持的DOM结构见类的注释
	 * 
	 * @private
	 * @param {Element,jQuery}
	 *            p 元素对象或者jQuery选择器对象
	 */
	SelectableTable.prototype.build = function(p) {
		SelectableTable.superClass.prototype.build.apply(this, arguments);
		this.$dom = p;
		this.multi = false; // 默认只能选择一行

		var self = this;
		var $trs = p.find("tr:gt(1)");
		$trs.bind({
					"click" : function(event) {
						var $rs = $(event.target || event.srcElement);
						var $tr = $(this);

						if (self.multi) {
							$tr.toggleClass("list-onselect");
						} else {
							self.cancelSelected();
							$tr.addClass("list-onselect");
						}
						self.fire('select', {
									$tr : $tr
								})
					}
				});
		$trs.bind({
					"mouseenter" : function(event) {
						var $tr = $(this);
						$tr.addClass("list-onmouseover");
					}
				});
		$trs.bind({
					"mouseleave" : function(event) {
						var $tr = $(this);
						$tr.removeClass("list-onmouseover");
					}
				});
	}

	/**
	 * 设置表格是否能多选
	 */
	SelectableTable.prototype.setMulti = function(enable) {
		this.multi = enable;
	}

	/**
	 * 取消选定行
	 */
	SelectableTable.prototype.cancelSelected = function() {
		this.$dom.find(".list-onselect").removeClass("list-onselect");
	}

	/**
	 * 当前已选中的行数（本控件暂时只支持选中一行）
	 */
	SelectableTable.prototype.selectedCount = function() {
		var rows = this.$dom.find(".list-onselect");
		return rows.length;
	}

	/**
	 * 获取选定的行的某个单元格的值
	 */
	SelectableTable.prototype.getSelectedRowCellValue = function(index) {
		if (this.multi)
			return this._getSelectedRowCellValue_m(index);
		else
			return this._getSelectedRowCellValue_s(index);
	}

	/**
	 * 获取选定的行的某个单元格的值(单选模式)
	 */
	SelectableTable.prototype._getSelectedRowCellValue_s = function(index) {
		var rows = this.$dom.find(".list-onselect");
		if (rows.length == 0)
			return null;
		var cells = rows.children("td");
		if (cells.length < index + 1)
			return null;
		else
			return cells.eq(index).text();
	}

	/**
	 * 获取选定的行的某个单元格的值(多选模式)
	 */
	SelectableTable.prototype._getSelectedRowCellValue_m = function(index) {
		var rows = this.$dom.find(".list-onselect");
		if (rows.length == 0)
			return [];

		var result = [];
		rows.each(function(i) {
					var cells = $(this).children("td");
					if (cells.length >= index + 1)
						result.push(cells.eq(index).text());
				});
		return result;
	}

	/**
	 * 获取选定的行的某个单元格的hint提示
	 */
	SelectableTable.prototype.getSelectedRowCellHint = function(index) {
		if (this.multi)
			return this._getSelectedRowCellHint_m(index);
		else
			return this._getSelectedRowCellHint_s(index);
	}

	/**
	 * 获取选定的行的某个单元格的hint提示(单选模式)
	 */
	SelectableTable.prototype._getSelectedRowCellHint_s = function(index) {
		var rows = this.$dom.find(".list-onselect");
		if (rows.length == 0)
			return null;
		var cells = rows.children("td");
		if (cells.length < index + 1)
			return null;
		else
			return cells.eq(index).attr("title");
	}

	/**
	 * 获取选定的行的某个单元格的hint提示(多选模式)
	 */
	SelectableTable.prototype._getSelectedRowCellHint_m = function(index) {
		var rows = this.$dom.find(".list-onselect");
		if (rows.length == 0)
			return [];

		var result = [];
		rows.each(function(i) {
					var cells = $(this).children("td");
					if (cells.length >= index + 1)
						result.push(cells.eq(index).attr("title"));
				});
		return result;
	}
})(jQuery);

/**
 * 显示法律知识库中单条法律条文的页面，通过传递进去主键pkey，显示法规的内容出来
 * @param {} name
 * @param {} onOk
 */
window._showLawContentPage = function(pkey,tableName,onOk){
	var dlg = window.showLawContentDlg;
	if (!dlg){
		dlg =  window.showLawContentDlg = sz.commons.Dialog.create();
	}
	
	dlg.showHtml({
		url : sz.sys.ctx(encodeURI("/meta/LAWCONT/others/knowlege/展示页面/showPage.action?method=showLawContent")),
		data : {
			pkey : pkey,
			tbName : tableName
		}
	})
	dlg.one(sz.commons.Dialog.EVENTS.OK,function(){
		if (typeof(onOk) == "function"){
			onOk();
		}
		return true;
	})
}

/**
 * 提交的时候更新内容字段，更新的依据是pkey
 * @param nameId 名称字段的id，如rpt1.A2等
 * @param valueId 内容字段的id，如rpt1.A3等
 */
window._doSubmitLaw = function($rpt,nameId,tbName){
	var nameObj = $rpt.comp(nameId);
	if (!nameObj) return;
	var name = nameObj.val();
	if (!name || name == ""){
		alert("请输入标题");
		return;
	}
	
	var pkey = nameObj.basedom().attr("title");
	
	$rpt.submitFill({
	   forceUpdateAll : true,
	   success : function(){
	   		var value = window.uSuccezEdit.getContent();
	   		if (value && value!=""){
		   		$rpt.rpc({
		   			func        : "doUpdateContent",
		            args        : {
		                val    :  value,
		                pkey	: pkey,
		                tbName : tbName
		            },
		            success : function(feedback) {
		                $rpt.recalc();
		                window.close();
		            }
		   		})
	   		}else{
	   			$rpt.recalc();
	   		}
	   }
	})
}

/**
 * 打开修改对话框
 */
window.openUpdateDialog = function(pkey,tbPath) {
	$rpt.drill({
	    $sys_drillto:tbPath,
	    $sys_needFilter:false,
	    $sys_passparameters:false,
	    $sys_customparameters:"$pkey=" + pkey,
    	$sys_target:"blank"
	})
}

window.doDeleteData = function(pkey,tb){
	if (window.confirm("确认要删除吗？")){
		$rpt.rpc({
			func        : "doDeleteData",
	        args        : {
	            pkey	: pkey,
	            tbName : tb
	        },
	        success : function(feedback) {
	            $rpt.recalc();
	            sz.commons.Alert.show({msg:"删除成功"})
	        }
		})
	}
}

/**
 * 根据主键从服务器请求内容回来，并显示到页面中的特定位置上
 * @param {} $rpt
 * @param {} pkey
 * @param {} tb
 * @param {} targetId
 */
window.getContentAndShow = function($rpt,pkey,tb,targetId){
	var targetObj = $rpt.comp(targetId);
	if (!targetObj){
		sz.commons.Alert.show({msg:"请指定显示内容的目的表元"})
	}
	
	$rpt.rpc({
		func        : "doShowContentToTarget",
        args        : {
            pkey	: pkey,
            tbName : tb
        },
        success : function(content) {
           targetObj.$dom.html(content);
        }
	})
}

window.getUEditor = function(params){
	window.UEDITOR_HOME_URL = sz.sys.ctx("/meta/LAWCONT/others/knowlege/ueditor1_3_6-utf8-jsp/");
	var urlPath =  sz.sys.ctx("/meta/LAWCONT/others/knowlege/ueditor1_3_6-utf8-jsp/ueditor.all.js");	
	$.getScript(urlPath,function(){
		var editID = params.editID;
		var $rpt = params.$rpt;
		var pkeyDom = params.pkeyDom;
		var tbName = params.tbName;
		
		var edit = window.uSuccezEdit = window.UE.getEditor(editID);
		var pkey = $rpt.comp(pkeyDom).basedom().attr("title");
		if (pkey == "") return;
		$rpt.rpc({
			func : "doGetContentForShow",
			args : {
				pkey : pkey,
				tbName : tbName
			},
			success : function(feedback){
				if (feedback && feedback != ""){
					edit.setContent(feedback);
				}
			}
		})
	})
}

window._doAddDimTreeToPanel = function($rpt,params){
	var _pdomId = params.pDomId;
	var execFunc = function($rpt,params){
		var dimtree_hgsj =sz.bi.dw.DimensionTree.create({
			pdom:$("#"+_pdomId),
			multiple:false,
			showLine :false,
			displayformat:"@txt",
			showIcon:false,
			callback:{
				onClick : function(event, treeId, treeNode){
					var typecode = treeNode.value;
					$rpt.refreshcomponents({
						"$sys_target":params.refTarget,
						"$sys_customparameters":"$typecode='"+typecode+"'",
						"$sys_targetComponent":params.refComp
					});
				}
			}
		});
		var ajaxUrl = this.constructor.ajaxUrl ? this.constructor.ajaxUrl.listChildrenUrl : null;
		if(!ajaxUrl){
			ajaxUrl = "/sz/bi/dw/dimcombobox/listchildren_dim";
		};
	
		dimtree_hgsj.setListChildrenUrl(ajaxUrl);
		var ajaxExpandUrl = this.constructor.ajaxUrl ? this.constructor.ajaxUrl.expandNodeUrl : null;
		if(!ajaxExpandUrl){
			ajaxExpandUrl = "/sz/bi/dw/dimcombobox/expandchildren_dim";
		}
		dimtree_hgsj.setExpandNodeUrl(ajaxExpandUrl);
		dimtree_hgsj.setRootId(params.dimPath);
		var uId = params.uId;
		if (uId){
			dimtree_hgsj.expandByUid(uId);
		}
	}
	var urlPath =  sz.sys.ctx("/meta/LAWCONT/others/knowlege/页面相关的js/dimTree.js");
	$.getScript(urlPath,function(){
		execFunc($rpt,params);	
	});
}