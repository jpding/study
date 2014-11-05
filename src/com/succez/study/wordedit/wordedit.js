var WebUtils = com.succez.commons.util.WebUtils;
var IOUtils  = com.succez.commons.util.io.IOUtils;
var Document = com.aspose.words.Document;
var ProtectionType = com.aspose.words.ProtectionType;
var NumberUtils   = com.succez.commons.util.NumberUtils;
var ActionUtils = com.succez.commons.webctrls.domain.ActionUtils;

com.succez.bi.activedoc.impl.aspose.AsposeUtil.licence();

/**
 * word操作Action，主要支持如下功能：
 * 1.保存word
 * 2.word强制留痕
 * 3.word只读
 * 
 * 显示方式：IE下用插件显示、非IE下直接使用html
 * 
 * 1.主要是打开事实表中的word，必须传递如下参数：
 *    facttable 事实表名
 *    keyfield  主键名
 *    keys      主键的值
 *    wordfield word存储的字段
 *    wordname  word文件名     可以不用传递 
 *    
 * /meta/LAWCONT/others/test/word/wordedit.action?method=open&facttable=27262991&keyfield=UID&keys=23141f39c6a44efb81aaae0e276bb1a2&wordfield=ATTACHMENT1   
 */

function main(args){
	var obj = {facttable:"27262991",keyfield:"UID",keys:"23141f39c6a44efb81aaae0e276bb1a2",wordfield:"ATTACHMENT1"};
	//var obj = {facttable:"27262991",keyfield:"UID",keys:"CSSC",wordfield:"ATTACHMENT1"};
	var ins = getWordInputStream(obj);
	println(ins);
}

/**
 * 只读打开word
 */
function openOnlyRead(req, res){
	println("=======================");
	res.attr("downloadtype",ProtectionType.READ_ONLY);
	return "wordedit.ftl";
}

/**
 * 强制留痕的方式打开
 * @param {} req
 * @param {} res
 */
function openTrack(req, res){
	res.attr("downloadtype",ProtectionType.ALLOW_ONLY_REVISIONS);
	return "wordedit.ftl";
}

/**
 * /meta/LAWCONT/others/test/word/wordedit.action?method=open&facttable=xxx&keyfield=xxx&keys=xxx&wordfield=xxxx
 * /meta/LAWCONT/others/test/word/wordedit.action?method=open&facttable=27262991&keyfield=UID&keys=CSSC&wordfield=ATTACHMENT1
 * 普通方式打开
 * @param {} req
 * @param {} res
 */
function open(req, res){
	res.attr("downloadtype","-1");
	return "wordedit.ftl";
}

/**
 * word文档存储
 * @param {} req
 * @param {} res
 */
function save(req, res){
}

/**
 * /meta/LAWCONT/others/test/word/wordedit.action?method=downloadword&facttable=xxx&keyfield=xxx&keys=xxx&wordfield=xxxx
 * /meta/LAWCONT/others/test/word/wordedit.action?method=downloadword&facttable=27262991&keyfield=UID&keys=23141f39c6a44efb81aaae0e276bb1a2&wordfield=ATTACHMENT1
 * 
 * UID=
 * 		ProtectionType.ALLOW_ONLY_COMMENTS;
		ProtectionType.ALLOW_ONLY_FORM_FIELDS;
		ProtectionType.ALLOW_ONLY_REVISIONS;
		ProtectionType.READ_ONLY;
		ProtectionType.NO_PROTECTION;
 * @param {} req
 * @param {} res
 */
function downloadword(req, res){
	println("=================================");
	
	var params = getDownloadParam(req);
	var ins = getWordInputStream(params);
	
	try{
		
		com.succez.commons.webctrls.domain.ActionUtils.setHeaderForDownload(res, req.getHeader("USER-AGENT"), "application/msword",
				"utf-8", null, "word.doc");
		
		var input = java.io.BufferedInputStream(ins);
		var out = res.getOutputStream();
		try {
			var downloadtype = NumberUtils.toInt((params.downloadtype+""), -1);
			println("downloadtype==========:"+downloadtype);
			if(downloadtype == -1){
				IOUtils.copy(input, out);
			}else{
				var doc = new Document(input);
				if(downloadtype == ProtectionType.ALLOW_ONLY_REVISIONS){
					doc.setTrackRevisions(true);
				}
				doc.protect(downloadtype);
				//1 doc  8 docx
				doc.save(out,1);
			}
		}
		finally {
			out.close();
		}
	}finally{
		ins.close();
	}
}

function getDownloadParam(req){
	var obj = {};
	obj.facttable = req.facttable;
	obj.keyfield = req.keyfield;
	obj.keys = req.keys;
	obj.wordfield = req.wordfield;
	obj.wordname = req.wordname;
	obj.downloadtype = req.downloadtype;
	return obj;
}

/**
 * 获取事实表中的word流
 * @param {} factTable  事实表全路径
 * @param {} keyfield
 * @param {} keys
 * @param {} wordField
 * @param {} wordName
 */
function getWordInputStream(args){
	var factTable = args.facttable;
	var keyfield = args.keyfield;
	var keys = args.keys;
	var wordField = args.wordfield;
	var wordName = args.wordname;
	var entity = sz.metadata.get(factTable);
	if(entity == null){
		throw new Error('元数据中不存在事实表：'+factTable);
	}
	var factObj = entity.getObject();
	var dsName = factObj.getDataSourceName();
	var ds = sz.db.getDataSource(dsName);
	
	var dbTableName = factObj.getDbTable();
	println("事实表："+factTable+";数据库表："+dbTableName);
	
	//验证字段TODO
	var dialect = ds.getDialect();
	
	var sql = "select "+wordField+" from "+dbTableName+" where " + dialect.quote(keyfield) +"=?";
	var rs = ds.select(sql, keys);
	println(sql);
	if(!rs || rs.length == 0 ){
		throw new Error('事实表：'+factTable+"中不存在主键："+keyfield+"："+keys+"的数据");
	}
	
	var blob = rs[0][0];
	return blob.getBinaryStream();	
}