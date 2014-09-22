/**
 * 把word文件转换成网页显示，目前只支持不带图片的转换，纯文字转换
 */
var Document = com.aspose.words.Document;
var AsposeUtil = com.succez.bi.activedoc.impl.aspose.AsposeUtil;
var FileInputStream = java.io.FileInputStream;
var SaveFormat = com.aspose.words.SaveFormat;
var File = java.io.File;
var FilenameUtils = com.succez.commons.util.FilenameUtils;
var StringEscapeUtils = com.succez.commons.util.StringEscapeUtils;

AsposeUtil.licence();

function main(args){
	/**
	 * showword.action?path=encodeURIComponent(escape("知识库/法律法规/国资委工作动态/《中国企业法律顾问制度发展研究报告》课题通过评审验收20080605.doc"))
	 vv = "%u77E5%u8BC6%u5E93/%u6CD5%u5F8B%u6CD5%u89C4/%u56FD%u8D44%u59D4%u5DE5%u4F5C%u52A8%u6001/%u300A%u4E2D%u56FD%u4F01%u4E1A%u6CD5%u5F8B%u987E%u95EE%u5236%u5EA6%u53D1%u5C55%u7814%u7A76%u62A5%u544A%u300B%u8BFE%u9898%u901A%u8FC7%u8BC4%u5BA1%u9A8C%u653620080605.doc";
	 */
	var vv = "%u77E5%u8BC6%u5E93/%u6CD5%u5F8B%u6CD5%u89C4/%u56FD%u8D44%u59D4%u5DE5%u4F5C%u52A8%u6001/%u300A%u4E2D%u56FD%u4F01%u4E1A%u6CD5%u5F8B%u987E%u95EE%u5236%u5EA6%u53D1%u5C55%u7814%u7A76%u62A5%u544A%u300B%u8BFE%u9898%u901A%u8FC7%u8BC4%u5BA1%u9A8C%u653620080605.doc";
	var v1 = "知识库/法律法规/国资委工作动态/《中国企业法律顾问制度发展研究报告》课题通过评审验收20080605.doc";
	println(StringEscapeUtils.unescapeJava(vv.replace(/%u/ig, "\\u")));
	println(StringEscapeUtils.escapeJavaScript(v1));
	
	println(sz.sys.getWorkDir());
}

function execute(req, res){
	var path = req.path;
	
	if(path == null || path == ""){
		res.setReturnType("text");
		return "请传入path参数(path中文需要编码)：showword.action?path=xxx.doc";
	}
	
	println("path:"+path);
	//println("path:"+StringEscapeUtils.decodeURI(path));
	path = StringEscapeUtils.unescapeJava(path.replace(/%u/ig, "\\u"));
	println("depath:"+path);
	
	var realPath = ensureFileExists(path);
	if(realPath){
		path = "d:\\lawcont\\aa.doc"
		res.setReturnType("html");
		res.setContentType("text/html;charset=utf-8");
		convertDoc2Html(path, res.getOutputStream());
	}else{
		res.setReturnType("text");
		return "不存在文件："+path;
	}
}

function ensureFileExists(path){
	var realPath = sz.sys.getWorkDir()+"/"+path;
	var ff = new File(realPath);
	var ext = FilenameUtils.getExtension(path);
	if(ff.exists() && (ext=="doc" || ext=="docx")){
		return realPath;
	}
	return "";
}

function convertDoc2Html(wordPath, out){
	var ins = new FileInputStream(wordPath);
	try{
		var doc = AsposeUtil.createDocument(ins);
		doc.save(out, SaveFormat.HTML);
	}finally{
		ins.close();
	}
}