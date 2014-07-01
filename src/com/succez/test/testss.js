$rpt.ondisplay = function(){
	window.doDealTextDisplay();
}

window.doDealTextDisplay = function(){
	var texts = $("div[id^='text']");
	if(texts.length>0){
		texts.each(function(index,value){
			var $txt = $(this);
			var $p = $txt.parent().parent();
			var $hint = $p.attr("title");
			if ($hint){
				var num = parseFloat($hint);debugger;
				var bkColor = $txt.css("background-color");
				var isLeft =  bkColor == "rgb(230, 185, 184)";
				if ($hint > 0 && isLeft){
					$txt.hide()
				};
				
				if (!isLeft && $hint<0){
					$txt.hide()
				}
			}					
		})
	}
}

function showExpandIcon($rpt) {
    if (!$rpt || !$rpt.getCurrentBodyDom()) {
        return;
    }
    $rpt.getCurrentBodyDom().find("a.component-content").each(function(i, dom) {
            $dom = $(dom);
            var href = $dom.attr("href");
            if (href && href.indexOf('$isexpand') != -1) {
                $dom.addClass("component-canexpand");
            }
        });
}
showExpandIcon($rpt); // 第一次计算报表的时候要显示
if (!sz.sys.getObject("cstm.ExpandTask")) {
    var ExpandTask = sz.sys.createClass("cstm.ExpandTask");
    ExpandTask.prototype.expandCell = function(args, comphtml, callback) {
        var targetComponent = comphtml["$sys_targetComponent"];
        var rpt = args.report;
        var current = rpt.getCurrentResult();
        var bcdom = rpt.getBodyContainerDom();
        var $container = bcdom.find('.sz-bi-prst-report-expand');
        if (!$container.length) {
            $container = $("<div class='sz-bi-prst-report-expand' style='position:absolute;left:-100000px;top:-100000px;'></div>");
            $container.appendTo(bcdom);
        }
        var slf = this;
        var Report = sz.sys.getObject("sz.bi.prst.Report");debugger;
        sz.utils.setInnerHTML(comphtml.html, $container, function() {
                var $table = $container.find(".sz-bi-prst-report-table");
                slf._perform({
                        drillcell   : Report._currentEventTarget,
                        table           : $table
                    });
                callback();
                showExpandIcon($rpt);
				window.doDealTextDisplay();
                return true;
            }, true);
    };
    ExpandTask.STATUS_CAN_EXPAND = true;
    ExpandTask.oncollapse_cell = function(event) {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }
        ExpandTask.STATUS_CAN_EXPAND = false;
        var $drillcell = $.Event(event).$target();
        ExpandTask.collapseCell($drillcell);
    };
    ExpandTask.collapseCell = function(drillcell) {
        $drillcell = $(drillcell);
        $drillcell.removeClass("component-expanded");
        var $expandChildren = $drillcell.data("expandchild");
        $expandChildren.each(function(i, tr) {
                $expandCells = $(tr).find(">td .component-expanded");
                $expandCells.each(function(k, cell) {
                        ExpandTask.collapseCell(cell);
                    });
            });
        $expandChildren.remove();
        $drillcell.unbind("click", ExpandTask.oncollapse_cell);
    };
    ExpandTask.prototype._perform = function(args) {
        var $drillcell = args.drillcell;
        if (!$drillcell || $drillcell.hasClass("component-expanded")) {
            return;
        }
        $drillcell.addClass("component-expanded");
        var $drilltr = $drillcell.parent().parent();
        var $newtable = args.table;
        var $newtrs = $newtable.find("tbody>tr");
        $drillcell.data("expandchild", $newtrs);
        $newtrs.insertAfter($drilltr);
        $drillcell.click(ExpandTask.oncollapse_cell);
    };
    var ShowRefreshComponentsResultTask = sz.sys.getObject("sz.bi.prst.ShowRefreshComponentsResultTask");
    var _showComponent_indlg = ShowRefreshComponentsResultTask.prototype._showComponent_indlg;
    ShowRefreshComponentsResultTask.prototype._showComponent_indlg = function(args, comphtml, callback) {
        var customParams = args.data["$sys_customparameters"];
        if (!customParams || customParams.indexOf("$isexpand=true") == -1) {
            return _showComponent_indlg.apply(this, arguments);
        }
        var expandTask = ExpandTask.create();
        ExpandTask.prototype.expandCell.apply(expandTask, arguments);
    };
    var Report = sz.sys.getObject("sz.bi.prst.Report");
    var _refreshcomponents = Report.prototype._refreshcomponents;
    Report.prototype._refreshcomponents = function(args) {
        if (!ExpandTask.STATUS_CAN_EXPAND) {
            ExpandTask.STATUS_CAN_EXPAND = true;
            return;
        }
        return _refreshcomponents.apply(this, arguments);
    };
} 







//四象限散点图


var chart = function(){ new Highcharts.Chart({
    chart: {
        renderTo: 'chartcontainer',
        defaultSeriesType:'scatter',
        borderWidth:1,
        borderColor:'#ccc',
        marginLeft:90,
        marginRight:50,
        backgroundColor:'#eee',
        plotBackgroundColor:'#fff'
    },
    credits:{enabled:false},
    title:{
        text:'区域分析散点图'
    },
    legend:{
        enabled:true                                
    },
    tooltip: {
        formatter: function() {
            return '<b>'+ this.series.name +'</b><br/>'+
             "指标:"+this.point.name+';重要性:'+this.x +';满意度:'+ this.y;
        }
    },
    plotOptions: {
        series: {
            shadow:true,
            dataLabels: {
                  enabled: true,
                  format: '{point.name}' 
            }
        }
    },
    xAxis:{
        title:{
            text:'X轴 重要性'
        },
        min:0,
        max:${min(table3.d2$.concat(table3.f2$,table3.h2$,table3.j2$,table3.l2$,table3.n2$).max()+0.05, 1)},
        tickInterval:${min(table3.d2$.concat(table3.f2$,table3.h2$,table3.j2$,table3.l2$,table3.n2$).max()+0.05, 1)/2},
        minorTickInterval:1,
        tickLength:0,
        minorTickLength:0,
        gridLineWidth:1,
        showLastLabel:true,
        showFirstLabel:false,
        lineColor:'#ccc',
        lineWidth:1
        
    },
    yAxis:{
        title:{
            text:'Y轴<br/>满意度',
            rotation:0,
            margin:25
        },
        min:${max(table3.e2$.concat(table3.g2$,table3.i2$,table3.k2$,table3.m2$,table3.o2$).min()-1, 0)},
        max:10,
        tickInterval:${tostr((10-max(table3.e2$.concat(table3.g2$,table3.i2$,table3.k2$,table3.m2$,table3.o2$).min()-1, 0))/2.0,'0')},
        minorTickInterval:20,
        tickLength:5,
        minorTickLength:0,
        lineColor:'#ccc',
        lineWidth:1
        
    },
   series: [{
        name:"东北",
        color:'red',
        data: [${table3.a2$.select(true, "{x:"+@.rightcell(3).txt+",y:"+@.rightcell(4).txt+",name:'"+@.txt+"'}").join(",")}]
    },{
        name:"华北",
        color:'blue',
        data: [${table3.a2$.select(true, "{x:"+@.rightcell(5).txt+",y:"+@.rightcell(6).txt+",name:'"+@.txt+"'}").join(",")}]
    },{
        name:"华东",
        color:'yellow',
        data: [${table3.a2$.select(true, "{x:"+@.rightcell(7).txt+",y:"+@.rightcell(8).txt+",name:'"+@.txt+"'}").join(",")}]
    },{
        name:"华南",
        color:'green',
        data: [${table3.a2$.select(true, "{x:"+@.rightcell(9).txt+",y:"+@.rightcell(10).txt+",name:'"+@.txt+"'}").join(",")}]
    },{
        name:"西北",
        color:'gray',
        data: [${table3.a2$.select(true, "{x:"+@.rightcell(11).txt+",y:"+@.rightcell(12).txt+",name:'"+@.txt+"'}").join(",")}]
    },{
        name:"西南",
        color:'black',
        data: [${table3.a2$.select(true, "{x:"+@.rightcell(13).txt+",y:"+@.rightcell(14).txt+",name:'"+@.txt+"'}").join(",")}]
    }]
});  
}

var chart2 = function(){ new Highcharts.Chart({
    chart: {
        renderTo: 'chartcontainer2',
        defaultSeriesType:'scatter',
        borderWidth:1,
        borderColor:'#ccc',
        marginLeft:90,
        marginRight:50,
        backgroundColor:'#eee',
        plotBackgroundColor:'#fff'
    },
    credits:{enabled:false},
    title:{
        text:'品牌分析散点图'
    },
    legend:{
        enabled:true                                
    },
    tooltip: {
        formatter: function() {
            return '<b>'+ this.series.name +'</b><br/>'+
             "指标:"+this.point.name+';重要性:'+this.x +';满意度:'+ this.y;
        }
    },
    plotOptions: {
        series: {
            shadow:true,
            dataLabels: {
                  enabled: true,
                  format: '{point.name}' 
            }
        }
    },
    xAxis:{
        title:{
            text:'X轴 重要性'
        },
        min:0,
        max:${min(table2.d2$.concat(table2.f2$,table2.h2$,table2.j2$,table2.l2$,table2.n2$).max()+0.05, 1)},
        tickInterval:${min(table2.d2$.concat(table2.f2$,table2.h2$,table2.j2$,table2.l2$,table2.n2$).max()+0.05, 1)/2},
        minorTickInterval:1,
        tickLength:0,
        minorTickLength:0,
        gridLineWidth:1,
        showLastLabel:true,
        showFirstLabel:false,
        lineColor:'#ccc',
        lineWidth:1
        
    },
    yAxis:{
        title:{
            text:'Y轴<br/>满意度',
            rotation:0,
            margin:25
        },
        min:${max(table2.e2$.concat(table2.g2$,table2.i2$,table2.k2$,table2.m2$).min()-1, 0)},
        max:10,
        tickInterval:${tostr((10-max(table2.e2$.concat(table2.g2$,table2.i2$,table2.k2$,table2.m2$).min()-1, 0))/2.0,'0')},
        minorTickInterval:20,
        tickLength:5,
        minorTickLength:0,
        lineColor:'#ccc',
        lineWidth:1
        
    },
   series: [{
        name:"Olympus",
        color:'#a21e4d',
        data: [${table2.a2$.select(true, "{x:"+@.rightcell(3).txt+",y:"+@.rightcell(4).txt+",name:'"+@.txt+"'}").join(",")}]
    },{
        name:"Pentax",
        color:'#d8aa00',
        data: [${table2.a2$.select(true, "{x:"+@.rightcell(5).txt+",y:"+@.rightcell(6).txt+",name:'"+@.txt+"'}").join(",")}]
    },{
        name:"Fujinon",
        color:'#004666',
        data: [${table2.a2$.select(true, "{x:"+@.rightcell(7).txt+",y:"+@.rightcell(8).txt+",name:'"+@.txt+"'}").join(",")}]
    },{
        name:"Stryker",
        color:'#95a844',
        data: [${table2.a2$.select(true, "{x:"+@.rightcell(9).txt+",y:"+@.rightcell(10).txt+",name:'"+@.txt+"'}").join(",")}]
    },{
        name:"Karl Storz",
        color:'#c2cca6',
        data: [${table2.a2$.select(true, "{x:"+@.rightcell(11).txt+",y:"+@.rightcell(12).txt+",name:'"+@.txt+"'}").join(",")}]
    }]
});
}



if(!window['highcharts.js']){
  var url = sz.sys.ctx('/meta/ACMR/analyses/highcharts/js/highcharts.js');
  $.getScript(url, function(){

    window['highcharts.js'] = true;
    chart();
    chart2();
   
  })
}else{
  chart();
  chart2();
}



