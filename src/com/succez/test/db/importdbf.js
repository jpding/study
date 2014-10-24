var DataImportFromDBF = com.succez.commons.util.io.dbf.DataImportFromDBF;
var FilenameUtils = com.succez.commons.util.FilenameUtils;
var ProgressMonitor = com.succez.commons.util.io.impl.ProgressMonitorImpl;

function importXls(req, res){
	var excelfile = req.getFile("excelfile");
	if(!excelfile){
		res.attr("msg","请选择文件");
		return "import.ftl";
	}
    println("文件名："+excelfile.fileName);
    var log = importDBF(excelfile.file, excelfile.fileName);
    res.attr("msg", log);
    return "import.ftl";
}



function main(args) {
   var file = new java.io.File("H:\\XXB.dbf");
   importDBF(file);
}


/**
 * 把DBF文件导入到数据库中，如果要导入其他数据源，请修改下面的sz.db.getDataSource("default")中的default
 * 修改成相应的数据源即可，file是要导入的DBF文件
 * @param {} file
 */
function importDBF(filePath, fileName) {
	var dbf = new DataImportFromDBF();
	dbf.setFilePath(filePath);
	var table = FilenameUtils.getBaseName(fileName);
	dbf.setTargetTable(table);
	dbf.setImportMode(4);
	var ipro = new ProgressMonitor();
	dbf.setProgressMonitor(ipro);
	
	var ds = sz.db.getDataSource("default");
	var conn = ds.getConnection();
	try {
		dbf.setTargetConnection(conn);
		dbf.execute();
	} finally {
		conn.close();
	}
	return ipro.getLogs();
}