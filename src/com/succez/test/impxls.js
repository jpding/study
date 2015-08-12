function main(args) {
    debugger;
	println("start");
	importData();
}

var DS_NAME = "Test";

/**
 * 返回待导入的Excel数据，是一个二维数组
 */
function getExcelData() {
	return [ [ 3, '刘希成', '武汉', '华中', 1, null, 0, 0, 1, 1, '2015-06-01',
			'2015-06-11', 'WT01111' ] ];
	// return
	// [[4,'刘希成','武汉','华中',1,null,0,0,1,1,'2015-6-1','2015-6-8','WT01111']];
	// turn
	// [[4,'刘希成','武汉','华中',1,null,0,0,1,1,'2015-9-1','2015-9-8','WT01111']];
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