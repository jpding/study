var BeanGetter = com.succez.commons.service.springmvcext.BeanGetterHolder.getBeanGetter();
var toolBarService = BeanGetter.getBean(com.succez.metadata.api.model.MetaToolBarContributorService);
var repo = BeanGetter.getBean(com.succez.metadata.api.MetaRepository);

var MetaExplorerQueryUtil = com.succez.metadata.api.impl.pages.explorer.query.MetaExplorerQueryUtil;
var MetaDataGridPagination = com.succez.metadata.api.impl.components.sz.metadata.metadatagrid.MetaDataGridPagination;
var actionUrl = "/meta/sailing/others/explorer/explorer.action?";
var hideParams = "&shownavtree=false&shownavbar=false&showtitlebar=false";

function execute(req, res){
	var selected = req.selected;
	var sort = req.sort;
	var page = -1;
	if(req.page){
		page = req.page;
	}
	var ignorehidden = true;
	res.attr("selected", "");
	res.attr("actionurl", actionUrl);
	
	var entity    = repo.getMetaEntity(req.path);
	var parentEntity = entity.getParent();
	if(!parentEntity){
		res.attr("currentParentPath", actionUrl+"selected="+req.path+"&path="+req.path+hideParams);
	}else{
		var presid = parentEntity.getId();
		res.attr("currentParentPath", actionUrl+"selected="+presid+"&path="+presid+hideParams);
	}
	
	res.attr("currentpath", req.path);
	
	loadToolBarDepends(entity, "explorer", res);
	var explorer = queryChildEntities(page, sort, entity, res);
	return "explorer.ftl";
}

function loadToolBarDepends(entity, category, res) {
	var depends = toolBarService.getMetaToolBarItemsDepends(category, entity.getType());
	res.attr("sz_dynamicimports", depends);
	res.attr("category", category);
	res.attr("entitytype", entity.getType().getName());
}

function queryChildEntities(page, sort, entity, res){
	var listdata = entity.listChildren(0, -1, false, true);
	println("=================================================")
	println(listdata.size());
	for(var i=0; i<listdata.size(); i++){
		println(listdata.get(i).name);
	}
	var pag = new MetaDataGridPagination(page,listdata.size());
	res.attr("pag", pag);
	res.attr("listdata", listdata);
}