/**
 * 锁定所有上报数据
 */
function _doLockAll(args){
	var params = args.args;
	var pkeys = params.pkeys;
	var type = params.type;
	var ds = sz.db.getDataSource('default');
	ds.update("update FACT_DQWGDPD set LOCK_=? where LOCK_<?  and  LSH=?",[type,pkeys]);
	copyBudget();
	return "锁定成功";
}

/**
 * 判断是否已经拷贝到这个月了
 * @param {} args
 * @return {}
 */
function copyBudget(){
	var ds = sz.db.getDataSource('default');
	var queryBbqSql = "select max(bbq) from FACT_DQWGDPD";
	var result = ds.select(queryBbqSql);
	var thisMonth = tostr(result[0][0],'yyyymm');
	var nextMonth =tostr(od(today(),'m+1'),'yyyymm');
	var querySql = "select count(1) from FACT_XMYXQD where BBQ = ?";
	
	var result = ds.select(querySql,nextMonth);
	if(result != null && result.length != 0 && result[0] != null && result[0].length != 0 && result[0][0] != null && result[0][0]==0) {
		var insertSql = "insert into FACT_XMYXQD(XMMC,XMBH,SSSCQY,CDBM,XMJZZT,ZTBCSM,HTZT,KHMC,ZCDFZR,ZYJB,XMLX,XMMJ,YWLX,FZZZXM,XMZQ," +
				"XMZYS_YXPZRQ,XMZYS_LXLX,XMZYS_YSRWE,XMZYS_YSCGWXCB,XMZYS_ZMSR,XMZYS_BGRWE,QNDWGZZNF,QNDXMZTWGL,QNDYJSWGE,QNDYJSMSR," +
				"QNDXMKBMFPXX,BNRWMSRZB_SCRWE,BNRWMSRZB_SCMSR,BNRWMSRZB_JZKFPMSR,BNRWMSRZB_SJFPMSR,BNRWMSRZB_KFPMSRPC,BNRWMSRZB_QZDQFY," +
				"BNRWMSRZB_QZBMKFPMSR,BNRWMSRZB_KBMYSFP,SQJSBYSBH,SQJSBYSBBH,SQJSBYSJE,ZTBYSBH,ZTBYSBBH,ZTBYSJE,WLBYSBH,WLBYSBBH,WLBYSJE," +
				"YYXTBYSBH,YYXTBYSBBH,YYXTBYSJE,DZSWBYSBH,DZSWBYSBBH,DZSWBYSJE,SHFBYSBH,SHFBYSBBH,SHFBYSJE,GKXTBYSBH,GKXTBYSBBH,GKXTBYSJE," +
				"JPSYBYSBH,JPSYBYSBBH,JPSYBYSJE,XTYWBYSBH,XTYWBYSBBH,XTYWBYSJE,CPZXYSBH,CPZXYSBBH,CPZXYSJE,BNGSPD_XMZTWGL,BNGSPD_GBMBNWGMSR," +
				"BNGSPD_BNDWGL,BNGSPD_BNWGRWE,BNGSPD_BNWGMSR,HTZXQK_YQXSHTE,HTZXQK_HTBH,HTZXQK_HTMC,HTZXQK_SSHTQSWC,HTZXQK_XMJFLY," +
				"HTZXQK_YHKJE,HTZXQK_HTHKWC,HTZXQK_YQCGHTE,HTZXQK_CGHTQSWC,HTZXQK_YWCFKJE,HTZXQK_CGFKWC,WGDPD_CJDQJS,WGDPD_CJBMJS,WGDPD_XMJDSD," +
				"WGDPD_JSBMGS,WGDPD_BZ,BBQ) select XMMC,XMBH,SSSCQY,CDBM,XMJZZT,ZTBCSM,HTZT,KHMC,ZCDFZR,ZYJB,XMLX,XMMJ,YWLX,FZZZXM,XMZQ,XMZYS_YXPZRQ," +
				"XMZYS_LXLX,XMZYS_YSRWE,XMZYS_YSCGWXCB,XMZYS_ZMSR,XMZYS_BGRWE,QNDWGZZNF,QNDXMZTWGL,QNDYJSWGE,QNDYJSMSR,QNDXMKBMFPXX,BNRWMSRZB_SCRWE," +
				"BNRWMSRZB_SCMSR,BNRWMSRZB_JZKFPMSR,BNRWMSRZB_SJFPMSR,BNRWMSRZB_KFPMSRPC,BNRWMSRZB_QZDQFY,BNRWMSRZB_QZBMKFPMSR,BNRWMSRZB_KBMYSFP," +
				"SQJSBYSBH,SQJSBYSBBH,SQJSBYSJE,ZTBYSBH,ZTBYSBBH,ZTBYSJE,WLBYSBH,WLBYSBBH,WLBYSJE,YYXTBYSBH,YYXTBYSBBH,YYXTBYSJE,DZSWBYSBH,DZSWBYSBBH," +
				"DZSWBYSJE,SHFBYSBH,SHFBYSBBH,SHFBYSJE,GKXTBYSBH,GKXTBYSBBH,GKXTBYSJE,JPSYBYSBH,JPSYBYSBBH,JPSYBYSJE,XTYWBYSBH,XTYWBYSBBH,XTYWBYSJE," +
				"CPZXYSBH,CPZXYSBBH,CPZXYSJE,BNGSPD_XMZTWGL,BNGSPD_GBMBNWGMSR,BNGSPD_BNDWGL,BNGSPD_BNWGRWE,BNGSPD_BNWGMSR,HTZXQK_YQXSHTE,HTZXQK_HTBH," +
				"HTZXQK_HTMC,HTZXQK_SSHTQSWC,HTZXQK_XMJFLY,HTZXQK_YHKJE,HTZXQK_HTHKWC,HTZXQK_YQCGHTE,HTZXQK_CGHTQSWC,HTZXQK_YWCFKJE,HTZXQK_CGFKWC," +
				"WGDPD_CJDQJS,WGDPD_CJBMJS,WGDPD_XMJDSD,WGDPD_JSBMGS,WGDPD_BZ,? as BBQ from  FACT_XMYXQD_WYG where bbq=?";
		ds.update(insertSql,[nextMonth,thisMonth]); 
	}
	
	//update 
	var updateSql = "update to set t0.BNGSPD_BNDWGL = t1.BNGSPD_BNDWGL, t0.BNGSPD_BNWGRWE = t1.BNGSPD_BNWGRWE, t0.BNGSPD_BNWGMSR = t1.BNGSPD_BNWGMSR," +
			"t0.BNGSPD_GBMBNWGMSR = t1.BNGSPD_GBMBNWGMSR from FACT_XMYXQD t0,FACT_DQWGDPD t1 where (t0.bbq=? and t1.bbq=? and  t0.XMBH=t1.XMBH and " +
			"t0.XMMC=t1.XMMC and t0.SSSCQY=t1.SSSCQY)"
	ds.update(updateSql,[nextMonth,thisMonth]);	
}

/**
 * 提交数据
 */
function _doSubmit(args){
	var params = args.args;
	var pkeys = params.pkeys
	var ds = sz.db.getDataSource('default');
	println("_doSubmit:begin");
	println("pkeys:"+pkeys);
	
	var fields = ['submitState_','DQTJ', 'XMBTJ', 'GSLDTJ'];
	var state = 1;
	var user = sz.security.getCurrentUser();
    if (user.isRole('大区')){
		state = 2;
	}
	if (user.isRole('项目')){
		state = 3;
	}
	if (user.isRole('公司领导')){
		state = 4;
	}
	
	var sql = "update FACT_DQWGDPD  set "+fields[state-1]+"= ? where LSH in ("+pkeys+")";
	println("submitSql:"+sql);
	ds.update(sql,'1');
	return {
		result : "success",
		message : "执行成功"
	}
}

function onBeforeUpdateData(args) {
}


$rpt.ondisplay = function($rpt) {
//	var zt = $rpt.comp("zt").val();
//	var isBMRole = sz.utils.parseBoolean("${$user.isRole('部门')}");
//	if (zt == 3 && isBMRole) {
//	}
//	else {
	$rpt.startFill();
//	}
	
	 //初始化可选中行的表格控件
    var $nygk_ynbm = $rpt.getCurrentBodyDom().find("#table1");
	if($nygk_ynbm && sz.commons.SelectableTable){
	   window.nygk_ynbm = sz.commons.SelectableTable.build($nygk_ynbm);
	}
}

$rpt.ondisplayParamPanel = function() {
	/**
	 * 提交
	 */
	window._submit = function() {
		var $dom = nygk_ynbm.$dom;
		var $trs = $dom.find("tr");
		var len = $trs.length;
		var $dataTrs = $trs.slice(4, len - 1);
		if ($dataTrs.length == 0 || ($dataTrs.length == 1 && $dataTrs.find("td:eq(2)").val())) {
			alert("没有要上报的数据");
			return;
		}

		var len = $dataTrs.length;
		var pkeyArr = [];
		for (var i = 0; i < len; i++) {
			var tr = $dataTrs.eq(i);
			var pkey = tr.find("td:first").attr("title");
			if (pkey && pkey != "") {
				pkeyArr.push(pkey);
			}
		}

		if (pkeyArr.length == 0)
			return;

		$rpt.rpc({
			    func		: "_doSubmit",
			    args		: {
				    "pkeys"	: pkeyArr.join(",")
			    },
			    success	: function(feedback) {
				    sz.commons.Alert.show({
					        msg		: ("成功提交"),
					        onok	: function() {
						        $rpt.recalc();
					        }
				        });
			    }
		    })
	}
	
	/**
	 * 全部锁定
	 */
	window._doLockAll = function() {
		var $dom = nygk_ynbm1.$dom;
		if (!$dom.is(":visible")) {
			$dom = nygk_ynbm.$dom;
		}
		var $trs = $dom.find("tr");
		var len = $trs.length;
		var $dataTrs = $trs.slice(4, len - 1);
		if ($dataTrs.length == 0 || ($dataTrs.length == 1 && $dataTrs.find("td:eq(2)").val())) {
			alert("没有要锁定的数据");
			return;
		}

		var len = $dataTrs.length;
		var pkeyArr = [];
		for (var i = 0; i < len; i++) {
			var tr = $dataTrs.eq(i);
			var pkey = tr.find("td:first").attr("title");
			if (pkey && pkey != "") {
				pkeyArr.push(pkey);
			}
		}

		if (pkeyArr.length == 0)
			return;

		$rpt.rpc({
		    func		: "_doLockAll",
		    args		: {
			    "pkeys"	: pkeyArr.join(","),
			    "type"	: "1"
		    },
		    success	: function(feedback) {
			    sz.commons.Alert.show({
				        msg		: ("锁定成功"),
				        onok	: function() {
					        $rpt.recalc();
				        }
			        });
		    }
	    })
	}
	
	/**
	 * 项目完工
	 */
	window._doLockMonth = function(pkey,type) {
		$rpt.rpc({
		    func: "_doLock",
		    args: {
		      "pkey": pkey,
		      "type": type
		    },
		    success: function(result) {
		      	sz.commons.Alert.show({
					msg:result,
					title:'信息',
					type:sz.commons.Alert.TYPE.INFO
				});
		    }
		})  
	}
}



function onBeforeReportCalc(args) {
    var rpt = args.report;
    println(rpt.condStyleMgr);
}
