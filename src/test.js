/**
 * 组织机构遍历，不需要权限控制的，遍历方式
 * @param {} req
 * @param {} res
 */
function execute(req, res){
	
}

function main(args){
	var orgs = sz.security.listOrgs();
	for(var i=0; i<orgs.length; i++){
		var org = orgs[i];
		println(org.id + "\t" + org.name);
	}
}

