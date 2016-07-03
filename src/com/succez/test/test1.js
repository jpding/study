function oninitdatapanel($cidatapanel) {
    var rpath = '/meta/shwshr/collections/shhr/resources';
    var rimgpath = rpath + '/images';

    var DataTree = sz.ci.DataTree;

    var toolbar = $cidatapanel.getToolBar();
    var __datapanel = $cidatapanel.__datapanel;
    var __datatree = $cidatapanel.getDataTree().__datatree;
    var __datalist = $cidatapanel.getDataList();

    //让机构树只显示文字，而非代码+文字
    
	__datatree.args.displayformat = "@txt";    
    

    var queryString = window.location.search;
    if (!queryString || queryString.indexOf("showtools=true") < 0) {
        toolbar.getButton("tools").visible(false);
    }

    //取得htmlwriter的实例
    var __hw = null;
    var _getHtmlWriter = function() {
        return __hw || (__hw = sz.utils.HtmlWriter.create());
    };
	
	var getCurNode = function(){
		var h = __datatree.getSelectedNode();
		if(h) return h;
		var uid = __datapanel._curUnit;
		return __datatree.getNodeByParam("uid",uid);
	}

    //可以定义按钮文字的alert函数
    var __alert = function(args) {
        args = args || {};
        if (!args.title) {
            args.title = "提示";
        }
        if (!args.btncaption) {
            args.btncaption = "确定";
        }
        var _alert = sz.commons.Alert.show(args);
        if (args && args.btncaption) {
            $$(_alert.basedom().find("[data-szclass='sz.commons.Button']:first")).caption(args.btncaption);
        }
    };
    var KeyValuePairParser = sz.utils.KeyValuePairParser;
    var getLoginFilterJson = function() {
        var inf = __datapanel.loginHierarchies;
        var hs = inf && inf.hierarchies;
        if (hs) {
            var len = hs.length;
            var uid = null;
            var kvpp = KeyValuePairParser.create({
                sep: KeyValuePairParser.KVP_SEPS,
                eq: KeyValuePairParser.KVP_EQS
            });
            for (var i = 0; i < len; i++) {
                uid = hs[i];
                if (uid.indexOf("=999999999999") > -1) {
                    continue;
                } else {
                    return kvpp.toMap(uid);
                }
            }
        } else {
            return null;
        }
    };
    var _loginFilter = getLoginFilterJson();
    var isYy = !!_loginFilter && !!_loginFilter.IRPT_DEPARTMENTS_YY; //简单的通过身份级次来判断一下是不是医院
    var isWsj = !isYy; //判断登录的是不是卫生局
    sz.ci._isYy = isYy;
    sz.ci._isWsj = isWsj;

    //进行调出操作
    var _getOutHierarchies = function() {
        var selected = __datalist.getSelectedHierarchy();
        var checked = __datalist.getCheckedNodes();
        var hierarchiesObj = checked || (selected && [selected]);
        return hierarchiesObj;
    };
    var _dooutDlg = null;
    var showOutDlg = function(args) {
        if (!_dooutDlg) {
            _dooutDlg = sz.commons.Dialog.create({
                title: "调出"
            });
            var $c = _dooutDlg.getHtmlContainer();
            $c[0].style.textAlign = "center";
            $c[0].style.paddingTop = "9px";
            //$c[0].style.position = "relative";
            $('<span style="margin-top: 8px;">调出日期：</span>').appendTo($c);
			var lc = sz.commons.DateCombobox.create({
				    pdom			: $c,
				    editable	: true,
				    value			: __datapanel.getPeriod()
			    });
			$("<br/>").appendTo($c);
            $('<span>调出方式：</span>').appendTo($c);
            var _domcomb = sz.bi.dw.dimpanel.DimCombobox.create({
                pdom: $c,
                id: "inoutcomb",
                dimpath: "shwshr:/datamodels/DIM_RYLDQK",
                rootitems: "2"
            });
            _dooutDlg.on("ok", function(event) {
                var ld = _domcomb.val();
                var period = lc.val();
                if (!ld) {
                    alert("您还未选择调出方式");
                    return false;
                } else {
                    if (args.success) {
                        args.success(ld, period);
                    }
                }
            });
        }
        _dooutDlg.show();
    };
    var doout = function(args) {
        var hierarchiesObj = _getOutHierarchies();

        var _getSuccessMsg = function(hierarchiesObj) {
            var len = hierarchiesObj.length;

            var _html = _getHtmlWriter();
            _html.clear().span().gt().text("成功调出 " + len + "人：").spanEnd();
            _html.write("<br/>");

            var h = null;
            for (var i = 0; i < len; i++) {
                h = hierarchiesObj[i];
                _html.p().gt().text(h.$ppts.SYS_ID).text(" ").text(h.$ppts.SYS_NAME).spanEnd();
            }

            return _html.toString();
        };

        var _getConfirmMsg = function(hierarchiesObj) {
            var len = hierarchiesObj.length;

            var _html = _getHtmlWriter();
            _html.clear().span().gt().text("您是否确认调出 " + len + "人：").spanEnd();
            _html.write("<br/>");

            var h = null;
            for (var i = 0; i < len; i++) {
                h = hierarchiesObj[i];
                _html.p().gt().text(h.$ppts.SYS_ID).text(" ").text(h.$ppts.SYS_NAME).spanEnd();
            }

            return _html.toString();
        };

        if (hierarchiesObj && hierarchiesObj.length > 0) {
            showOutDlg({
                success: function(ld, period) {
                    var hierarchiesObj = _getOutHierarchies();
                    var len = hierarchiesObj.length;
                    var h = null;
                    var gids = null;
                    var params = [];
                    for (var i = 0; i < len; i++) {
                        h = hierarchiesObj[i];
                        gids = sz.utils.parseKeyValuePairs(h.uid);
                        params.push({
                            idcard: gids.SFZJHM,
                            wsj: gids.IRPT_DEPARTMENTS_WSJ,
                            yy: gids.IRPT_DEPARTMENTS_YY,
                            lb: gids.DIM_SJCX_WSJGLBDM,
                            ld: ld,
                            period: period
                        });
                    }
                    if (params.length > 0) {
                        var dlg = sz.commons.Confirm.show({
                            title: "确认",
                            msg: _getConfirmMsg(hierarchiesObj),
                            modal: true,
                            onok: function() {
                                sz.commons.messagebox.showWaiting("正在调出...");
                                $.ajax({
                                    url: sz.sys.ctx(rpath + '/out.action'),
                                    data: {
                                        hierarchies: JSON.stringify(params)
                                    },
                                    success: function() {
                                        if (__datapanel.isFillFormsShow()) {
                                            __datapanel.closeFillForms();
                                        }
                                        __datalist.refresh();
                                        sz.commons.messagebox.hideMessage();
                                        __alert({
                                            title: "调出完成",
                                            msg: _getSuccessMsg(hierarchiesObj),
                                            btncaption: "我知道了"
                                        });
                                    },
                                    error: function() {
                                        sz.commons.messagebox.hideMessage();
                                    }
                                });
                            }
                        });

                    }
                }
            });
        }
    };

    //人力信息管理界面定制
    var dohrmgr = function() {
        //=============================自定义按钮 开始=============================
        toolbar.getButton("save").visible(false);

        toolbar.getButton("fill").caption("新人入职");

        var _downloadDlg = null; //导出后提供下载的对话框
        var _showDownloadDlg = function(title, links) {
            if (links && links.length) {
                var $c = null;
                if (!_downloadDlg) {
                    _downloadDlg = sz.commons.Dialog.create();
                    _downloadDlg.getButtonById("cancel").visible(false);
                    _downloadDlg.getButtonById("ok").caption("我知道了");
                    $c = _downloadDlg.getHtmlContainer();
                    $c.css({
                        textAlign: "center",
                        paddingTop: "11px"
                    });
                }
                _downloadDlg.setParams({
                    title: title
                });
                if (!$c) $c = _downloadDlg.getHtmlContainer();
                var html = _getHtmlWriter();
                html.clear();
                var len = links.length;
                var link = null;
                for (var i = 0; i < len; i++) {
                    link = links[i];
                    if (!link) continue;
                    if (i > 0) {
                        html.write("<br/>");
                    }
                    /**
					* 20150107 wh
					* BI-12876 导出excel，第一次下载出现对话框无法关闭的问题
					* wh提供的解决方案：
                    * 改成不在当前页下载，就可以了。
					*/
					// html.a().attr("href", link[1]).gt().text(link[0]).aEnd();  //原来的代码
                    html.a().attr("href", link[1]).attr('onclick', 'sz.utils.downloadFile(event)').gt().text(link[0]).aEnd();
                }
                $c.html(html.toString());
                _downloadDlg.show();
            }
        };

        var _uploadDlg = null; //导入时上传用的对话框
        var _showUploadDlg = function(title, url, action, previewaction) {
            if (!_uploadDlg) {
                _uploadDlg = sz.commons.Dialog.create();
                var $c = _uploadDlg.getHtmlContainer();
                $c.css({
                    textAlign: "center",
                    paddingTop: "11px"
                });
                _uploadDlg.on("ok", function(event) {
                    var compUpload = $$(_uploadDlg.basedom().find("#uploadfiles:first"));
                    var fn = compUpload.uploadFiles[0].fileid;
                    var url = sz.sys.ctx(action);
                    var datahierarchies = __datapanel._curUnit;
                    sz.commons.messagebox.showWaiting("正在导入数据...");
                    $.ajax({
                        url: action,
                        data: {
                            uploadfiles: fn,
                            datahierarchies: datahierarchies
                        },
                        success: function(data) {

                            sz.commons.messagebox.hideMessage();
                            __datalist.refresh();
                            //data.log += '<a class="importlog-view" href="' + sz.sys.ctx(data.link) + '">＞ 查看导入数据</a>';
                            var logs = $c.find('.importlog');
                            logs.empty();
                            logs.html(data.log);
                            var download = $c.find('.downloadlog');
							download.empty();
							download.html('<a class="importlog-view" href="' + data.link + '"> 下载日志 </a>');
                            _uploadDlg.getButtonById("ok").visible(false);
                            _uploadDlg.getButtonById("cancel").caption("关闭");
							/**
							var poller = sz.utils.Poller.create({
					        	taskid		: taskid,
					        	querylog	: false
				        	});
				    		poller.one(sz.utils.Poller.EVENTS.FINISH, function(event) {
				    			// 需要再一次请求所有的日志信息
				    			$.ajax({
                    				url: sz.sys.ctx(rpath + "/importexcel.action?method=querylog"),
                    				data: {
                        				taskid: taskid
                    				},
                    				success: function(logs) {
				    					var importlog = $c.find('.importlog');
                            			importlog.empty();
										importlog.append(logs);
				    					_uploadDlg.getButtonById("ok").visible(false);
                            			_uploadDlg.getButtonById("cancel").caption("关闭");
                        				sz.commons.messagebox.hideMessage();
                    				},
                    				error: function() {
                        				sz.commons.messagebox.hideMessage();
                    				}
                				});
								
				        	});
				    		poller.one(sz.utils.Poller.EVENTS.ERROR, function(event) {
					        	var feedback = event.feedback;
					        	sz.commons.messagebox.hideMessage();
				        	});
				    		poller.execute();
							**/
                        },
                        error: function() {
                            sz.commons.messagebox.hideMessage();
                        }
                    });
                    return false;
                });
            }
            _uploadDlg.setParams({
                title: title
            });
            _uploadDlg.show({
                url: url,
                success: function() {
                    _uploadDlg.getButtonById("ok").caption("导入");
					_uploadDlg.getButtonById("ok").visible(false);
                    var compUpload = $$(_uploadDlg.basedom().find("#uploadfiles:first"));
                    var fn = compUpload.uploadFiles[0].fileid;
                    compUpload.onchange = function(event) {
                        $.ajax({
                            url: previewaction,
                            data: {
                                files: compUpload.uploadFiles,
                                uploadfiles: fn
                            },
                            success: function(data) {
                                // sz.commons.messagebox.hideMessage();
                                // __datalist.refresh();
                                // data.log += '<a class="importlog-view" href="' + sz.sys.ctx(data.link) + '">＞ 查看导入数据</a>';
                                var $c = _uploadDlg.getHtmlContainer();
                                var logs = $c.find('.importlog');
                                logs.empty();
                                logs.html(data);
								_uploadDlg.getButtonById("ok").visible(true);
                            }
                        });
                    }
                }
            });
        };
        var _importmu = sz.commons.Menu.create({
            'id': 'importmu'
        });
        _importmu.insertItems([{
            'caption': '导出为DBF',
            'onclick': function(event) {
                var h = getCurNode();
                sz.commons.messagebox.showWaiting("正在导出DBF数据...");
                $.ajax({
                    url: sz.sys.ctx(rpath + "/exportdbf.action?method=execute"),
                    data: {
                        datahierarchies: h.uid,
                        fn: "N02_" + h.$ppts.SYS_NAME
                    },
                    success: function(data) {
                        _showDownloadDlg("导出为DBF", data.links);
                        sz.commons.messagebox.hideMessage();
                    },
                    error: function() {
                        sz.commons.messagebox.hideMessage();
                    }
                });
            }
        }, {
            'caption': '导出为Excel',
            'onclick': function(event) {
                var h = getCurNode();
                sz.commons.messagebox.showWaiting("正在导出Excel数据...");
                $.ajax({
                    url: sz.sys.ctx(rpath + "/exportexcel.action?method=execute"),
                    data: {
                        datahierarchies: h.uid,
                        fn: h.$ppts.SYS_ID + "(" + h.$ppts.SYS_NAME + ")"
                    },
                    success: function(data) {
                        _showDownloadDlg("导出为Excel", data.links);
                        sz.commons.messagebox.hideMessage();
                    },
                    error: function() {
                        sz.commons.messagebox.hideMessage();
                    }
                });
            }
        }, {
            'caption': '-'
        }, {
            'caption': '导入DBF数据',
            'onclick': function(event) {
                _showUploadDlg("导入DBF数据", sz.sys.ctx(rpath + "/importdbf.ftl"), sz.sys.ctx(rpath + "/importexcel.action?method=importData"), sz.sys.ctx(rpath + "/importexcel.action?method=preview"));
            }
        }
							   , {
            'caption': '导入Excel数据',
            'onclick': function(event) {
                _showUploadDlg("导入Excel数据", sz.sys.ctx(rpath + "/importexcel.ftl"), sz.sys.ctx(rpath + "/importexcel.action?method=importData"), sz.sys.ctx(rpath + "/importexcel.action?method=preview"));
            }
        }
							  ]);
        toolbar.addButton({
            id: "importexport",
            caption: "导入导出",
            next: "tools",
            menu: 'importmu',
            icon: rimgpath + "/download.png"
        });
        // 始终显示批量审核按钮
        var btnDataAudit = toolbar.addButton({
            id: 'dataaudit',
            caption: '批量审核',
            icon: 'sz-ci-datapanel-icon-check',
            prev: 'btnAudit',
            click: function() {
                //__datapanel.doDataAudit();

                if (!__datapanel._hasDataSubmit()) {
                    alert('没有上报过数据，无法成批审核');
                    return;
                }

                var checkedNodes = __datapanel.getCheckedNodes() || [];
                var dhs = [];
                for (var i = 0, len = checkedNodes.length; i < len; i++) {
                    // BI-12525 20141208 dw
                    if (checkedNodes[i].uid.indexOf('newhierarchy') >= 0) {
                        alert('没有保存、或者上报的数据，无法成批审核。');
                        return;
                    }
                    dhs.push(checkedNodes[i].uid);
                }
				//20150104 dw
				//审核审的是本医院和99999医院的数据；解决办法：审核加参数，设置本医院uid
               	var datahierarchies = __datapanel._curUnit;
                if (dhs.length == 0)
                    dhs.push(datahierarchies);

                sz.ci.DataAudit.showDataAuditDlg({
                    resid: __datapanel.info['resid'],
                    formset: __datapanel.info['formset'],
                    dataPeriods: [__datapanel.getPeriod()],
                    dataPeriodCaptions: [__datapanel.getDataPeriod().text()],
                    dataHierarchies: dhs,
                    settings: {
                        'exportColumns': [{
                            'XXB.GH': '工号'
                        }, {
                            'XXB.XM': '姓名'
                        }, {
                            'XXB.SFZJHM': '身份证件号码'
                        }]
                    },
                    success: function() {}
                });
            }
        });

        var _btnDoout = toolbar.addButton({
            id: "btndoout",
            caption: "调出",
            next: 'importexport',
            icon: rimgpath + "/move-to.png",
            click: function(event) {
                doout();
            }
        });

        var _btnDoin = toolbar.addButton({
            id: "btndoin",
            caption: "调入",
            next: 'importexport',
            icon: rimgpath + "/move-down.png",
            click: function(event) {
                window.location.href = window.location.pathname + '?ci_isin=true&selectedId=' + sz.utils.getParameter('selectedId');
            }
        });

        // 为了方便医疗机构查找未通过审核的数据，需要提供查找所有未通过审核数据的入口
        // 增加审核状态查询按钮：全部、通过审核、未通过审核，来过滤人力清单中的数据
        sz.ci._auditFilter = sz.ci._bzkscombFilter = sz.ci._kscombFilter = '';
        var btnAuditfilter = toolbar.addButton({
            id: 'auditfilter',
            caption: '全部',
            menu: 'm-auditfilter'
        });
        var mauditfilter = sz.commons.Menu.create({
            id: 'm-auditfilter'
        });
        mauditfilter.insertItems([{
            'caption': '全部',
            'onclick': function() {
                sz.ci._auditFilter = '';
                __datalist.setItemFilter(FILTER_DL_NOOUT + sz.ci._bzkscombFilter + sz.ci._kscombFilter);
                _refreshDataList();
                btnAuditfilter.caption('全部');
				btnAuditfilter._isaudit = null;
            }
        }, {
            'caption': '通过审核',
            'onclick': function() {
                sz.ci._auditFilter = ' and CI_INDEX.CI_AUDITTAG==1';
                __datalist.setItemFilter(FILTER_DL_NOOUT + sz.ci._auditFilter + sz.ci._bzkscombFilter + sz.ci._kscombFilter);
                _refreshDataList();
                btnAuditfilter.caption('通过审核');
                btnAuditfilter._isaudit = true;
            }
        }, {
            'caption': '未通过审核',
            'onclick': function() {
                sz.ci._auditFilter = ' and (CI_INDEX.CI_AUDITTAG!=1 or CI_INDEX.CI_AUDITTAG is null)';
                __datalist.setItemFilter(FILTER_DL_NOOUT + sz.ci._auditFilter + sz.ci._bzkscombFilter + sz.ci._kscombFilter);
                _refreshDataList();
                btnAuditfilter.caption('未通过审核');
                btnAuditfilter._isaudit = false;
            }
        }]);

        //=============================自定义按钮 结束=============================


        //=============================调整按钮可用性 开始=============================
        toolbar.on("statechange", function(event) {
            if (isWsj) return;
            var selected = __datalist.getSelectedHierarchy();
            var checked = __datalist.getCheckedNodes();
            var rs = (checked && checked.length > 0) || (selected && __datapanel.isFillFormsShow());
            _btnDoout.enabled(rs);
        });
        //=============================调整按钮可用性 结束=============================


        //=============================设置明细数据列表只显示在职人员 开始=============================
        var FILTER_DL_NOOUT = "self.IRPT_DEPARTMENTS_WSJ!=999999999999";
        __datalist.setItemFilter(FILTER_DL_NOOUT);
        //__datatree.args.itemfilter = "self.IRPT_DEPARTMENTS_WSJ!=999999999999";
        //=============================设置明细数据列表只显示在职人员 结束=============================

        //=============================在树型结构上去掉虚拟单位 开始=============================
        var _nodesFilter = function(newNodes) {
            var _newNodes = [];
            var len = newNodes.length;
            var node = null;
            for (var i = 0; i < len; i++) {
                node = newNodes[i];
                if (node && node.uid.indexOf("999999999999") < 0) {
                    _newNodes.push(node);
                }
            }
            len = _newNodes.length;
            newNodes.length = 0;
            for (var i = 0; i < len; i++) {
                newNodes.push(_newNodes[i]);
                if (_newNodes[i].children) {
                    _nodesFilter(_newNodes[i].children);
                }
            }
        };
        if(__datatree){
        	__datatree.one("asyncDone", function(event) {
	            _nodesFilter(event.newNodes);
	            // 同步列头的移动
	            var $treegridHeader = $('.treegrid-header');
	            $('.treegrid-body').on('scroll', function(e) {
	                $treegridHeader.scrollLeft($(this).scrollLeft())
	            });
	
	        });
        }
        
        //=============================在树型结构上去掉虚拟单位 结束=============================


        //=============================自定义列表抬头 开始=============================
        //让抬头总是显示出来
        var $dltitle = $("#dldatatitle");
        $dltitle[0].style.display = "block";
        var $dlscrollbox = $(".sz-ci-datapanel-datalist-scrollbox");
        $dlscrollbox[0].style.top = "38px";

        //让抬头里显示医院名称和在岗人数
        $('<span id="dldatatitlecname"></span><span id="dldatatitlecnt" style="color: red;"></span>').appendTo($dltitle);
        var $dlcname = $dltitle.find("#dldatatitlecname"); //装医疗机构名称的元素
        var $dlcnt = $dltitle.find("#dldatatitlecnt"); //装在岗人数的元素

        //抬头上要更新医院名称和在岗人数
        var _updatedltitle = function() {
            var nodes = __datatree.getSelectedNodes();
            var node = nodes[0];
            var dimname = node && node.dimname;
            if (dimname === "IRPT_DEPARTMENTS_YY") {
                $dlcname.text(node.$ppts.SYS_NAME);
                //$dlcnt[0].style.display = "";
            } else if (dimname === "DIM_SJCX_WSJGLBDM") {
                var pnode = node.getParentNode();
                $dlcname.text(pnode.$ppts.SYS_NAME + " " + node.$ppts.SYS_NAME);
            } else if (dimname === "IRPT_DEPARTMENTS_WSJ") {
                $dlcname.text(node.$ppts.SYS_NAME);
            } else {
                $dlcname.text("");
                //$dlcnt[0].style.display = "none";
            }

            // if (node) {
            //     var ppts = node.$ppts;
            //     var unauditcnt = ppts['UN_AUDIT_CNT'];
            //     if (unauditcnt && unauditcnt > 0) {
            //         __datatree.basedom().find('.treegrid-header-table-td.first>li>span:eq(1)').text('单位名称（未通过审核人数）');
            //     }
            // }
        };

        var $nbkslayout = $('<span style="margin:0 0 0 8px;display:none">科室<span class="nbks_container" style="margin:0 0 0 4px"></span></span>').appendTo($dltitle);
        //增加抬头上的科室过滤下拉框
        var _kscomb = sz.bi.dw.dimpanel.DimCombobox.create({
            pdom: $nbkslayout.children('.nbks_container'),
            id: "kscomb",
            dimpath: "shwshr:/datamodels/dim_nbks",
            showclean: true
        });

        var $bzkslayout = $('<span style="margin:0 0 0 8px;display:none">科室<span class="bzks_container" style="margin:0 0 0 4px"></span></span>').appendTo($dltitle);
        var _bzkscomb = sz.bi.dw.dimpanel.DimCombobox.create({
            pdom: $bzkslayout.children('.bzks_container'),
            id: "bzkscomb",
            dimpath: "shwshr:/datamodels/dim_bzks",
            showclean: true,
            visible: false,
            visibled: false
        });
        // 用来动态调整列表的固定列头是否可见，因为固定列头在有滚动条时才出现的，在刷新了数据后，如行数减少且没有滚动条时，如果不隐藏固定列头则会出现列头与数据错位显示的问题
        var _checkFixedContent = function() {
            var sl = __datalist.getSimpleList();
            var content = sl._getContent()[0];
            if (content.clientHeight === content.scrollHeight) {
                sl._getFixedContent()[0].style.visibility = 'hidden';
            }
        };
        var _refreshDataList = function() {
            sz.commons.messagebox.showWaiting("加载中...");
            __datalist.refresh({
                success: function() {
                    sz.commons.messagebox.hideMessage();
                    _checkFixedContent();
                }
            });
        };
        var _updateKsComb = function() {
            var nodes = __datatree.getSelectedNodes();
            var node = nodes[0];
            var dimname = node && node.dimname;
            if (dimname === "IRPT_DEPARTMENTS_YY") { //结点是医院
                _kscomb.setItemfilter("self.IRPT_DEPARTMENTS_YY='" + node.$ppts.SYS_ID + "'");
                _bzkscomb.visible(false);
                $bzkslayout.css('display', 'none');

                _kscomb.visible(true);
                // 卫生局登陆，切换医院，科室下拉框要清空
                if (_kscomb.val()) _kscomb.valAndFire(null);
                // 卫生局登陆在卫生局，选择了一项标准科室，然后切换到医院，标准科室的选择没有去掉，导致没有数据
                if (_bzkscomb.val()) _bzkscomb.valAndFire(null);

                $nbkslayout.css('display', '');
            } else if (dimname === "DIM_SJCX_WSJGLBDM") { //结点是机构类别
                //var pnode = node.getParentNode();
                //_kscomb.setItemfilter("self.IRPT_DEPARTMENTS_WSJ.anc='" + pnode.$ppts.SYS_ID + "'");
                _bzkscomb.visible(true);
                $bzkslayout.css('display', '');

                _kscomb.visible(false);
                $nbkslayout.css('display', 'none');
            } else if (dimname === "IRPT_DEPARTMENTS_WSJ") { //结点是卫生局
                //_kscomb.setItemfilter("self.IRPT_DEPARTMENTS_WSJ.anc='" + node.$ppts.SYS_ID + "'");
                _bzkscomb.visible(true);
                $bzkslayout.css('display', '');

                _kscomb.visible(false);
                $nbkslayout.css('display', 'none');
            } else { //如果什么都没选，就给卫生部的过滤条件吧
                //_kscomb.setItemfilter("self.IRPT_DEPARTMENTS_WSJ.anc='910000000001'");
                _bzkscomb.visible(true);
                $bzkslayout.css('display', '');

                _kscomb.visible(false);
                $nbkslayout.css('display', 'none');
            }
        };

        //内部科室change事件过滤内部科室名称字段
        _kscomb.on("change", function(event) {
            sz.ci._bzkscombFilter = '';
            var val = _kscomb.val();

            if (val) {
                sz.ci._kscombFilter = " and self.KSSJMC='" + val + "'"
                __datalist.setItemFilter(FILTER_DL_NOOUT + sz.ci._kscombFilter + sz.ci._auditFilter);
            } else {
                sz.ci._kscombFilter = '';
                __datalist.setItemFilter(FILTER_DL_NOOUT + sz.ci._auditFilter);
            }
            _refreshDataList();
        });
        //标准科室change事件过滤标准科室字段
        _bzkscomb.on("change", function(event) {
            sz.ci._kscombFilter = '';
            var val = _bzkscomb.val();
            if (val) {
                sz.ci._bzkscombFilter = " and self.SZKS.anc='" + val + "'";
                __datalist.setItemFilter(FILTER_DL_NOOUT + sz.ci._bzkscombFilter + sz.ci._auditFilter);
            } else {
                sz.ci._bzkscombFilter = '';
                __datalist.setItemFilter(FILTER_DL_NOOUT + sz.ci._auditFilter);
            }
            _refreshDataList();
        });

        //第一次载入，更新一下抬头
        DataTree.prototype._oldSelectNode = DataTree.prototype.selectNode;
        var isfirst = true;
        DataTree.prototype.selectNode = function() {
            DataTree.prototype._oldSelectNode.apply(this, arguments);
            if (isfirst) {
                _updatedltitle();
                _updateKsComb();
                isfirst = false;
            }
        };

        //点选树上结点的时候，要更新抬头
        __datapanel.on("select", function(event) {
            _updatedltitle();
            _updateKsComb();
            _checkFixedContent();
        });

        //明细列表更新后，更新在职人员的抬头
        var pageComp = __datalist._getPgaeComp();
        pageComp._oldupdate = pageComp.update;
        pageComp.update = function(args) {
            this._oldupdate(args);
            // http://jira.succez.com/browse/BI-12531 显示人数的文字信息，需要根据查看选项（全部、通过审核、未通过审核）调整文字说明
            var auditfilterCaption = btnAuditfilter.caption();
            if (auditfilterCaption === '全部') auditfilterCaption = '';
            var nodes = __datatree.getSelectedNodes();
            var node = nodes[0];
            var cnt;
            if (node) {
                var ppts = node.$ppts;
                if (btnAuditfilter._isaudit === true) {
                    // 通过审核数
                    cnt = ppts['AUDIT_CNT'];
                } else if (btnAuditfilter._isaudit === false) {
                    // 未通过审核数
                    cnt = ppts['UN_AUDIT_CNT'];
                } else {
                    // 在职数
                    cnt = ppts['ZZ_CNT'];
                }
            } else {
                // 从分页中获取的数
                cnt = this.args.total;
            }
            $dlcnt.text("（在岗" + auditfilterCaption + "人数" + cnt + "）");
        };
        //=============================自定义列表抬头 结束=============================


        //=============================自定义人力资源管理的报送单位树 开始=============================
        var mainSplit = $$("#mainsplit");
        mainSplit.showPanel({
            panel1visible: !isYy,
            panel2visible: isYy
        });
        if (isYy) {
            // http://jira.succez.com/browse/BI-12531 医院登陆，区域一不要出现
            var $a = $dlcname.prev('a');
            if ($a.length && $a.attr('szclose')) {
                $a.css('display', 'none');
            }
        }
        //=============================自定义人力资源管理的报送单位树 结束=============================


        //=============================定制医疗机构类别结点的外观 开始=============================
        var columns = __datatree.args.grid.columns;
        var ztreecolumns = __datatree.tree.setting.grid.columns;
        ztreecolumns[0]["handler"]["makeTdText"] = columns[0]["handler"]["makeTdText"] = function(html, setting, level, node, columnIndex, column) {
            var pptname = column.pptname;
            node.$ppts.UN_AUDIT_CNT
            if (node) {
                var $ppts = node.$ppts;
                var _name = $ppts[pptname];
                var style = '',
                    title = '',
                    exhtml = '';
                if (node.dimname === "DIM_SJCX_WSJGLBDM" && pptname === "SYS_NAME") {
                    style = ' style="color:#0000ff"';
                    exhtml = '<span style="color:#0000ff;margin-left:8px">(' + $ppts['SYS_NEXT_TOTAL'] + ')</span>';
                }

                // 未审核的结点
                // var unauditcnt = $ppts['UN_AUDIT_CNT'];
                // if (unauditcnt && unauditcnt > 0) {
                //     style = ' style="color:#ff0000"';
                //     title = ' title="未审核' + unauditcnt + '"';
                //     exhtml += '<span style="color:#ff0000;margin-left:8px">(' + unauditcnt + ')</span>';
                // }
                html.push(['<span', style, title, '>', _name, '</span>', exhtml].join(''));
            } else {
                DataTree.makeTdText(html, setting, level, node, columnIndex, column);
            }
        };
        // 审核状态列
        ztreecolumns[2]["handler"]["makeTdText"] = columns[2]["handler"]["makeTdText"] = function(html, setting, level, node, columnIndex, column) {
            if (node) {
                var unauditcnt = node.$ppts['UN_AUDIT_CNT'];
                html.push(['<div class="sz-ci-datatree-check-', unauditcnt === 0 ? 'yes' : 'no', '"></div>'].join(''));
            } else {
                DataTree.makeTdText(html, setting, level, node, columnIndex, column);
            }
        };
        //=============================定制医疗机构类别结点的外观 结束=============================
    };

    function _hideButtons() {
        if (isWsj) {
            var btns = $('.sz-commons-layout-button-htd1-datapanel').children('.sz-commons-button');
            for (var i = btns.length - 1; i >= 0; i--) {
                // 卫生局登录只能看到审核、批量审核与查看
                if (!(/auditfilter|btnAudit|dataaudit/).test(btns[i].id)) $$(btns[i]).visible(false);
            }
        } else {
            toolbar.getButton("fill").visible(false);
            toolbar.getButton("submit").visible(false);
            toolbar.getButton("delete").visible(false);
            toolbar.getButton("calc").visible(false);
            toolbar.getButton("save").visible(false);
        }
        toolbar.getButton("audit").visible(false);
    };

    //调出管理界面定制
    var dogoout = function() {
        _hideButtons();

        toolbar.addButton({
            id: "hrout",
            caption: "调出"
        });

        var compPeriod = __datapanel.getDataPeriod();
        if (compPeriod) {
            compPeriod.visible(false);
        }
    };

    //调入管理定制
    var dogoin = function() {
        _hideButtons();

        //增加调入方式的维下拉框
        var $toolbar = $(".sz-commons-layout-button-htd1-datapanel:first");
        $('<span id="inreturn"></span><span>调入方式：</span>').appendTo($toolbar);
        var in_retruenbtn = toolbar.addButton({
            id: 'in-return',
            caption: '返回',
            icon: 'sz-app-icon-return',
            click: function() {
                window.location.href = window.location.pathname + '?selectedId=' + sz.utils.getParameter('selectedId');
            }
        });

        in_retruenbtn.basedom().appendTo('#inreturn');

        var _domcomb = sz.bi.dw.dimpanel.DimCombobox.create({
            pdom: $toolbar,
            id: "incomb",
            dimpath: "shwshr:/datamodels/DIM_RYLDQK",
            rootitems: "1"
        });
        
        $('<span style="margin-top: 8px;">调入日期：</span>').appendTo($toolbar);
		var _datecomb = sz.commons.DateCombobox.create({
			    pdom			: $toolbar,
			    id			 : "datecomb",
			    editable	: true,
			    value			: __datapanel.getPeriod()
		    });

        //如果是卫生局进来，还得有个下拉框给他选哪个医院
        //如果不是单独医院，才创建维下拉框
        var _yycomb = null;
        if (!isYy) {
            $('<span style="margin-left: 8px;">调入医院：</span>').appendTo($toolbar);
            var _yycombParams = {
                pdom: $toolbar,
                id: "inyycomb",
                dimpath: "shwshr:/datamodels/机构及用户/IRPT_DEPARTMENTS"
            };
            if (_loginFilter) {
                if (_loginFilter.IRPT_DEPARTMENTS_WSJ) {
                    _yycombParams.rootitems = _loginFilter.IRPT_DEPARTMENTS_WSJ;
                }
                if (_loginFilter.IRPT_DEPARTMENTS_YY) {
                    _yycombParams.itemfilter = "self.ID='" + _loginFilter.IRPT_DEPARTMENTS_YY + "'";
                }
            }
            _yycomb = sz.bi.dw.dimpanel.DimCombobox.create(_yycombParams);
        }

        $('<span id="inlayout" style="margin-left:20px"/>').appendTo($toolbar);

        //取得调入单位的信息，包括：卫生局id，医院id，医院名称
        var _getToOrgInf = function() {
            if (isYy) {
                return {
                    toYy: _loginFilter.IRPT_DEPARTMENTS_YY,
                    toWsj: _loginFilter.IRPT_DEPARTMENTS_WSJ,
					tolb: _loginFilter.DIM_SJCX_WSJGLBDM,
                    toYyName: __datapanel.securityinf.userobj.userbean.orgname
                };
            } else {
                var dimPanel = _yycomb.getDimPanel();
                var yyNode = dimPanel && dimPanel.getSelectedNode();
                if (yyNode) {
                    return {
                        toYy: yyNode.uid,
                        toWsj: yyNode.$pids[yyNode.$pids.length - 1],
                        toYyName: yyNode.caption
                    };
                } else {
                    return null;
                }
            }
        };

        //增加调入按钮
        var btnhrin = toolbar.addButton({
            id: "hrin",
            caption: "调入",
            icon: rimgpath + "/move-down.png",
            click: function(event) {
                var fillforms = __datapanel.getFillForms(false);
                var yyinf = _getToOrgInf();
                var ld = _domcomb.val();
                var period = _datecomb.val();

                if (fillforms && yyinf && ld) {
                    var uid = fillforms.getDataHierarchies();
                    var gids = sz.utils.parseKeyValuePairs(uid);

                    var toYy = yyinf.toYy;
                    var toWsj = yyinf.toWsj;
					var tolb = yyinf.tolb;
					

                    var params = [{
                        idcard: gids.SFZJHM,
                        wsj: toWsj,
                        yy: toYy,
                        ld: ld,
						lb: tolb,
                        period: period
                    }];

                    var name = fillforms.datamgr.getFormsData().getFormData("XXB").getTxt("table1.c2");
                    var dlg = sz.commons.Confirm.show({
                        title: "确认",
                        msg: "您确认将" + gids.SFZJHM + "(" + name + ")调入:" + yyinf.toYyName + "？",
                        modal: true,
                        onok: function() {
                            $.ajax({
                                url: sz.sys.ctx(rpath + '/in.action'),
                                data: {
                                    hierarchies: JSON.stringify(params)
                                },
                                success: function() {
                                    var name = fillforms.datamgr.getFormsData().getFormData("XXB").getTxt("table1.c2");
                                    fillforms.cleanFormData();
                                    sz.commons.CheckSaved.getInstance().setModified(false);

                                    var _html = _getHtmlWriter();
                                    _html.clear();
                                    _html.span().gt().text("成功将 ").text(gids.SFZJHM).text("(").text(name).text(") 调入 ").text(yyinf.toYyName).spanEnd();
                                    __alert({
                                        title: "调入成功",
                                        msg: _html.toString()
                                    });
                                }
                            });
                        }
                    });
                } else {
                    var _html = _getHtmlWriter();
                    _html.clear();
                    if (!ld) {
                        _html.p().gt().span().attrStyle().cssText("color", "red").attrStyleEnd().gt().text("* ").spanEnd().text("请选择调入方式").pEnd();
                    }
                    if (!yyinf) {
                        _html.p().gt().span().attrStyle().cssText("color", "red").attrStyleEnd().gt().text("* ").spanEnd().text("请选择调入医院").pEnd();
                    }
                    if (fillforms && (!ld || !yyinf)) {
                        __alert({
                            title: "必选项",
                            msg: _html.toString()
                        });
                    }
                }
            }
        });

        btnhrin.basedom().appendTo('#inlayout');


        //为了给查询按钮让出位置，要把搜索框向前提，并且变短
        var $cisearch = $("#cisearch");
        $cisearch.css({
            'width': "150px",
            'right': "auto",
            'position': "relative",
            'margin-right': "61px"
        });
        $cisearch.insertAfter('#inreturn');
        var compcisearch = $$($cisearch);

        //增加查询按钮
        var _btnsearchin = toolbar.addButton({
            id: "btnsearchin",
            caption: "查询",
            click: function(event) {
                var val = compcisearch.val();
                __datalist.setItemFilter("self.SFZJHM = '" + val + "'");
                __datalist.refresh({
					resid:5636108,
                    success: function() {
                        var row = __datalist.getRowByIndex(0);
                        if (row) {
                            var h = row.getData()["$node"];
                            var fillforms = __datapanel.getFillForms(true);
                            fillforms.setReadonly(true);
                            fillforms.loadData({
                                dataperiod: __datapanel.getPeriod(),
                                datahierarchies: h.uid,
                                success: function() {
                                    sz.commons.CheckSaved.getInstance().setModified(false);
                                }
                            });
                        } else {
                            __alert({
                                msg: val + " 尚未录入系统，或尚未从其他医疗机构中调出，请您核实。"
                            });
                        }
                    }
                });
            }
        });
        _btnsearchin.basedom().css({
            position: "absolute",
            right: "-47px",
            top: "-1px"
        });
        _btnsearchin.basedom().appendTo($cisearch);


        //父结点是上海卫生局，过滤条件是只查询虚拟卫生局，这样可以在界面上只出非在职人员的数据
        if (__datapanel.loginHierarchies.isadmin) __datatree.args.rootitems = "IRPT_DEPARTMENTS_WSJ=310000000146";
        __datatree.args.itemfilter = "self.IRPT_DEPARTMENTS_WSJ=999999999999";

        //一开始就给数据列表设置一个不可能得到结果的查询条件，就可以得到一个空的列表，以利于接下拉的精确查询
        if (window.location.search.indexOf("nodetailfilter") < 0) {
            __datalist.setItemFilter("self.SFZJHM is null");
        }

        //不让搜索框产生快速搜索行为
        sz.ci.Search.onBeforeSearch = function(e) {
            return false;
        };
        $(".sz-commons-searchbox-cancel-cisearch:first")[0].style.visibility = "hidden";

        //把明细数据列表隐藏起来
        if (window.location.search.indexOf("showdetaillist=true") < 0) {
            var mainSplit = $$("#mainsplit");
            var contentSplit = $$("#contentsplit");
            mainSplit.showPanel({
                panel1visible: false,
                panel2visible: true
            });
            contentSplit.showPanel({
                panel1visible: false,
                panel2visible: true
            });
            $("#icoCloseFill")[0].style.display = "none";
        }

        var compPeriod = __datapanel.getDataPeriod();
        if (compPeriod) {
            compPeriod.visible(false);
        }
    };

    //根据参数不同，调用不同的定制函数
    var ciparams = __datapanel.ciparams;
    if (ciparams) {
        if (ciparams.ci_isout === "true") {
            dogoout();
        } else if (ciparams.ci_isin === "true") {
            dogoin();
        } else {
            dohrmgr();
        }
    } else {
        dohrmgr();
    }

    // 按钮disabled状态的时候隐藏
    __datapanel.on('statechange', function(env) {
        var slf = $$(env);
        var btns = ['btnFill', 'btnSubmit', 'btnSave', 'btnDelete', 'btnAudit', 'btnCalc', 'btnLock', 'btndoout'];
        var btn, disabled;
        for (var i = 0, n = btns.length; i < n; i++) {
            if (isWsj && btns[i] !== 'btnAudit') continue;
            btn = slf.getToolButton(btns[i]);
            if (!btn) continue;
            disabled = btn.disabled();
            btn.visible(!disabled);
        }
        if (ciparams && (ciparams.ci_isout === 'true' || ciparams.ci_isin === 'true')) {
            _hideButtons();
        }
    });

    _hideButtons();

}


// 重载DataList中的方法，当没有在职时，需要设置显示文字的颜色为灰色，这个需要添加一个标识
var DataList = sz.ci.DataList;
var _updateList = DataList.prototype.updateList;
DataList.prototype.updateList = function(data) {
	/**
	 * 20150107 dw
	 * BI-12906 离职状态未敏捷更新
	 * 先修改为离职，然后返聘，发现title还是离职人员，行也是灰色的。
	 * 解决办法：update遍历前将状态还原。
	 */
	var rs = this.getSimpleList()._getRowsBody().find('.sz-ci-sfzz0');
	 for (var i = 0, n = rs.length; i < n; i++) {
        $(rs[i].parentNode.parentNode.parentNode.parentNode).removeAttr('title').find('.sz-commons-simplelist-tdd,.sz-ci-datapanel-dlurl').css('color', 'rgb(78, 78, 78)');
    }
    if (data && data.length) {
        var d;
        for (var i = 0, n = data.length; i < n; i++) {
            d = data[i];
            // 取到是否在职的数据，为0时表示离职了
            if (d.$node.$ppts.SFZZ !== '0') continue;
            d.SYS_AUDIT_TAG += '<span class="sz-ci-sfzz0"></span>';
        }
    }

    _updateList.apply(this, arguments);

    // 从数据中将所有离职的那一行设置为灰色的，由于数据内会有链接，所以要分别获取
    rs = this.getSimpleList()._getRowsBody().find('.sz-ci-sfzz0');
    for (var i = 0, n = rs.length; i < n; i++) {
        $(rs[i].parentNode.parentNode.parentNode.parentNode).attr('title', '离职人员').find('.sz-commons-simplelist-tdd,.sz-ci-datapanel-dlurl').css('color', '#999');
    }
};

// 重载DataTree中的方法
var sys = sz.sys;
sys._classModifier = sys._classModifier||{};
sys._classModifier["sz.ci.DataTree"] = [function(){
	var DataTree = sz.ci.DataTree;
	var _hideAllColumns = DataTree.prototype.hideAllColumns;
	DataTree.prototype.hideAllColumns = function(f) {
	    if (sz.ci._isWsj && f) return;
	    _hideAllColumns.apply(this, arguments);
	};
}];


// 重载DataPanel中的方法
var DataPanel = sz.ci.DataPanel;
var _onSelectNode = DataPanel.prototype._onSelectNode;
DataPanel.prototype._onSelectNode = function(node) {
    _onSelectNode.apply(this, arguments);
    if (sz.ci._isWsj) {
        var mainSplit = $$("#mainsplit");
        mainSplit.showPanel({
            panel1visible: false,
            panel2visible: true
        });
        // 人力列表中显示返回链接
        this.getDataList().backVisible(true);
    }
};
// 不允许批量删除
var _can_delete = DataPanel.prototype.can_delete;
DataPanel.prototype.can_delete = function() {
    var rs = this.getCheckedNodes(null, this._datalist);
    if (rs && rs.length > 1) return true;
    return _can_delete.apply(this, arguments);
};

// 卫生填报中要求未通过审核数据不能上报，所以需要有保存功能
var _refresh_submit_save = DataPanel.prototype.refresh_submit_save;
DataPanel.prototype.refresh_submit_save = function() {
    if (sz.ci._isWsj) return;
    _refresh_submit_save.apply(this, arguments);

    // 调入管理不需要显示保存按钮
    if (this.ciparams.ci_isin === 'true') return;

    var fill = this.getToolButton("btnFill");
    if (fill && fill.visible()) return;

    var save = this.getToolButton("btnSave");
    if (!save) return;
    save.visible(true);
    save.enabled(true);
};

// http://jira.succez.com/browse/BI-12531 医院登陆，区域一不要出现
var _closeFillForms = DataPanel.prototype.closeFillForms;
DataPanel.prototype.closeFillForms = function() {
    _closeFillForms.apply(this, arguments);
    var mainSplit = $$("#mainsplit");
    mainSplit.showPanel({
        panel1visible: !sz.ci._isYy,
        panel2visible: sz.ci._isYy
    });
};

// 重载SimpleList中的方法
var SimpleList = sz.commons.SimpleList;
if (typeof SimpleList.prototype.parity === 'function') {
    $$('.sz-commons-simplelist').parity(true);
}

//表单界面的初始化事件
function oninitfillforms($cifillforms) {
    $cifillforms.on("editcell", function(args) {
        var editor = $cifillforms.event.currentEditor;
        if (editor == null) {
            return;
        }
        //debugger;
        var $component = args.$component;
        var editmode = $component.compinf.com.editmode;
        if (editmode !== "dimcombobox") {
            return;
        }
        var dimcombobox = editor.getComponent();
        dimcombobox.setDisplayformat("@ @txt");
    });
}