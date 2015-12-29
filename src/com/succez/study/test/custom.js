function oninitfillforms(fillforms) {
	fillforms.on("aftereditcell", function(event) {
		    var form = cifillforms.getActiveForm();
		    var formName = form.getName();
		    var selectInf = form.getSelectInf();
		    var compid = selectInf.compid;
			if(!compid) return;
		    var fieldName = selectInf.compinf.dbfield;
		    if (!fieldName) {
			    return;
		    }
		    fieldName = fieldName.toUpperCase();
		    var rule = getLimitCheck(formName.toUpperCase(), fieldName);// 获取极值规则
		    if (!rule) {
			    return;
		    }
		    var legal;

		    // var rule=['数据范围是5到8','[5:8]']
		    var param = selectInf.val();// 当前编辑单元格的值
		    if (param == null || param == "") {
			    fillforms.cancelOutstandComponent();
		    }
		    else {
			    var exp = rule.exp;
			    legal = param_exp(param, exp);// 判断当前单元格的值是否符合表达式规则

			    if (!legal) {
				    // 将其他可编辑单元格禁用
				    var inf = {
					    "formName"				: formName,
					    "compid"					: compid,
					    cfg_outstandbody	: true
				    };
				    fillforms.outstandComponent(inf);
				    // 3 .弹出confirm对话框
				    sz.commons.Alert.show({
					        type	: sz.commons.Alert.TYPE.WARNING,
					        msg		: rule.hints,
					        onok	: function() {
						        setTimeout(function() {
							            fillforms.startEditComponent(inf);
						            }, 1);

					        }
				        });
			    }
			    else {
				    // 将禁用的可编辑单元格解锁
				    fillforms.cancelOutstandComponent();
			    }
		    }

	    });
}

function oninitdatapanel($cidatapanel) {
	var limitCheckUrl = sz.sys.ctx("/meta/SCWSZBCI/analyses/limitcheck/limitcheck.action");
	$.post(limitCheckUrl, {
		    taskid	: cidatamgr.formsjson.taskid
	    }, function(result) {

		    if (typeof(result) == "string") {
			    window.rulevalues = JSON.parse(result);
		    }
		    else {
			    window.rulevalues = result;
		    }
	    });
}

/**
 * 根据字段名和表单名获取规则
 * @param {} formName
 * @param {} zdName
 * @return {}
 */
function getLimitCheck(formName, fieldName) {
	var rule = [];
	var form = window.rulevalues[formName];
	if (!form) {
		return null;
	}
	return form[fieldName];
}

/**
* 单元格的值和表达式定义的范围作比较,返回是否值是否合法
* @param {} param 单元格的值
* @param {} exp [6:10],(~:5)
*/
function param_exp(param, exp) {
	var legal = false;// 单元格的值是否合法
	var exp_str = exp.toString();
	var start = exp_str.indexOf('[') != -1 ? exp_str.indexOf('[') : exp_str.indexOf('(')
	var mid = exp_str.indexOf(':');
	var end = exp_str.indexOf(']') != -1 ? exp_str.indexOf(']') : exp_str.indexOf(')')

	if (start != -1 && mid != -1 && end != -1) {

		var lp = exp_str.indexOf('[') != -1 ? '[' : '(';
		var lv = exp_str.substring(start + 1, mid);
		var rv = exp_str.substring(mid + 1, end);
		var rp = exp_str.indexOf(']') != -1 ? ']' : ')';

		if (lv == '~') {
			// [(~,6],(~,6)
			legal = rp == ']' ? param <= rv : param < rv;
		}
		else {
			// [6,~],[6，9]
			if (rv == '~') {
				legal = lp == '[' ? param >= lv : param > lv;
			}
			else {
				var legal1;
				var legal2;
				legal1 = lp == '[' ? param >= lv : param > lv;
				legal2 = rp == ']' ? param <= rv : param < rv;
				legal = (legal1 && legal2);
			}
		}

	}
	return legal;
}
