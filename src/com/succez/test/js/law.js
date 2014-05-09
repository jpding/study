/**
 * 可选中表格中一行或多行的表格控件 默认只能选中一行，要启用多选，请在执行控件的build方法后执行setMulti(true)
 */
(function($) {
	var widlg = sz.sys.namespace("sz.custom.wi");
	
	widlg.showWIFormDialog = function(residOrPath, formdata, width, height, exJson, callbackfunc) {
		/**
		 * url1:"/wiapi/form/showStartForm"
		 * url2:"/wiapi/form/showForm"
		 */
		if (!window.formDlg) {
			window.formDlg = sz.commons.Dialog.create();
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
		
		window.formDlg.showHtml({
					url : sz.sys.ctx(url),
					data : datas,
					load : function() {
						$$(sz.commons.DialogMgr.getTopDlg().getHtmlContent()
								.find(".sz-wi-component"));
					},
					
					cancel : function() {
					}
					
				});
	}
	
	widlg.initSelectedTable = function(rpt, tableId){
		var selectTable = rpt.getCurrentBodyDom().find(tableId);
		return sz.commons.SelectableTable.build(selectTable);
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