//绑定selectchange事件 
function oninitfillforms($fillforms) {
    //---以下为隐藏采集任务的单元格提示---
    var comphint = $fillforms.getCompHint();
    comphint.showPanel = function() {};
    //判断是否显示增删行按钮，当前选中的是浮动行且可增删行列时显示按钮，否则不显示按钮
    $fillforms.on("selectchange", function(event) {
        // 20160325 chenjb 选中单元格，右下角显示图标，点击图标显示queryEnt对话框
        var $queryEntBtn = $('#xtjg_queryentbtn');
        if (!$queryEntBtn.length) {
            $queryEntBtn = $('<em id="xtjg_queryentbtn" class="sz-app-icon-search" style="position:absolute;width:16px;height:16px;z-index:100002;display:none;"/>').appendTo('body');
            $queryEntBtn.on('click', function() {
                var rs = $(this);
                sz.custom.xtjg.queryEnt(rs.data('$form'), rs.data('$comp'));
            });
        }
        var selectinfo = $fillforms.getSelectInf();
        var f = false;
        if (selectinfo) {
            f = true;
            var compid = $.isArray(selectinfo) ? selectinfo[0][0].compid : selectinfo.compid;
            var $form = $fillforms.getCurrentForm();
            var comp = $form.getComponent(compid);
            var sidom = comp.basedom();
            if (['table1.b4', 'table1.d4', 'table1.b3'].indexOf(compid) > -1) {
                var offset = sidom.offset();
                var w = sidom.width(),
                    h = sidom.height();
                $queryEntBtn.data('$form', $form);
                $queryEntBtn.data('$comp', comp);
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
    });

    //==================隐藏审核公式CSTM-1318==========================
    $fillforms.updateAuditPanel({
        columns: [{
                pptname: "msg", //1、第10、11行表示显示错误信息，不需要时连同大括号{}一起删除即可
                caption: "错误信息"
            }
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
 * 根据查询企业名称进行模板查询，找出相关联企业，查询使用报表实现
 */
xtjg.queryEnt = function($form, comp) {
    this.showQueryDlg('定位企业', comp.val(), comp.getId(), function(rpt) {
        $form.getFillForms().endEdit();
        /**
         * entName,uniSCID,regNo,nbxh
         */
        var objs = xtjg.getSelectedEnt(rpt);
        if (!objs || !objs.length) {
            sz.commons.Alert.show({ 'msg': '您没有选择企业信息数据，无法进行提交！' });
            return false;
        }
        /**
         * 统一注册代码
         */
        $form.getComponent("table1.b4").val(objs[1]);

        /**
         * 注册号
         */
        $form.getComponent("table1.d4").val(objs[2]);

        /**
         * 企业名称
         */
        $form.getComponent("table1.b3").val(objs[0]);

        /**
         *内部序号
         */
        //        $form.getComponent("table1.p2").val(objs[3])
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
    if (this._querydlgvisible) return;
    var dlg = this.querydlg;
    var url = sz.sys.ctx(xtjg.REPORT_URL);
    if (!dlg) {
        var self = this;
        this.querydlg = dlg = sz.commons.Dialog.create({ title: title, width: 1000, height: 550 });
        dlg.on("ok", function() {
            self._querydlgvisible = false;
            var rpt = sz.bi.prst.Report.getInstance({ pdom: this.basedom() });
            return onok(rpt);
        });
        dlg.on("close", function() {
            self._querydlgvisible = false;
            self.querydlg.off("ok");

            if (onclose) {
                var rpt = sz.bi.prst.Report.getInstance({ pdom: this.basedom() });
                onclose(rpt);
            }
        });
        dlg.on('show', function() {
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
        });
    }

    this._querydlgvisible = true;
    var datas = {};
    $.extend(datas, xtjg.REPORTDEFAULTPARAMS);
    if (caption) {
        datas["@keyword"] = caption;
        datas["$sys_calcnow"] = true;
        datas['rg1'] = { 'table1.b4': 2, 'table1.d4': 3, 'table1.b3': 1 }[cell];
    }
    dlg.show({
        "url": url,
        "data": datas
    });
}


/**
 * 查询报表地址
 * @type String
 */
xtjg.REPORT_URL = "/meta/xtjg/analyses/report/jgxxhc";
xtjg.REPORTDEFAULTPARAMS = { "$sys_disableCache": true, "$sys_showCaptionPanel": false };