<@sz.commons.dynamicImport depends="sz.commons.outputJses,sz.security.ptask,sz.commons.html.simplehtml,sz.commons.tabset.eclipseTabset,sz.commons.widget"/>
<@sz.commons.html.simplehtml>
	<style>
		.custom-portal-container{
			width:100%;
			height:100%;
			overflow:auto;
		}
		.sz-commons-widget-header{
			background:#fff url(images/index-tb-bg.png) top left no-repeat;
		}
		.sz-commons-widget-header-title{
			color:#fff;
			padding-left: 4px;
		}
		.custom-portal-layout{
			width:450px;
			height:250px;
			display:inline-block;
			vertical-align:top;
			margin:10px;
		}
		.custom-portal-layout-h250{
			height:250px;
		}
		.sz-commons-widget{
			height:100%;
			position:relative;
			border: 1px solid #CCDFED;
		}
		.sz-commons-widget-section{
			position:absolute;
			top:30px;
			bottom:0px;
			left:0px;
			right:0px;
		}
		.custom-portal-layout tr{
			border-bottom: 1px solid #CCDFED;
		}
		.custom-portal-news{
			position: relative;
			width: 100%;
			padding: 0 10px;
		}
		.custom-portal-news-item{
			border-bottom: 1px dotted #67a6de;
			padding: 0 16px;
		}
		.custom-portal-news-item a{
			color: #666;
			text-decoration: none;
			line-height: 29px;
			outline: 0;
			display: block;
			width: 100%;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.custom-portal-news-item a:hover{
			color:#999
		}
		.sz-commons-simplelist thead tr{
			border-bottom: 1px solid #CCDFED;
		}
	</style>
	<div class="custom-portal-container">
		<span class="custom-portal-layout">
			<@sz.commons.widget id="dbsx" title="待办事项">
				<@sz.security.ptask urls={"com.succez.wi.CONT_INFO2":"$ctx/meta/LAWCONT/analyses/portal2/flxxglxt?selectedId=269582365-2&instanceid=$instanceid&taskid=$taskid&mode=form"}/>
			</@sz.commons.widget>
		</span>
		<span class="custom-portal-layout">
			<@sz.commons.widget id="ybsx" title="已办事项">
				<@sz.security.ptask finished="true" urls={"com.succez.wi.CONT_INFO2":"$ctx/meta/LAWCONT/analyses/portal2/flxxglxt?selectedId=269582365-3&instanceid=$instanceid&taskid=$taskid&mode=form"}/>
			</@sz.commons.widget>
		</span>
		<span class="custom-portal-layout">
			<@sz.commons.widget id="news" title="法律法规">
				<div class="custom-portal-news">
					<ul>
						<li class="custom-portal-news-item">
							<a href="/news">[2013-11-12] SuccezBI荣获“湖北省优秀软件产品”称号</a>
						</li>
						<li class="custom-portal-news-item">
							<a href="/news">[2013-11-12] SuccezBI获得政府创业基金支持</a>
						</li>
						<li class="custom-portal-news-item">
							<a href="/news">[2013-11-02] 湖北省卫生厅选择SuccezBI构建民营医院统计信息管理系统</a>
						</li>
						<li class="custom-portal-news-item">
							<a href="/news">[2013-10-28] 东风商务车4S店选择SuccezBI构建4S店客户跟踪数据分析系统</a>
						</li>
						<li class="custom-portal-news-item">
							<a href="/news">[2013-10-18] 赛思商业智能中标哈尔滨工程大学数据中心项目之BI产品选型</a>
						</li>
						<li class="custom-portal-news-item">
							<a href="/news">[2013-11-12] SuccezBI荣获“湖北省优秀软件产品”称号</a>
						</li>
						<li class="custom-portal-news-item">
							<a href="/news">[2013-11-12] SuccezBI获得政府创业基金支持</a>
						</li>
						<li class="custom-portal-news-item">
							<a href="/news">[2013-11-02] 湖北省卫生厅选择SuccezBI构建民营医院统计信息管理系统</a>
						</li>
						<li class="custom-portal-news-item">
							<a href="/news">[2013-10-28] 东风商务车4S店选择SuccezBI构建4S店客户跟踪数据分析系统</a>
						</li>
						<li class="custom-portal-news-item">
							<a href="/news">[2013-10-18] 赛思商业智能中标哈尔滨工程大学数据中心项目之BI产品选型</a>
						</li>
						<li class="custom-portal-news-item">
							<a href="/news">[2013-11-12] SuccezBI荣获“湖北省优秀软件产品”称号</a>
						</li>
						<li class="custom-portal-news-item">
							<a href="/news">[2013-11-12] SuccezBI获得政府创业基金支持</a>
						</li>
						<li class="custom-portal-news-item">
							<a href="/news">[2013-11-02] 湖北省卫生厅选择SuccezBI构建民营医院统计信息管理系统</a>
						</li>
						<li class="custom-portal-news-item">
							<a href="/news">[2013-10-28] 东风商务车4S店选择SuccezBI构建4S店客户跟踪数据分析系统</a>
						</li>
						<li class="custom-portal-news-item">
							<a href="/news">[2013-10-18] 赛思商业智能中标哈尔滨工程大学数据中心项目之BI产品选型</a>
						</li>
					</ul>				
				</div>
			</@sz.commons.widget>
		</span>
		<span class="custom-portal-layout">
			<@sz.commons.widget id="news" title="规章制度">
				<div class="sz-commons-simplelist-container">
					<table data-szclass="sz.commons.SimpleList" class="sz-commons-simplelist">
						<thead>
							<tr>
								<th data-szclass="sz.commons.SimpleList.ColumnItem" class="text-align-left" style="width:26px;">
									<div class="text-ellipsis" style="width:26px;" onmouseover="sz.commons.SimpleList.overHeaderEvent.call(this, event)" onmouseout="sz.commons.SimpleList.outHeaderEvent.call(this, event)">序号
										<div onmousedown="sz.commons.SimpleList.resizebarEvent.call(this, event)" class="sz-commons-simplelist-resizebar"></div>
									</div>
								</th>
								<th data-szclass="sz.commons.SimpleList.ColumnItem" class="text-align-left" style="width:100px;">
									<div class="text-ellipsis" style="width:100px;" onmouseover="sz.commons.SimpleList.overHeaderEvent.call(this, event)" onmouseout="sz.commons.SimpleList.outHeaderEvent.call(this, event)">时间
										<div onmousedown="sz.commons.SimpleList.resizebarEvent.call(this, event)" class="sz-commons-simplelist-resizebar" style="display: none;"></div>
									</div>
								</th>
								<th data-szclass="sz.commons.SimpleList.ColumnItem" class="text-align-left" style="width:120px;">
									<div class="text-ellipsis" style="width:120px;" onmouseover="sz.commons.SimpleList.overHeaderEvent.call(this, event)" onmouseout="sz.commons.SimpleList.outHeaderEvent.call(this, event)">内容
										<div onmousedown="sz.commons.SimpleList.resizebarEvent.call(this, event)" class="sz-commons-simplelist-resizebar" style="display: none;"></div>
									</div>
								</th>
								<th data-szclass="sz.commons.SimpleList.ColumnItem" class="text-align-left" style="width:40px;">
									<div class="text-ellipsis" style="width:40px;" onmouseover="sz.commons.SimpleList.overHeaderEvent.call(this, event)" onmouseout="sz.commons.SimpleList.outHeaderEvent.call(this, event)">发件人
										<div onmousedown="sz.commons.SimpleList.resizebarEvent.call(this, event)" class="sz-commons-simplelist-resizebar" style="display: none;"></div>
									</div>
								</th>
								<th class="placeholder"></th>
							</tr>
						</thead>
						<tbody>
							<tr id="row1" data-szclass="sz.commons.SimpleList.RowItem">
								<td style="width:26px;" class="text-align-left" title="">
									<div class="text-ellipsis" style="width:26px;">2</div>
								</td>
								<td style="width:100px;" class="text-align-left" title="3月28日 17:00">
									<div class="text-ellipsis" style="width:100px;">3月28日 17:00</div>
								</td>
								<td style="width:120px;" class="text-align-left" title="待办提示信息">
									<div class="text-ellipsis" style="width:120px;">待办提示信息</div>
								</td>
								<td style="width:40px;" class="text-align-left" title="">
									<div class="text-ellipsis" style="width:40px;">
										<a href="" onclick="">李四</a>
									</div>
								</td>
								<td></td>
							</tr>
							<tr id="row0" data-szclass="sz.commons.SimpleList.RowItem">
								<td style="width:26px;" class="text-align-left" title="">
									<div class="text-ellipsis" style="width:26px;">1</div>
								</td>
								<td style="width:100px;" class="text-align-left" title="3月26日 11:48">
									<div class="text-ellipsis" style="width:100px;">3月26日 11:48</div>
								</td>
								<td style="width:120px;" class="text-align-left" title="待办提示信息">
									<div class="text-ellipsis" style="width:120px;">待办提示信息</div>
								</td>
								<td style="width:40px;" class="text-align-left" title="">
									<div class="text-ellipsis" style="width:40px;">
										<a href="" onclick="">张三</a>
									</div>
								</td>
								<td></td>
							</tr>
							<tr id="row2" data-szclass="sz.commons.SimpleList.RowItem">
								<td style="width:26px;" class="text-align-left" title="">
									<div class="text-ellipsis" style="width:26px;">3</div>
								</td>
								<td style="width:100px;" class="text-align-left" title="3月13日 17:57">
									<div class="text-ellipsis" style="width:100px;">3月13日 17:57</div>
								</td>
								<td style="width:120px;" class="text-align-left" title="待办提示信息">
									<div class="text-ellipsis" style="width:120px;">待办提示信息</div>
								</td>
								<td style="width:40px;" class="text-align-left" title="">
									<div class="text-ellipsis" style="width:40px;">
										<a href="" onclick="">王五</a>
									</div>
								</td>
								<td></td>
							</tr>
							<tr id="row1" data-szclass="sz.commons.SimpleList.RowItem">
								<td style="width:26px;" class="text-align-left" title="">
									<div class="text-ellipsis" style="width:26px;">2</div>
								</td>
								<td style="width:100px;" class="text-align-left" title="3月28日 17:00">
									<div class="text-ellipsis" style="width:100px;">3月28日 17:00</div>
								</td>
								<td style="width:120px;" class="text-align-left" title="待办提示信息">
									<div class="text-ellipsis" style="width:120px;">待办提示信息</div>
								</td>
								<td style="width:40px;" class="text-align-left" title="">
									<div class="text-ellipsis" style="width:40px;">
										<a href="" onclick="">李四</a>
									</div>
								</td>
								<td></td>
							</tr>
							<tr id="row0" data-szclass="sz.commons.SimpleList.RowItem">
								<td style="width:26px;" class="text-align-left" title="">
									<div class="text-ellipsis" style="width:26px;">1</div>
								</td>
								<td style="width:100px;" class="text-align-left" title="3月26日 11:48">
									<div class="text-ellipsis" style="width:100px;">3月26日 11:48</div>
								</td>
								<td style="width:120px;" class="text-align-left" title="待办提示信息">
									<div class="text-ellipsis" style="width:120px;">待办提示信息</div>
								</td>
								<td style="width:40px;" class="text-align-left" title="">
									<div class="text-ellipsis" style="width:40px;">
										<a href="" onclick="">张三</a>
									</div>
								</td>
								<td></td>
							</tr>
							<tr id="row2" data-szclass="sz.commons.SimpleList.RowItem">
								<td style="width:26px;" class="text-align-left" title="">
									<div class="text-ellipsis" style="width:26px;">3</div>
								</td>
								<td style="width:100px;" class="text-align-left" title="3月13日 17:57">
									<div class="text-ellipsis" style="width:100px;">3月13日 17:57</div>
								</td>
								<td style="width:120px;" class="text-align-left" title="待办提示信息">
									<div class="text-ellipsis" style="width:120px;">待办提示信息</div>
								</td>
								<td style="width:40px;" class="text-align-left" title="">
									<div class="text-ellipsis" style="width:40px;">
										<a href="" onclick="">王五</a>
									</div>
								</td>
								<td></td>
							</tr>
						</tbody>
					</table>
				</div>
			</@sz.commons.widget>
		</span>		
	</div>
</@sz.commons.html.simplehtml>