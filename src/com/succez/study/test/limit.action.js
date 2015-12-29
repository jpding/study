var CSVReader    =  com.succez.commons.util.io.CSVReader;
var StringReader = java.io.StringReader;
var ppath = "SCWSZBCI:/analyses/limitcheck/183极值审核/";
var LIMIT_FILE_NAME = "ci-rangecheckconf.csv";
var tableName = "SZ_LIMIT_CHECK";

function main(args){
	var taskid = "CWJT1_10";
	var obj = readCSVFromDB(taskid);
	println(JSON.stringify(obj));
	//writeDB(taskid, obj);
}

function execute(req, res){
	var taskid = req.taskid;
	var rpath = ppath+taskid;
	//var jsonObj = readCSV(rpath);
	var jsonObj = readCSVFromDB(taskid);
	res.setReturnType("json");
	return JSON.stringify(jsonObj);
}

function readCSVFromDB(taskid){
	var ds = sz.db.getDefaultDataSource();
	var updater = ds.createTableUpdater(tableName, {"taskid":taskid});
	var result = updater.get(["formname", "fieldname", "checkexp", "comments_"]);
	var form = {};
	for(var i=0; i<result.length; i++){
		var row = result[i];
		var fName = row[0];
		var fieldName = row[1];
		var exp = row[2];
		var hints = row[3];
		var fobj = form[fName];
		if(!fobj){
			fobj = {};
			form[fName] = fobj;
		}
		var cobj = fobj[fieldName];
		if(!cobj){
			cobj = {};
			fobj[fieldName] = cobj;
		}
		cobj.fieldName = fieldName;
		cobj.hints = hints;
		cobj.exp = exp;
	}
	return form;
}

//{formName:{cellName:{fieldName:"xx", hint:"", exp:""}}}
function readCSV(path){
	var entity = sz.metadata.get(path+"/"+LIMIT_FILE_NAME);
	var content = entity.content;
	var reader = new CSVReader(new StringReader(content));
	try{
		var form = {};
		var lines = reader.readAll();
		for(var i=0; i<lines.length; i++){
			var line = lines[i];
			var fName = line[0];
			var cName = line[1];
			var fieldName = line[2];
			var exp = line[3];
			var hints = line[4];
			var fobj = form[fName];
			if(!fobj){
				fobj = {};
				form[fName] = fobj;
			}
			var cobj = fobj[cName];
			if(!cobj){
				cobj = {};
				fobj[cName] = cobj;
			}
			cobj.fieldName = fieldName;
			cobj.hints = hints;
			cobj.exp = exp;
		}
		return form;
	}finally{
		reader.close();
	}
}

function writeDB(taskid, cobj){
	var ds = sz.db.getDefaultDataSource();
	var updater = ds.createTableUpdater(tableName);
	var forms = Object.keys(cobj);
	for(var i=0; i<forms.length; i++){
		var ff = cobj[forms[i]];
		var cls = Object.keys(ff);
		for(var j=0; j<cls.length; j++){
			var data = {};
			var clname = cls[j];
			var clsobj = ff[clname];
			data.taskid = taskid;
			data.formname = forms[i];
			data.cellname = clname;
			data.fieldname = clsobj.fieldName;
			data.checkexp = clsobj.exp;
			data.comments_ = clsobj.hints;
			updater.insert(data);
		}
	}
}