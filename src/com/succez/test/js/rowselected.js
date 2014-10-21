(function($) {
	var selTable = sz.sys.namespace("sz.custom.cssc");
	
	/**
	 * 重新初始化，当编辑、删除相关表单后，当前表单需要refresh，而refresh时的内容
	 * 时table的样式会丢失，故需要重建
	 */
	selTable.initSelectedTable = function(rpt, tableId){
		var selectTable = rpt.getCurrentBodyDom().find("#"+tableId);
		var selectTableObj = sz.commons.SelectableTable.createSelectable(selectTable);
		
		rpt.$seltable = selectTableObj;
		
		return selectTableObj;
	}
	
	selTable.autoInitSelectdTable=function(){
		$rpt.ondisplay = function(){
			var tableNames = [];
			for(var i=1; i<20; i++){
				tableNames.push("table"+i);
			}
			
			for(var i=1; i<5; i++){
				tableNames.push("rpt"+i);
			}
			
			for(var i=0; i<tableNames.length; i++){
				var table = tableNames[i];
				var selectTable = $rpt.getCurrentBodyDom().find("#"+table);
				if(selectTable && selectTable.length>0){
					sz.commons.SelectableTable.createSelectable(selectTable);
				}
			}
			
			if($rpt.ondisplayEx){
				$rpt.ondisplayEx($rpt);
			} 
		}
	}
	
	/**
	 * 扩展jQuery函数，便于实现报表进行选择功能
	 */
	$.extend({
		wiSelTable : function(rpt, tableId){
			rpt.ondisplay = function(obj){
				sz.custom.cssc.initSelectedTable(rpt, tableId);
			}
			
			rpt.on("calcsuccess", function(obj){
				sz.custom.cssc.initSelectedTable(rpt, tableId);
			});
		},
		
		selectedTable : function(rpt, tableId){
			sz.custom.cssc.initSelectedTable(rpt, tableId);
		}
	});
	
	/**
	 * 行选择Table
	 */

	if (sz.commons.SelectableTable)
		return;
	var SelectableTable = sz.sys.createClass("sz.commons.SelectableTable",
			"sz.commons.ComponentBase");

	SelectableTable.createSelectable = function(pdom) {
		return sz.commons.SelectableTable.create(pdom);
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
	 * 此方法是SelectableTable.build需要调用的，用于从已有的DOM元素来构造与初始化列表控件，支持的DOM结构见类的注释
	 * 
	 * BI-11258 不能使用build，由于报表有个prst.Table对象绑定的在报表上，如果使用build会导致后一个对象覆盖前一个对象
	 *    故这里使用init，并且依据succezCore.js中的_createInstance代码中_cacheInstance的实现来避开把当前对象绑定到
	 *    报表
	 *    
	 *  if (inst.$dom) {
	 *		_cacheInstance(inst.$dom, inst);
	 *	}
	 * 
	 * @private
	 * @param {Element,jQuery}
	 *            p 元素对象或者jQuery选择器对象
	 */
	SelectableTable.prototype.init = function(p) {
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
	
	SelectableTable.prototype.doAfterInit = function(args){
		this.$dom = args;
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

sz.custom.cssc.autoInitSelectdTable();