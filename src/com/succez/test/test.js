function onAfterReportCalc(args){
	var result = args.result;
	var table = result.getComponent("rpt1");
	for(var i=0 ; i<table.getRowCount(); i++){
		var cell = table.getCell(i, 0);
		var comps = cell.getSubRealComponents();
		if(comps.length > 0){
			comps[0].setOption("value", "ddss");
		}
	}
}