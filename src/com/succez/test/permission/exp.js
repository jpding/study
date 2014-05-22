var ASTNodeVisitor = com.succez.commons.exp.util.ASTNodeVisitor;
var JavaAdapter = org.mozilla.javascript.JavaAdapter;
var ExpressionImpl = com.succez.commons.exp.impl.ExpressionImpl;
var DefaultExpContext = com.succez.commons.exp.impl.DefaultExpContext;
var StringUtils=com.succez.commons.util.StringUtils;
var context = new DefaultExpContext();
var ASTNode = com.succez.commons.exp.ASTNode;

function main(args) {
	var vs = {};
	var vv =createNodeVistor(vs);
	var exp = new ExpressionImpl("dim('x')='y' and dim('x')='n;b'");
	exp.compile(context);
	vv.visit(exp.getRootNode());
	for(var key in vs){
		println(key);
		println(vs[key]);
	}
}

function dimv2(expzz, dimPath){
	var userObj = sz.security.getCurrentUser();
	if(userObj.id == "admin"){
		return "1=1";
	}
	return expzz+"='"+dimv(dimPath)+"'";
}

function dimv(dimPath){
	var result = {};
	var nodeVisit =createNodeVistor(result);
	var pms = getPermissionChecker();
	for (var itr = pms.iterator(); itr.hasNext();) {
		var item = itr.next();
		var filter = item.getDwfilter();
		if(StringUtils.isEmpty(filter))
			continue;
		var exp = new ExpressionImpl(filter);
		exp.compile(context);
		nodeVisit.visit(exp.getRootNode());
	}
	var dimValue = result[dimPath];
	if(dimValue == undefined){
		return "";
	}
	return  dimValue;
}

function createNodeVistor(map){
	return new ASTNodeVisitor({
			values : map,
			visitNode : function(parents, node) {
				if(node.getType() == ASTNode.NODETYPE_FUNC && StringUtils.equalsIgnoreCase("DIM", node.getName())){
					var dimPath  = node.getNodes()[0].getName();
					var dimValue = parents.get(parents.size()-1).getNode(1).getName();
					var oldDimValue = this.values[dimPath];
					if(oldDimValue==undefined || StringUtils.isEmpty(oldDimValue)){
						this.values[dimPath]=dimValue;
					}else{
						this.values[dimPath]=oldDimValue+";"+dimValue;
					}
				}
			}
		});
}

function getPermissionChecker(){
	var userObj = sz.security.getCurrentUser();
	var mgr = sz.security.getSecurityManager();
	var checker = mgr.getUser(userObj.id).getPermissionChecker();
	return checker.getAllPermissions();
}