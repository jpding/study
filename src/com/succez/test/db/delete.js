function _doDelete(args){
	var params = args.args;
	var table = params.table;
	var pkeyName = params.pkeyName;
	var pkeyValue = params.pkeyValue;
    var ds = sz.db.getDataSource('default');
    var sql = 'delete from '+table + " where "+pkeyName + "=?";
    ds.update(sql,pkeyValue);
}

/**
 * 删除表的指定数据
 * @param {} dsName     数据源名，默认数据源名为default
 * @param {} tableName  待删除的表名，直接写数据库表名
 * @param {} filter     按条件删除，是一个是json对象，也可以是字符串例如  "bbq=201011;lsh=xxxx" 
 */
function _doDelete2(args){
	var params = args.args;
	var dsName    = params.dsName;
	var tableName = params.tableName;
	var filter    = params.filter;
	var ds = sz.db.getDataSource(dsName);
	if(ds == null){
		throw new Error("dsName:"+dsName+" not found!");
	}
	var upd = ds.createTableUpdater(tableName, "");
	var rows = upd.delete(filter);
	return rows;
}

/**
 * 获取指定字段的值，返回是一个列表
 * @param {} dsName
 * @param {} tableName
 * @param {} filter
 * @param {} field   max(xxx)
 */
function _getTableValue(args){
	var params = args.args;
	var dsName    = params.dsName;
	var tableName = params.tableName;
	var filter    = params.filter;
	var ds = sz.db.getDataSource(dsName);
	if(ds == null){
		throw new Error("dsName:"+dsName+" not found!");
	}
	var upd = ds.createTableUpdater(tableName, "");
	return upd.get(params.field, filter);
}

function _doMax(args){
	var params = args.args;
	var table = params.table;
	var pkeyName = params.pkeyName;
	
    var ds = sz.db.getDataSource('default');
    var sql = 'SELECT MAX('+pkeyName+') FROM '+ table+';';
    var maxs = ds.select(sql);
    if(maxs){
        var max = maxs[0][0];
        return max;
    } 
}