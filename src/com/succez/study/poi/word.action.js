/**
 * 把word转换成pdf显示，并接受表单中传递过来的参数，显示过程如下：
 * 1.该action接受表单传递过来的参数，在临时文件中生成pdf，并生成一个唯一的id号，寄存在该用户的服务器内存中，该内存随着用户的退出自动回收
 * 
 */
var AsposeUtil = com.succez.bi.activedoc.impl.aspose.AsposeUtil;
AsposeUtil.licence();

var fileService = sz.getBean(com.succez.commons.service.io.TempFileService);

var Document = com.aspose.words.Document;
var SaveFormat = com.aspose.words.SaveFormat;
var HtmlFixedSaveOptions = com.aspose.words.HtmlFixedSaveOptions;
var HtmlSaveOptions  = com.aspose.words.HtmlSaveOptions;
var PdfSaveOptions  = com.aspose.words.PdfSaveOptions;

var MyByteArrayOutputStream = com.succez.commons.util.io.MyByteArrayOutputStream;

//var PATH_PDF_TPL = "whzwdc:/collections/DBRW/resources/武汉市人民政府督查室";
var PATH_PDF_TPL = "whzwdc:/collections/DBRW/resources/武汉市人民政府督查室Mail";
//var PATH_PDF_TPL = "whzwdc:/collections/DBRW/resources/中国人";

function execute(req, res){
	var uid = uuid();
	var names = req.getParameterNames();
	var params = {};
	while(names.hasMoreElements()){
		var nm = names.nextElement();
		params[nm] = req.getParameter(nm);
	}
	req.getSession().setAttribute(uid, params);
	res.attr("uid", uid);
	return "ftl_taskform.ftl";
}


function download(req, res){
	var uid = req.uid;
	var params = req.getSession().getAttribute(uid);
	if(params == null){
		
	}
	makePdf(params, res);
}

function makePdf(params, res){
	var entity = sz.metadata.get(PATH_PDF_TPL);
	var ins = entity.getContentInputStream();
	try{
		var doc = new Document(ins);
		var keys = Object.keys(params);
		var keyLen = keys.length;
		var fieldNames = java.lang.reflect.Array.newInstance(java.lang.String, keyLen);
		var fieldValues = java.lang.reflect.Array.newInstance(java.lang.Object, keyLen);
		for(var i=0; i < keyLen; i++){
			fieldNames[i]  = keys[i];
			fieldValues[i] = params[keys[i]];
		}
		doc.getMailMerge().execute(fieldNames, fieldValues);
		
		var out = res.getOutputStream();
		doc.save(out,SaveFormat.PDF);
		out.flush();
	}finally{
		ins.close();
	}
}

function pdf(req, res){
	var entity = sz.metadata.get(PATH_PDF_TPL);
	var ins = entity.getContentInputStream();
	try{
		var doc = new Document(ins);
		var out = res.getOutputStream();
		
		var saveOptions = new HtmlFixedSaveOptions();
		saveOptions.setExportEmbeddedImages(true);
		saveOptions.setExportEmbeddedCss(true);
		saveOptions.setExportEmbeddedFonts(true);
		saveOptions.setExportEmbeddedSvg(true);
		
		var oo1 = MyByteArrayOutputStream();
		//var saveOptions = new HtmlSaveOptions();
		//saveOptions.setExportImagesAsBase64(true);
		doc.save(oo1,saveOptions);
		//out.flush();
		res.setReturnType("html");
		return oo1.toString("utf-8");
		//res.sendRedirect("http://www.baidu.com");
	}finally{
		ins.close();
	}
}

function getCIProperties(){
	return {
		"visible":false,
		"cicalcparams":"a=124"
	};
}