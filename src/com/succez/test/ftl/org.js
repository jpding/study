
function getOrgHtml(){
	var html = new java.lang.StringBuilder();
	var org = sz.security.getOrg("X00000");
	html.append("<ul><li>").append(org.name);
	buildOrgTreeNode(html, "X00000");
	html.append("</li></ul>");
	println(html.toString());
}

function listRootOrgs(){
	var orgMgr = sz.security.getOrgManager();
	var listOrg = orgMgr.listRootOrganizations();
	var result = [];
	for(var i=0; i<listOrg.size(); i++){
		var org = listOrg.get(i);
		result.push(convertOrg(orgMgr, org));
	}
	return result;
}

function listChildrenOrg(parentOrgId){
	if(parentOrgId == "--root--"){
		return listRootOrgs();
	}
	
	var orgMgr = sz.security.getOrgManager();
	var parentOrg = orgMgr.getOrganizationById(parentOrgId);
	var listOrg = orgMgr.listOrganizations(parentOrg.getKey());
	var result = [];
	for(var i=0; listOrg != null && i<listOrg.size(); i++){
		var org = listOrg.get(i);
		result.push(convertOrg(orgMgr, org));
	}
	return result;
}

function convertOrg(orgMgr, org){
	var newOrg = {};
	newOrg["key"] = org.key;
	newOrg["id"]  = org.orgId;
	newOrg["name"] = org.name;
	newOrg["parent"] = org.parentKey;
	var listOrg = orgMgr.listOrganizations(org.key);
	newOrg["parent"] = org.parentKey;
	return newOrg;
}

function listUser2(org){
	var userList = sz.security.listUsers();
	var result = [];
	for(var i=0; i<userList.length; i++){
		var user = userList[i];
	    //println(user.id+"\t"+user.name+"\t"+user.org.id);
		if(user.org.id == org){
			result.push(user);
		}
	}
	return result;
}

function listUser(org){
	var userMgr = sz.security.getUserManager();
	var orgMgr = sz.security.getOrgManager();
	var parentOrg = orgMgr.getOrganizationById(org);
	var userList = userMgr.listUsers(parentOrg.key);
	var result = [];
	for(var i=0; i<userList.size(); i++){
		var userObj = userList.get(i);
		var user = {};
		user["id"] = userObj.userId;
		user["name"] = userObj.name;		
		result.push(user);
	}
	return result;
}

/**
 * <ul id="organisation">
 *    <li>
 *      <ul>
 *        <li>1</li>
 *        <li>2</li>
 *      </ul>
 *    </li>
 * </ul>
 */
function buildOrgTreeNode(html, orgId){
	var orgs = listChildrenOrg(orgId);
	if(orgs == null || orgs.length == 0){
		buildUserTreeNode(html, orgId);
		return ;
	}
	html.append("<ul>");
	for(var i=0; i<orgs.length; i++){
		var org = orgs[i];
		html.append("<li>");
		html.append(orgs[i].name);
		buildOrgTreeNode(html, org.id);
		html.append("</li>");
	}
	html.append("</ul>");
}

function buildUserTreeNode(html, orgId){
	var users = listUser(orgId);
	if(users == null || users.length == 0){
		return ;
	}
	html.append("<ul>");
	for(var i=0; i<users.length; i++){
		var user = users[i];
		html.append("<li>");
		html.append(user.name);
		html.append("</li>");
	}
	html.append("</ul>");
}