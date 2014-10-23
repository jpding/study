<#--
@depends sz.commons.html,sz.commons.jtree
-->
<@sz.commons.htmlDirective>	
	<@sz.commons.html.head>
		<link rel="stylesheet" href="css/style1.css" type="text/css" media="screen"/>
		<link rel="stylesheet" href="css/style2.css" type="text/css" media="screen"/>
		<@script src="js/jquery.bgiframe.js"/>
		<@script src="js/dwz.min.js"/>
		<@script src="js/dwz.ui.js"/>
	</@sz.commons.html.head>
	<@sz.commons.html.body>
	<style>
		#header{height:120px}
		#header .logo{height:90px;width:60%}
		#header .headerNav {height:90px; background-position:100% -90px;}
		#header .right {
			height:90px; 
			width:40%;
			float:left;
		}
		#navMenu {height:30px;padding-left:210px;}
		#leftside, #container, #splitBar, #splitBarProxy{top:120px}
		#header .nav  li  a {color:#1e6ec4;}
		#header .nav {
			top:18px;
		}
	</style>
	<div id="layout">
		<div id="header">
			<div class="headerNav">
				<span class="logo"></span>
				<span class="right">
					<ul class="nav">
						<li><a href="${url('/personal#page=password')}" target="_blank">${login().getUser().getName()}</a></li>
						<li><a href="${url('/meta/bbs?shownavbar=false')}" target="_blank">论坛</a></li>
						<li><a href="${url('/logout')}">注销</a></li>
					</ul>
				</span>
			</div>
		
			<div id="navMenu">
				<ul>
					<li class="selected"><a href="${url('/law/leftree?resid=LAWCONT:/analyses/index/portal_func&showtype=')}"><span>功能导航</span></a></li>
					<li><a id="map_yw" href="${url('/law/leftree?resid=LAWCONT:/analyses/index/portal_busiflow&showtype=tree')}"><span>业务流程图</span></a></li>
					<li><a id="pmsg" href="${url('/meta/bbs?shownavbar=false#boardid=pmsg')}" target="navTab" external="true" rel="pmsg"><span>我的消息</span></a></li>
					<li><a href="${url('/law/leftree?resid=LAWCONT:/analyses/index/portal_anal&showtype=tree')}"><span>决策分析</span></a></li>
				<#--	<li><a id="lawrepo" href="${url("/meta/LAWCONT/analyses/法律知识库/portal")}" target="_blank"><span>法律知识库</span></a></li> -->
				    <li><a id="lawrepo" href="${url('/law/leftree?resid=140541977&showtype=tree')}" target="_blank"><span>法律知识库</span></a></li>
					<li><a href="${url('/law/leftree?resid=LAWCONT:/analyses/index/portal_anal')}"><span>帮助</span></a></li>
				</ul>
			</div>
		</div>

		<div id="leftside">
			<div id="sidebar_s">
				<div class="collapse">
					<div class="toggleCollapse"><div></div></div>
				</div>
			</div>
			<div id="sidebar">
				<div class="toggleCollapse"><h2>功能树</h2><div>收缩</div></div>

				<div class="accordion" fillSpace="sidebar">
					<@navtree2 menus=itemMenus/>
				</div>

			</div>
		</div>
		<div id="container">
			<div id="navTab" class="tabsPage">
				<div class="tabsPageHeader">
					<div class="tabsPageHeaderContent"><!-- 显示左右控制时添加 class="tabsPageHeaderMargin" -->
						<ul class="navTab-tab">
							<li tabid="main" class="main"><a href="javascript:;"><span><span class="home_icon">我的主页</span></span></a></li>
						</ul>
					</div>
					<div class="tabsLeft">left</div><!-- 禁用只需要添加一个样式 class="tabsLeft tabsLeftDisabled" -->
					<div class="tabsRight">right</div><!-- 禁用只需要添加一个样式 class="tabsRight tabsRightDisabled" -->
					<div class="tabsMore">more</div>
				</div>
				
				<ul class="tabsMoreList">
					<li><a href="javascript:;">我的主页</a></li>
				</ul>
				
				<div class="navTab-panel tabsPageContent layoutBox">
					<div class="page unitBox">
						<iframe src="${url('/meta/LAWCONT/analyses/index/newhome.ftl')}" style="width:100%;height:522px;" frameborder="no" border="0" marginwidth="0" marginheight="0"></iframe>
					</div>
				</div>
			</div>
		</div>
	</div>

	<#---
	<div id="footer">Copyright &copy; 2014 <a href="http://www.succez.com" target="dialog">东方赛思软件有限公司</a></div>
	-->	
		<@script src="${asset('jquery.bgiframe.js')}"/>
		<@script src="${asset('dwz.min.js')}"/>
		<@script src="${asset('dwz.ui.js')}"/>
		<@script>
			var url = "${url('/meta/LAWCONT/analyses/index/newhome/js/dwz.frag.xml')}";
			DWZ.init(url, {
				loginUrl:"login_dialog.html", 
				loginTitle:"登录",	// 弹出登录对话框
				debug:false,	// 调试模式 【true|false】
				callback:function(){
					initEnv2();
					
					var hrefArr = ['#pmsg'];
					$.each(hrefArr, function(k, v){
						var ywHref = $(v); 
						ywHref.off("click");
						ywHref.click(function(event){
							addNavTabEvent(ywHref, event);
						});	
					})
					
					
					$("#themeList").theme({themeBase:"themes"});
				}
			});
		</@script>
		
	</@sz.commons.html.body>
</@sz.commons.htmlDirective>

<#macro navtree2 menus>

	<#list menus as item>
	<div class="accordionHeader">
		<h2><span>Folder</span>${item.caption}</h2>
	</div>
	
	<div class="accordionContent">
		<div id="p_${item.id}" class="navtree" style="width:100%;height:100%">
			<ul id="${item.id}" class="navtreedom">
			
			</ul>
		</div>
	</div>
	<@script>
		var ulDom = $("#${item.id}");
		var data = ${item.treeData};
		var tree = sz.commons.JTree.create({
			pdom:ulDom,
			data:data,
			view : {
				addDiyDom : function(treeId, treeNode){
					if(treeNode.url){
						var a = $("#"+treeNode.tId+"_a");
						a.attr("external", "true");
						a.attr("rel", treeNode.tId);
					}
				}
			}
		});
	</@script>
	</#list>
</#macro>