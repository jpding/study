var BeanGetter = com.succez.commons.service.springmvcext.BeanGetterHolder.getBeanGetter();

var login = BeanGetter.getBean(com.succez.security.api.session.Login);
var repo  = BeanGetter.getBean(com.succez.metadata.api.MetaRepository);
var resourceBrowser = BeanGetter.getBean(com.succez.security.api.restree.ResourceBrowser);
var expContextFactory = BeanGetter.getBean(com.succez.security.api.LoginExpContextFactory);
var prstHelper = BeanGetter.getBean(com.succez.bi.prst.PrstHelper); 
var securityManager = BeanGetter.getBean(com.succez.security.api.SecurityManager);
var exporterService = BeanGetter.getBean(com.succez.bi.prst.export.PrstExporterService);
var tempFileService = BeanGetter.getBean(com.succez.commons.service.io.TempFileService);
var metaUtility     = BeanGetter.getBean(com.succez.metadata.api.MetaUtility);
var ScriptObjectPrst = com.succez.bi.api.impl.scriptobjs.sz.prst.ScriptObjectPrstImpl;
var WORDPATH = "acmrassurance:/analyses/GSBG1/ActiveDoc";
var EXPORTPATH = "e:\\aa\\";

function main(args){
	calcAllWord2(1,10);
}

function calcAllWord2(startId, endId){	
	/**
	 * 保险公司
	 */
	var dimpath = "acmrassurance:/datamodels/DIM/dim_bxgsmb";
	var dimTree = sz.metadata.get(dimpath).getObject();
	var treeItem = dimTree.getTreeItem(null);
	for(var i=startId; i<=endId; i++){
		var item = dimTree.getTreeItem(i+"");
		println(item.id+"\t"+item.caption);
		calcWord2(item, EXPORTPATH);
	}
}

function calcAllWord(startId, endId){	
	/**
	 * 保险公司
	 */
	var dimpath = "acmrassurance:/datamodels/DIM/dim_bxgsmb";
	var dimTree = sz.metadata.get(dimpath).getObject();
	var treeItem = dimTree.getTreeItem(null);
	var children = treeItem.getChildren();
	for(var i=0; i<children.size(); i++){
		var item = children.get(i);
		if(item.id == "T" || i>=2){
			continue;
		}
		println(item.id+"\t"+item.caption);
		calcWord2(item, EXPORTPATH);
	}
}

var PrstCalcParams  = com.succez.bi.api.impl.prst.resultinfo.PrstCalcParamsImpl;
var ProgressMonitor = com.succez.commons.util.io.impl.ProgressMonitorImpl;
var ScriptObjectPrstResultImpl = com.succez.bi.api.impl.scriptobjs.sz.prst.ScriptObjectPrstResultImpl;

function calcWord2(treeItem, dir){
	var prstInfo = getPrstInfo(WORDPATH);	
	var calcparams = new java.util.HashMap();
	calcparams["@brand"] = treeItem.id;
	calcparams["_text_@brand"] = treeItem.caption;
	var params = new PrstCalcParams(calcparams);
	var calculator = prstHelper.getCalculator(prstInfo, params);
	var progress = new ProgressMonitor(null);
		
	var resultinfo = calculator.calc(prstInfo, params, progress, login.getUser());	
	var result = new ScriptObjectPrstResultImpl(resultinfo);
	
	result.setExporterService(exporterService);
	result.setRepo(repo);
	result.setTempFileService(tempFileService);
	result.setMetaUtility(metaUtility);
	result.setLogin(login);
	result.setPrstHelper(prstHelper);
	result.save({"localPath":dir+treeItem.caption+".doc","extension":"doc"});
}

function getPrstInfo(path){
	var entity = repo.getMetaEntity(path);
	return entity.getBusinessObject(com.succez.bi.prst.PrstObjectInfo);
}