/**
 * 可选中表格中一行或多行的表格控件 默认只能选中一行，要启用多选，请在执行控件的build方法后执行setMulti(true)
 */
(function($) {
	var widlg = sz.sys.namespace("sz.custom.wi");
	
	widlg.showWIFormDialog = function(residOrPath, formdata, width, height, exJson, callbackfunc) {
		var self = this;
		/**
		 * url1:"/wiapi/form/showStartForm"
		 * url2:"/wiapi/form/showForm"
		 */
		if (!self.formDlg) {
			self.formDlg = sz.commons.Dialog.create();
		}

		var datas = {
			resid : residOrPath,
			alias : "STARTFORM",
			openmode : "dialog",
			ownerid : residOrPath + "$STARTFORM",
			"width" : width,
			"height" : height,
			formdatas : JSON.stringify(formdata)
		};
		
		$.extend(datas, exJson);
		
		var url="/wiapi/form/showStartForm";
		if(exJson && exJson["url"]){
			url = exJson["url"];
		}
		
		widlg.on_callback = callbackfunc;
		
		this.formDlg.showHtml({
					url : sz.sys.ctx(url),
					data : datas	
				});
		
		this.formDlg.one(sz.commons.Dialog.EVENTS.SHOW, function() {
					$$(self.formDlg.getHtmlContent().find(".sz-wi-component"));
				});
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
	 * 删除from表单数据，该数据和流程没关系
	 */
	widlg.deleteFormData = function(jsonObj){
		/**
		 * TODO 目前都是使用工作流表单进行删除，待以后根据需要在实现
		 */
		var url = sz.sys.ctx("/cidatamgr/delete");
		//$.post();
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
		this.taskDlg.setTitle(sz.sys.message("正在打开对话框..."));
		return this.taskDlg;
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
			"keys":keys,
			"success":success
		};
		
		var dlg = this._getDialog();
		dlg.callback = args.success || function() {
			window.location.reload();
		};
		var params = JSON.stringify(args);
		dlg.showHtml({
			url : sz.sys.ctx("/wiapi/deleteFormDatas"),
			data : {
				params:params
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