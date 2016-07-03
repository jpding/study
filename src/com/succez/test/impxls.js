var FileInputStream = java.io.FileInputStream;
var InputStream = java.io.InputStream;

var HSSFCell = org.apache.poi.hssf.usermodel.HSSFCell;
var HSSFDateUtil = org.apache.poi.hssf.usermodel.HSSFDateUtil;
var HSSFRow = org.apache.poi.hssf.usermodel.HSSFRow;
var HSSFSheet = org.apache.poi.hssf.usermodel.HSSFSheet;
var HSSFWorkbook = org.apache.poi.hssf.usermodel.HSSFWorkbook;
var XSSFWorkbook = org.apache.poi.xssf.usermodel.XSSFWorkbook;
var WorkbookFactory = org.apache.poi.ss.usermodel.WorkbookFactory;
var POIFSFileSystem = org.apache.poi.poifs.filesystem.POIFSFileSystem;
var NumberUtils = com.succez.commons.util.NumberUtils;
var StringUtils = com.succez.commons.util.StringUtils;
var Pattern = java.util.regex.Pattern;
var DocumentHelper = org.dom4j.DocumentHelper;
var DWTableUtil  = com.succez.bi.dw.impl.DWTableUtil;
var CellNameUtil = com.succez.commons.util.CellNameUtil;
var FilenameUtils = com.succez.commons.util.FilenameUtils;

function main(args) {
    debugger;
	println("start");
	importData();
}

var DS_NAME = "Test";

/**
 * 返回待导入的Excel数据，是一个二维数组
 * @param ins Excel 文件流
 */
function getExcelData(ins) {
	var wb = WorkbookFactory.create(ins);
	var datas = [];
	for(var i=0, len=wb.getNumberOfSheets(); i<len; i++){
		var sheet = wb.getSheetAt(i);
		var sheetName = wb.getSheetName(i);
		println("read data sheetIndex:"+i+";sheetName:"+sheetName);
		
		var sheetConfig = getSheetConfig(sheetName, excelConfig);
		if(sheetConfig==null){
			println("not found sheetConfig :"+sheetName);
			continue;
			//throw new Error("not found sheetConfig:");
		}
		
		var datatype = sheetConfig.datatype
		var sheetData ;
		if(datatype == "float"){
			sheetData = readExcelSheetByRow(sheet, sheetName, i, sheetConfig);
		}else if(datatype == "fix"){
			sheetData = readExcelSheetByCell(sheet, sheetName, i, sheetConfig);
		}else{
			throw new Error("配置文件：sheetConfig:"+sheetName+" datatype配置错误，应该为float或者fix");
		}
		 
		if(sheetData == null){
			continue;
		}
		datas.push(sheetData);
	}
	
	return datas;
	
	/*return [ [ 3, '刘希成', '武汉', '华中', 1, null, 0, 0, 1, 1, '2015-06-01',
			'2015-06-11', 'WT01111' ] ];*/
	// return
	// [[4,'刘希成','武汉','华中',1,null,0,0,1,1,'2015-6-1','2015-6-8','WT01111']];
	// turn
	// [[4,'刘希成','武汉','华中',1,null,0,0,1,1,'2015-9-1','2015-9-8','WT01111']];
}

var COLS = ['A','B','C','D','E','K','L','M','X','Y','Z'];

/**
 * 按行的方式来读取Excel内容，相当月采集中的变长表
 * @param {} sheet
 * @param {} sheetName
 * @param {} sheetIndex
 * @param {} excelConfig
 * @return {}
 */
function readExcelSheet(sheet){
	/**
	 * {name:"sheetName",value:[]}
	 * @type 
	 */
	var data = {};
	var values = [];
	
	var endRow =  sheet.getLastRowNum()+5;
	println("endRow:"+endRow);
	for(var i=1, rowNum = endRow; i<rowNum; i++){
		var row = sheet.getRow(i);
		if(row == null)
			continue;
		var rowData = [];
		for(var j=0; j<COLS.length; j++){
			var field = COLS[j];
			var colIndex = CellNameUtil.getCellRowColByName(field.col+"1")%10000;
			//println("colIndex:"+colIndex);
			var cell = row.getCell(colIndex);
			if(cell == null){
				rowData.push(null);
				continue;
			}
				
			var cellData =  readExcelCellValue(cell, sheetName);
			var matcher = field["matcher"];
			if(matcher != null){
				var md = matcher.matcher(cellData).matches();
				if(!md){
					println("no match: sheet:"+sheetName+" row:+"+(i+1)+";col:"+field["col"]);
					rowData == null;
					break;
				}
			}
			
			//处理带%号的数字例如  9%，导入时应该是0.09
			if(field.type == "N"){
				if(StringUtils.endsWith(cellData,"%")){
					cellData = NumberUtils.toDouble(StringUtils.ensureNotEndWith(cellData, '%'))*0.01;
				}
			}
			
			rowData.push(cellData);
		}
		
		if(isNullRow(rowData)){
			println("rowIndex:"+(i+1)+";rowData:ISNULL");
			continue;
		}
		println("rowIndex:"+i+";rowData:"+rowData);	
		values.push(rowData);
	}
	data.value = values;
	return data;
}

function readExcelCellValue(cell, sheetName){
	var cellType = cell.getCellType();
	switch(cellType){
		case HSSFCell.CELL_TYPE_BLANK:
				return null;
		case HSSFCell.CELL_TYPE_BOOLEAN:
			return java.lang.String.valueOf(cell.getBooleanCellValue());
		case HSSFCell.CELL_TYPE_FORMULA:
			if(org.apache.poi.ss.usermodel.DateUtil.isCellDateFormatted(cell)){
				return cell.getDateCellValue();
			}else{
				return cell.getNumericCellValue();
			}
			//return cell.getStringCellValue(); //getCellFormula();
			return null;
		case HSSFCell.CELL_TYPE_NUMERIC: {
			//_formatter.formatCellValue(cell)
			var value = cell.getNumericCellValue();
			/**
			 * 避免把整数读成小数
			 */
			var intValue = Math.round(value);
			if (value == intValue) {
				return StringUtils.int2Str(intValue);
			}
			return value;
		}
		case HSSFCell.CELL_TYPE_STRING:
			return cell.getStringCellValue();
		case HSSFCell.CELL_TYPE_ERROR:
			var errorInfo = "sheet:"+sheetName+"row:"+cell.getRow().getRowNum()+";"+"col:"+col;
			throw new Error(errorInfo+org.apache.poi.ss.formula.eval.ErrorEval.getText(cell.getErrorCellValue()));
			break;
		default:
			var errorInfo = "sheet:"+sheetName+"row:"+cell.getRow().getRowNum()+";"+"col:"+col;
			throw new Error(errorInfo+"Unexpected cell type (" + cell.getCellType() + ")");
	}
	return null;
}

/**
 * 判断是否是空行，所设置的行列是否有合同表元，如果有合并表元，也不需要导入
 * @param {} row
 * @param {} sheetConfig
 * @return {Boolean}
 */
function isNullRow(cellsData){
	for(var i=0; cellsData != null && i<cellsData.length; i++){
		if(cellsData[i] != null)
			return false;
	}
	return true;
}

/**
 * 根据员工编号，返回数据库里面对于的员工数据，如果没有则返回为空
 * 
 * @param {}
 *            ygbh
 */
function queryData(ygbh) {	
	var ds = sz.db.getDataSource(DS_NAME);
	var result = ds.select("select *from employee_info where employee_no=?",ygbh);	
	println(result);
	return result;
}

function insertData(ygbhObj) {
	println("插入数据:" + ygbhObj);
	var ds = sz.db.getDataSource(DS_NAME,true);
	var upd = ds.createTableUpdater("employee_info");
	upd.insert({ employee_name:ygbhObj[1],
				 work_area:ygbhObj[2],
				 cost_center:ygbhObj[3],
				 employee_state:ygbhObj[4],
				 leave_date:ygbhObj[5],
				 is_important:ygbhObj[6],
				 is_core:ygbhObj[7],
				 is_board:ygbhObj[8],
				 is_recruitment:ygbhObj[9],
				 start_date:ygbhObj[10],
				 end_date:ygbhObj[11],
				 employee_no:ygbhObj[12]				  
		});
	
}

function updateData(ygnhObj) {
	println("更新数据：" + ygnhObj);	
	var ds = sz.db.getDataSource(DS_NAME,true);
	var upd = ds.createTableUpdater("employee_info");
	upd.set({is_important:ygnhObj[6],
				 is_core:ygnhObj[7],
				 is_board:ygnhObj[8],
				 is_recruitment:ygnhObj[9],
				 start_date:ygnhObj[10],
			  end_date:ygnhObj[11]},{employee_id:ygnhObj[0]});	
	upd.commit();
}

/**
 * 导入Excel数据
 */
function importData() {
	var data = getExcelData();
	for ( var i = 0; i < data.length; i++) {
		var row = data[i];
		// Get empno
		var empno = row[12]
		// Get employee data by employeeno
		var emps = queryData(empno);
		if (emps.length !=0) {
			var small = [];
			var large = [];		
			for (j = 0; j < emps.length; j++) {
				if (emps[j][10] <row[10]) {
					small.push(emps[j]);
					small.sort(function(x,y){return y[10]>x[10];
					});
				} else {
					large.push(emps[j]);
					large.sort(function(x,y){return x[10]<y[10];
					});
				}
			}
			println("small:" + small);
			println("large:" + large);
			calulateData(small[0], large[0], row);
		} else {
			insertData(data[i]);
		}
	}
}
/*
 * 处理数据
 */
function calulateData(small, large, row) {
	var small_max = small;
	var large_min = large;

	println("small_max:" + small_max);
	println("large_min:" + large_min);

	if (small_max && large_min) {
		small_max[11] = row[10];
		updateData(small_max);
		row[11] = large_min[10];
		row[0]=null;
		insertData(row);
	} else if (large_min) {
		row[11] = large_min[10];
		row[0] = null;
		insertData(row)
	} else if (small_max) {
		small_max[11] = row[10];
		updateData(small_max);
		row[0]=null;
		insertData(row);
	}
}