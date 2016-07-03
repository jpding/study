/**
 * 110定时抽取通知
 */
var sms = sz.getBean(com.succez.customer.hbgsxtjg.web.pages.smsverify.SmsService);

function main(){
	if(sz.sys.isMasterNode()){
		runetl();
	}
}

function runetl(){
	println("run 10m ETL 抽取监控");
	var conRun = true;
	try{
		var ds = sz.db.getDataSource("hbgsods");
		var sql = "select start_time from HBGSBI.LOG_ETL where proc_nam='p_tpcs2ods' and to_char(start_time,'yyyymmdd')=? and to_char(sysdate, 'hh24')>='19'";
		var rq = tostr(today(), 'yyyymmdd');
		var t1 = ds.select1(sql, rq);
		if(t1){
			println(sms.sendVerifyCodeSms("error", "18602710153", "110任务启动!"));
			//println(sms.sendVerifyCodeSms("error", "13308634746", "中间库抽取出错!"));
			conRun = false;
		}
	}catch(e){
		println(e);
		try{
			println(sms.sendVerifyCodeSms("error", "18602710153", "110监控出错!"));
			//println(sms.sendVerifyCodeSms("error", "13308634746", "中间库抽取出错!"));
		}catch(ex){
			println(ex);
		}
	}
	
	var thehour = hour(now());
	/**
	 * 凌晨5点~6点之间是计划任务启动的本脚本，此时才启动自循环，12点之后此脚本不再自循环，等计划任务再次激活它
	 */
	if (thehour>=21 && thehour<=23 && conRun){
		sz.sys.schedule({
			resid:$currentpath,
			method:"runetl",
			delay:600*1000
		});
		println("启动下次定时执行计划，10m后执行");
	}
}