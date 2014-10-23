<#--
@depends sz.commons.box,sz.commons.dialog,sz.commons.button,sz.commons.menu,sz.commons.menu.menuitem
@depends sz.metadata.layout.treelayout,sz.commons.button
@depends sz.metadata.metatoolbar,sz.metadata.icons
@depends sz.metadata.metaoprgrid,sz.metadata.help
-->
<@sz.metadata.layout.treelayout>
	<@pin name="header">
		<div style="display:none;"><@metatoolbar category=category/></div>
		<@button id="sz-metadata-metatoolbar-metareturnbutton2" icon="sz-metadata-icons-return2" click="window.location=sz.sys.ctx('${currentParentPath}')"/>
		<div class="sz-metadata-metatoolbar-separate"></div>
		<@button.add caption="目录" icon="sz-metadata-icons-createfold" onclick="sz.metadata.metatoolbar.metacreatebutton._onclick_new_menu(\"/metaapi/create?type=ModelMetaFold&showcreatebutton=true&presid=${currentpath}\")"/>
		<div class="sz-metadata-metatoolbar-separate"></div>
		<@button.remove onclick="sz.metadata.metaoprgrid._onclick_remove_btn()"/>
		<div class="sz-metadata-metatoolbar-separate"></div>
		<@button.remove caption="导入" icon="sz-metadata-icons-import" onclick="sz.metadata.metaoprgrid._onclick_import_menu(this)"/>
	</@pin>
	<@pin name="content"><@metaoprgrid data=listdata pag=pag usage="project" sort=sort entitytype=entitytype selected=selected/>
		<@script>
			var baseUrl = sz.sys.ctx("${actionurl}");
			var hideParams = "&shownavtree=false&shownavbar=false&showtitlebar=false";
			
			sz.metadata.metatoolbar.metacreatebutton._onclick_new_menu = function(url) {
				if (!this.newdialog) {
					this.newdialog = sz.commons.Dialog.create();
				}
				
				this.newdialog.on("success", function(){
					window.location.reload();
					return true;
				});
				
				this.newdialog.showHtml({
					url : sz.sys.ctx(url)
				});
			}
			
			sz.metadata.metaoprgrid._onclick_remove_btn = function(){
				var reslist = this.getMetaDataList().getSelectedRowsId();
				if(reslist.length == 0){
					alert("请选择要删除的文件!");
					return ;
				}
				var dialog = this.getDialog();
				dialog.showHtml({
							url : this.prefixUrl + "movetorecycleimpactanalysis",
							data : {
								"reslist" : reslist.join()
							}
						});
			}
			
			
			function modifyEntityUrl(){
				var datalist = $("#metadatalist");
				datalist.find("a[target!='_blank']").each(function(idx, value){
					var obj = $(value);
					var path = obj.closest("tr").attr("id");
					obj.attr("href", baseUrl+"path="+path+hideParams);
				});
			}
			
			function modifySubMenuItem(){
				sz.metadata.metaoprgrid.currentEntityId = '${currentpath}';
				
				sz.metadata.metaoprgrid.finishedImport = function(event) {
					var self = this;
					sz.commons.messagebox.hideMessage();
					var dialog = self.getDialog();
					
					/**
					 * 导入完成后刷新当前页面并选中导入的文件。
					 * 20121114 fuzhq
					 *   修改使用/meta/的路径，以使得导入后浏览器url风格保持为路径方式不变
					 */
					dialog.func = function(selected, talkid) {
						if (selected != "") {
							window.location = sz.sys.ctx(metaoprgrid.currentEntityWebUrl) + "?selected=" + metaoprgrid.currentEntityId+"&path="+metaoprgrid.currentEntityId+hideParams;
							return;
						}
						window.location = sz.sys.ctx(metaoprgrid.currentEntityWebUrl);
					}
					
					dialog.showHtml({
								url : self.prefixUrl + "showimportcomfirm",
								data : {
									resid : metaoprgrid.currentEntityId,
									zipfiles : $$(event).uploadFiles[0].fileid
								}
							});
				}
			}
			
			
			modifyEntityUrl();
			modifySubMenuItem();
			
		</@script>
	</@pin>
	
</@sz.metadata.layout.treelayout>