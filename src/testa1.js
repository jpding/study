var topiit = sz.sys.namespace("sz.custom");
var DataPanel = sz.ci.DataPanel;

//=============================================调用两个按钮=============================================================
function oninitdatapanel($cidatapanel) {
    topiit.datapanel = $cidatapanel;
    var datapanel = $cidatapanel.__datapanel;
    //定义oncanadddetail扩展点，允许上级单位添加明细数据
    datapanel.args.oncanadddetail = function() {
        return true
    };

    var toolbar = $cidatapanel.getToolBar();
    toolbar.getButton('btnTools').visible(false);
    toolbar.getButton('btnDelete').visible(false);
    toolbar.getButton("submit").caption("提交");
    toolbar.getButton("btnAudit").caption("信息核验");
    // toolbar.getButton('btnCalc').visible(false);
    /*var calcBtn = toolbar.getButton('btnCalc');
    calcBtn.caption("查找");*/

    /*
        sz.ci.DataPanel.onClickCalc = function(event) {

            var datapanel = sz.ci.DataPanel.getInstance(event);
            var fillforms = datapanel.getFillForms(false);
            if (!fillforms)
                return;g
            var $form = fillforms.getActiveForm();
            var slfInf = $form.getSelectInf();
            if (!slfInf) {
                return;
            }

            sz.custom.xtjg.queryEnt($form);

        }
    */

    //20150907 xh fix bug:在弹出对话框中打开特性明细任务，新增数据并上报之后表单被清空。原因是hierarchies在新增之后没有变成新的代码。这里修正。
    DataPanel.prototype.querySingleHierarchyState_old = DataPanel.prototype.querySingleHierarchyState;
    DataPanel.prototype.querySingleHierarchyState = function() {
        this.loginHierarchies.hierarchies = [this.ciparams.ci_datahierarchies];

        DataPanel.prototype.querySingleHierarchyState_old.apply(this, arguments);
    }

    overwriteRefreshAll(datapanel);

    // http://jira.succez.com/browse/CSTM-1852
    var sys = sz.sys;
    var utils = sz.utils;
    var Import = sys.namespace('sz.Custom.Import');
    var COOKIE_PREFIX = 'importdialog4cidontshow';
    var COOKIE_PATH = sys.ctx('/');
    var user = { 'id': 'importdialog4ci' };
    Import.dontShowAgan = function() {
        var dontshow = this.checked;
        Import._dontShowAgan(user.id, dontshow);
    };
    Import._dontShowAgan = function(id, dontshow) {
        $.cookie(COOKIE_PREFIX + id, dontshow, {
            'path': COOKIE_PATH,
            'expires': 7
        });
    };
    Import.getDontshow = function(id) {
        return id ? utils.parseBool($.cookie(COOKIE_PREFIX + id), false) : false;
    };
    Import.init = function(args) {
        if (!Import.getDontshow(user.id)) sz.Custom.Import.show();
    };
    Import.initCheckboxDontshow = function() {
        var chk = $('#importdialog4ci-dontshow')[0];
        if (!$.cookie(COOKIE_PREFIX + user.id)) {
            chk.checked = true;
            Import._dontShowAgan(user.id, true);
            return;
        }
        chk.checked = Import.getDontshow(user.id);
    };
    Import.makeContent = function() {
        var $dom = $('#importdialog4ci-content');
        if ($dom.children().length) return;
    };
    Import.show = function(args) {
        var dlg = $$('#importdialog4ci');
        var showCallback = function() {
            Import.makeContent();
            Import.initCheckboxDontshow();
        };
        if (!dlg) {
            var _main = function(comp) {
                dlg = sz.commons.Dialog.create({
                    'id': 'importdialog4ci',
                    'showclose': false,
                    'showfoot': false,
                    'resizable': true,
                    'title': '导入'
                });
                var oldOnHtmlLoaded = dlg._onHtmlLoaded;
                dlg._onHtmlLoaded = function(htmlContainer) {
                    var rs = oldOnHtmlLoaded.apply(this, arguments);
                    rs.showfoot = false;
                    return rs;
                };
                var html = [
                    '<div style="position:relative;min-width:400px;min-height:200px;">',
                    '<div id="importdialog4ci-content" style="position:absolute;top:0;bottom:50px;width:100%;overflow:auto;">',
                    '<p style="margin:22px;line-height:22px;"><em class="sz-app-icon-dialog-info" style="margin:-6px 4px 0 0"></em>请点击右侧“EXCEL导入模板下载”，下载导入模板，使用该模板录入数据并导入！</p>',
                    '</div>',
                    '<div style="position:absolute;bottom:0;width:100%;height:50px;background:#FFF;">',
                    '<label for="importdialog4ci-dontshow" style="float:left;margin:8px 0 0 12px;color:#666;">',
                    '<input type="checkbox" id="importdialog4ci-dontshow" style="vertical-align:-3px;" onclick="sz.Custom.Import.dontShowAgan.call(this)"/> 下次不再显示我</label>',
                    '<a href="javascript:void(0)" onclick="$$(this).close()" style="text-decoration:none;float:right;margin:8px 12px 0 0;color:#666;border:1px solid #CCC;padding:2px 12px;">关闭</a>',
                    '<a href="javascript:void(0)" onclick="sz.Custom.Import.importExcel();$$(this).close()" style="text-decoration:none;float:right;margin:8px 12px 0 0;color:#666;border:1px solid #CCC;padding:2px 12px;">确定</a>',
                    '</div></div>'
                ];
                dlg.show({
                    'html': html.join(''),
                    'success': showCallback
                });
            };
            if (window['szrequire']) szrequire(['sz.commons.dialog'], _main);
            else sys.loadComponent('sz.commons.dialog', _main);
            return;
        }
        dlg.show({
            'success': showCallback
        });
    };
    Import.importExcel = function() {
        datapanel.importExcel();
    };
    //新增导出按钮 20160323 liuxc
    var btnImport = toolbar.addButton({
        id: 'btnImport',
        icon: 'btnImport',
        caption: '导入',
        prev: 'btnAudit',
        visible: true
    });

    btnImport.one(sz.commons.Button.EVENTS.CLICK, function(event) {
        if (Import.getDontshow(user.id)) Import.importExcel();
        else Import.show();
    });
}


//绑定selectchange事件 
function oninitfillforms($fillforms) {
    //---以下为隐藏采集任务的单元格提示---
    var comphint = $fillforms.getCompHint();
    comphint.showPanel = function() {};
    //---以上为隐藏采集任务的单元格提示---
    $fillforms.on("loadform", function() {
            var calcBtn = topiit.datapanel.getToolBar().getButton('btnCalc');
            calcBtn.disabled(true);
        })
        /*
        $fillforms.on("beforeeditcell", function(event){
            var citrigger = event.params && event.params.citrigger;
            if(citrigger  != "dblclick"){
                return;
            }
            
            var cellName = event.$component.getCompInf().name;
            if(["table1.b2", "table1.c2", "table1.d2"].indexOf(cellName) == -1){
                return ;
            }
            
            var $form = $fillforms.getActiveForm();
            sz.custom.xtjg.queryEnt($form);
            return false;
        });
        */

    //判断是否显示增删行按钮，当前选中的是浮动行且可增删行列时显示按钮，否则不显示按钮
    $fillforms.on("selectchange", function(event) {
        // 20160325 chenjb 选中单元格，右下角显示图标，点击图标显示queryEnt对话框
        var $queryEntBtn = $('#xtjg_queryentbtn');
        if (!$queryEntBtn.length) {
            $queryEntBtn = $('<em id="xtjg_queryentbtn" class="sz-app-icon-search" style="position:absolute;width:16px;height:16px;z-index:9999;display:none;"/>').appendTo('body');
            $queryEntBtn.on('click', function() {
                var $form = $(this).data('$form');
                if ($form) sz.custom.xtjg.queryEnt($form);
            });
        }

        var selectinfo = $fillforms.getSelectInf();
        var f = false;
        if (selectinfo) {
            f = true;
            if (['table1.b2', 'table1.c2', 'table1.d2', 'table1.e2'].indexOf(selectinfo.compid) > -1) {
                $('body').on('hotkey', { 'keys': 'ctrl+q' }, function() {
                    var $form = $fillforms.getActiveForm();
                    if ($form) sz.custom.xtjg.queryEnt($form);
                });
                $('#rptresult').on('scroll', function() {
                    $queryEntBtn.css({
                        'display': 'none'
                    });
                })
                var sidom = selectinfo.basedom();
                var offset = sidom.offset();
                var w = sidom.width(),
                    h = sidom.height();
                $queryEntBtn.data('$form', event.$form);
                $queryEntBtn.css({
                    'left': offset.left + w - 12,
                    'top': offset.top + h - 14
                });
            } else {
                f = false;
            }
        }
        $queryEntBtn.css({
            'display': f ? 'block' : 'none'
        });

        // -----------------------------------------------------------------------------------

        var datapanel = topiit.datapanel;
        var sinf = $fillforms.event._getSelectedFloatAreaRowsInfo();
        var disabled = true;
        if (sinf) {
            var floatArea = sinf.floatArea;
            if (
                floatArea.enableAlterFloatArea() // 浮动区域可编辑
                && $fillforms.isFormEditable(floatArea.getForm().getName()) // 表单可编辑
            ) {
                disabled = false;
            }
        }
    });

    //==================隐藏审核公式CSTM-1318==========================
    $fillforms.updateAuditPanel({
        columns: [{
                pptname: "msg", //1、第10、11行表示显示错误信息，不需要时连同大括号{}一起删除即可
                caption: "错误信息"
            },
            /* {
                pptname       : "level", //2、第13、14行表示显示错误级别，不需要时连同大括号{}一起删除即可
                caption : "错误级别"
            }*/
        ]
    });
    //===================================================================
}

var xtjg = sz.sys.namespace("sz.custom.xtjg");

/**
 * 录入一户企业
 */
xtjg.addEnt = function($form) {
    this.showQueryDlg('录入企业', "", '', function(rpt) {
        var fa = $form.getFloatArea("table1.g2");
        var row = fa.lastRow();
        if (!row.isBlank()) {
            row = fa.newRow();
        }

        /**
         * entName,uniSCID,regNo
         */
        var objs = xtjg.getSelectedEnt(rpt);
        if (!objs || !objs.length) {
            sz.commons.Alert.show({ 'msg': '您没有选择企业信息数据，无法进行提交！' });
            return false;
        }

        /**
         * 统一注册代码
         */
        row.getComponent("table1.b2").val(objs[1]);

        /**
         * 注册号
         */
        row.getComponent("table1.c2").val(objs[2]);

        /**
         * 企业名称
         */
        row.getComponent("table1.d2").val(objs[0]);
    })
}

/**
 * 批量增加行，便于从Excel拷贝粘贴
 */
xtjg.addEntBatch = function() {}

/**
 * 根据查询企业名称进行模板查询，找出相关联企业，查询使用报表实现
 */
xtjg.queryEnt = function($form) {
    var slfInf = $form.getSelectInf();
    var entName = '';
    if (slfInf) {
        //var row = slfInf.getRow();
        //entName = row.getComponent("table1.d2").val();
        entName = slfInf.getValue();
    }

    this.showQueryDlg('定位企业', entName, slfInf.compid, function(rpt) {
        $form.getFillForms().endEdit();
        /**
         * entName,uniSCID,regNo,nbxh
         */
        var objs = xtjg.getSelectedEnt(rpt);
        if (!objs || !objs.length) {
            sz.commons.Alert.show({ 'msg': '您没有选择企业信息数据，无法进行提交！' });
            return false;
        }
        var row = slfInf.getRow();

        /**
         * 统一注册代码
         */
        row.getComponent("table1.b2").val(objs[1]);

        /**
         * 企业名称
         */
        row.getComponent("table1.d2").val(objs[0]);

        /**
         *内部序号
         */
        row.getComponent("table1.p2").val(objs[3])

        /**
         * 注册号
         */
        setTimeout(function() {
            row.getComponent("table1.c2").val(objs[2]);
        }, 20);

    });
}

xtjg.getSelectedEnt = function(rpt) {
    var resp;
    var $chs = $("input[type='checkbox']:checked");
    var n = $chs.length;
    if (!n) return [];
    for (var i = 0; i < n; i++) {
        resp = $chs.eq(i).closest('.sz-prst-checkbox').parent().parent().attr('title');
    }
    var entName;
    var uniSCID;
    var regNo;
    var nbxh;
    var res;
    if (resp != null && resp != '') {
        res = resp.split(";");
        entName = res[0];
        uniSCID = res[1];
        regNo = res[2];
        nbxh = res[3];
    }
    return [entName, uniSCID, regNo, nbxh];
}

/**
 * 显示报表查询对话框
 * @param {} caption
 * @param {} onok
 * @param {} onclose
 */
xtjg.showQueryDlg = function(title, caption, cell, onok, onclose) {
    var url = sz.sys.ctx(xtjg.REPORT_URL);
    if (!this.reportdlg) {
        this.reportdlg = sz.commons.Dialog.create({ title: title, width: 1000, height: 550 });
    }

    this.reportdlg.on("ok", function() {
        var rpt = sz.bi.prst.Report.getInstance({ pdom: this.basedom() });
        return onok(rpt);
    });

    var self = this;

    this.reportdlg.on("close", function() {
        self.reportdlg.off("ok");

        if (onclose) {
            var rpt = sz.bi.prst.Report.getInstance({ pdom: this.basedom() });
            onclose(rpt);
        }
    });

    var datas = {};
    $.extend(datas, xtjg.REPORTDEFAULTPARAMS);
    if (caption) {
        datas["@keyword"] = caption;
    }
    datas["$sys_calcnow"] = true;
    datas['rg1'] = { 'table1.b2': 2, 'table1.c2': 3, 'table1.d2': 1, 'table1.e2': 2 }[cell];

    /*   //---------------------为报表输入框绑定回车事件 20160320 liuxc------------------------
    this.reportdlg.on('show', function() {
            this.basedom().unbind('hotkey.szdialog');
            var input = $("input[name='@keyword']");
            var rpt = sz.bi.prst.Report.getInstance({
                pdom: this.basedom()
            });
            input.hotkey({
                keys: 'return',
                inputenabled: true
            }, function(e) {
                rpt.recalc();
            });
        })
        //-------------------------------------------------------------------------------------- 
*/
    this.reportdlg.show({
        "url": url,
        data: datas
    });
}


/**
 * 查询报表地址
 * @type String
 */
xtjg.REPORT_URL = "/meta/xtjg/analyses/report/jgxxhc";
xtjg.REPORTDEFAULTPARAMS = { "$sys_disableCache": true, "$sys_showCaptionPanel": false };

/**
 * 是否存在错误级别的审核，不显示“这里”直接弹出提示
 */
var hasAuditError = function(fillforms) {
    var datamgr = fillforms.getDataMgr();
    if (datamgr.getFormsData().getFailAuditsCount() == 0) {
        return false;
    }
    var faudits = fillforms.getAllFailAuditResult();
    var len = faudits ? faudits.length : 0;
    for (var i = 0; i < len; i++) {
        var audit = faudits[i];
        if (audit.auditInf.level == "error") {
            return true;
        }
    }
    return false;
};
var DataPanel = sz.ci.DataPanel;
var odoSubmit = DataPanel.prototype.doSubmit;
DataPanel.prototype.doSubmit = function(args) {
    // http://jira.succez.com/browse/CSTM-1857
    var pack = cidatamgr.getModifiedDataPackage();
    if (pack && $(pack).find('data').children().length <= 1) {
        sz.commons.messagebox.showMessage('info', '请录入相关信息后再上报！');
        return;
    }
    var fillforms = this.getFillForms();
    var params = arguments;
    var self = this;
    fillforms.audit({
        silent: true,
        success: function() {
            if (hasAuditError(fillforms)) {
                fillforms.showAuditResults();
            } else {
                odoSubmit.apply(self, params);
                XTMessage.sendMessage();
            }
        }
    });
};

function overwriteRefreshAll(datapanel) {
    var $ci_singlefill = sz.utils.getParameter("$ci_singlefill");
    if ($ci_singlefill == 'true') {
        datapanel.refreshAll = function(args) {
            if (!args.onShowUnitForms) {
                //do nothing
                return;
            }

            DataPanel.prototype.refreshAll.apply(this, arguments);
        };
    }
}
//----------------------------
var sys = sz.sys;
var ctx = sys.ctx;
var utils = sz.utils;
var alert = function(p) {
    sz.commons.Alert.show({
        'msg': p
    });
};
var XTMessage = sys.namespace('sz.Custom.XTMessage');
XTMessage.SEND_MESSAGE_ACTION = sz.sys.ctx('/meta/xtjg/collections/cj/F_QTXX/resources/sendmsg');

/**
 * 回复处理
 * 使用方法，报表中的回复按钮中添加脚本：sz.Custom.XTMessage.hfBtnEvent('${table10.N2}', '${table10.X2}')
 */
XTMessage.hfBtnEvent = function(uuid, tjrorg) {
    if (!uuid || !tjrorg) {
        alert('缺少参数，无法继续执行回复操作！');
        return;
    }
    this._hfParams = {
        'uuid': uuid.trim(),
        'tjrorg': tjrorg.trim()
    };
    var slf = this;
    var dlg = $$('#xtmessage-reply-dlg');
    if (!dlg) {
        var _main = function() {
            dlg = sz.commons.Dialog.create({
                'id': 'xtmessage-reply-dlg',
                'title': '回复',
                'showhelp': false,
                'width': 400,
                'height': 260
            });
            var html = [
                '<style>',
                '.xtmessage-dlg-caption,.xtmessage-dlg-caption-v{vertical-align:top;display:inline-block;zoom:1;margin:12px 10px 0 10px;}',
                '.xtmessage-dlg-caption{width:50px;}',
                '.xtmessage-dlg-textarea{width:300px;height:80px;margin:12px 0 10px 0;line-height:20px;}',
                '</style>',
                '<div><span class="xtmessage-dlg-caption">回复给：</span><span class="xtmessage-dlg-caption-v">', slf._hfParams.tjrorg, '</span></div>',
                '<div><span class="xtmessage-dlg-caption">内容：</span><textarea id="xtmessage-reply-msg" class="xtmessage-dlg-textarea"/></div>'
            ];
            $(html.join('')).appendTo(dlg.getContentContainer());
            dlg.one('ok', function() {
                var desc = dlg.getContentContainer().find('#xtmessage-reply-msg').val();
                if (!desc) {
                    alert('没有填写回复内容，无法继续！');
                    return false;
                }
                var _success = function(d) {
                    alert(d.msg);
                };
                $.post(XTMessage.SEND_MESSAGE_ACTION, $.extend({ 'method': 'reply2', 'msg': desc }, slf._hfParams), _success);
            });
            dlg.on('show', function() {
                var cc = dlg.getContentContainer();
                cc.find('#xtmessage-reply-msg').val('');
                cc.find('.xtmessage-dlg-caption-v').text(slf._hfParams.tjrorg);
            });
            dlg.show();
        };
        sys.loadComponent('sz.commons.dialog', _main);
        return;
    }
    dlg.show();
};

XTMessage.sendMessage = function() {
    if (!cidatamgr) return;
    var formName = 'QTXX',
        floatArea = 'table1.g2';
    var rows = cidatamgr.getValues()[formName][floatArea].rows;
    if (!rows || !rows.length) return;
    var orgs;
    for (var i = 0, n = rows.length; i < n; i++) {
        XTMessage._sendMessageByRow(rows[i]);
    }
};

XTMessage._sendMessageByRow = function(row) {
    if (!row) return;
    var orgs = row[12];
    if (!orgs || !orgs.length) return;
    var currentOrgid = sz.security.getCurrentUser().userbean.orgid;
    var _orgs = orgs.split(';');
    var pmorgs = [];
    for (var i = 0, n = _orgs.length; i < n; i++) {
        if (_orgs[i] === currentOrgid) continue;
        pmorgs.push(_orgs[i]);
    }
    if (!pmorgs.length) return;
    var title = '您有一条协同交换信息消息，请到“共享信息查询”模块下面的“协同交换信息查询”标签页进行查看。';
    XTMessage._querySendMessage({
        'orgs': pmorgs.join(','),
        'title': title,
        'content': title
    });
};

XTMessage.reply = function(env) {
    var rs = $(this);
    $.post(XTMessage.SEND_MESSAGE_ACTION, {
        'method': 'reply',
        'sessionid': rs.data('sessionid'),
        'title': '您有一条消息已被（' + rs.data('addresseename') + '）查看，点击（这里）查看详情。'
    }, function(d) {
        var ol = rs.parent().parent();
        rs.parent().remove();
        if (!ol.children('li').length) {
            $$(ol.parent().parent()).close();
        }
    });
    $.event.fix(env).preventDefault();
};

XTMessage.markAsRead = function(env) {
    var rs = $(this);
    $.post(XTMessage.SEND_MESSAGE_ACTION, {
        'method': 'markAsRead',
        'sessionid': rs.data('sessionid')
    }, function(d) {
        var ol = rs.parent().parent();
        rs.parent().remove();
        if (!ol.children('li').length) {
            $$(ol.parent().parent()).close();
        }
    });
    $.event.fix(env).preventDefault();
};

XTMessage.makeContent = function(d) {
    var $dom = $('#messagedialog4portal-content');
    if ($dom.children().length) return;
    var rs = [];
    rs.push(d);
    $(rs.join('')).appendTo($dom);
};

XTMessage.show = function(p) {
    var dlg = $$('#messagedialog4portal');
    var showCallback = function() {
        XTMessage.makeContent(p);
    };
    if (!dlg) {
        var _main = function() {
            dlg = sz.commons.Dialog.create({
                'id': 'messagedialog4portal',
                'showclose': false,
                'showfoot': false,
                'resizable': true,
                'title': '系统消息'
            });
            var oldOnHtmlLoaded = dlg._onHtmlLoaded;
            dlg._onHtmlLoaded = function(htmlContainer) {
                var rs = oldOnHtmlLoaded.apply(this, arguments);
                rs.showfoot = false;
                return rs;
            };
            var html = [
                '<style>#messagedialog4portal-content ol{list-style:decimal;margin:0 20px;padding:10px;}#messagedialog4portal-content li{list-style:decimal;line-height:24px;}#messagedialog4portal-content a {margin:0 6px 0 0;}</style>',
                '<div style="position:relative;min-width:600px;min-height:300px;">',
                '<div id="messagedialog4portal-content" style="position:absolute;top:0;bottom:32px;width:100%;overflow:auto;"/>',
                '<div style="position:absolute;bottom:0;width:100%;height:32px;background:#F0F0F0;border-top:1px solid #CCC;">',
                '<a href="javascript:void(0)" onclick="$$(this).close()" style="text-decoration:none;float:right;margin:8px 12px 0 0;color:#666;">关闭</a>',
                '</div></div>'
            ];
            dlg.show({
                'html': html.join(''),
                'success': showCallback
            });
        };
        sys.loadComponent('sz.commons.dialog', _main);
        return;
    }
    dlg.show({
        'success': showCallback
    });
};

XTMessage._querySendMessage = function(args) {
    $.post(XTMessage.SEND_MESSAGE_ACTION, args, function(d) {});
};

XTMessage.autoPopup = function() {
    $.get(XTMessage.SEND_MESSAGE_ACTION, { 'method': 'list' }, function(d) {
        if (!d) return;
        XTMessage.show(d);
    });
};
XTMessage.autoPopup();
//----------------------------
