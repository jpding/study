function splitCell(result, tableName, cols){
	var rpt = result.getComponent(tableName);
	if(rpt == null){
		return ;
	}
	var cells = [];
	
	for(var i=1; i<rpt.getRowCount(); i++){
		for(var j=0; j<cols.length; j++){
			var cell = rpt.getCell(i,cols[j]);
		
			if(cell.getRow() != i){
				continue;
			}
			var fields = cell.getClass().getDeclaredFields();
			field = fields[0];
			field.setAccessible(true);
			cells.push(fields[0].get(cell));
		}		
	}

	for(var i=0; i<cells.length; i++){
		rpt.splitCell(cells[i],1);
	}
}

function onAfterReportCalc(args){
	var result = args.result;
	splitCell(result, "table3", [0,1,2,3]);
	splitCell(result, "table2", [0,1,2,3]);
}