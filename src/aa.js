sz.utils.loadComps('sz.ci.fillforms', function() {
    var uid = '${m2}'
    var dpid = '${n2}';
    var lastpno = '${o2}'

    var ci_dh = "DIM_BMID=" + dpid + "&UUID_=" + uid;
    var args = {
        resid: 189399051,
        ci_datahierarchies: ci_dh,
        width: 800,
        height: 600,
        ci_showtab:false,
        buttons: [{
            caption: "审核",
            icon: "sz-ci-datapanel-icon-check",
            click: function(dlg, fillforms) {
                fillforms.audit();
                fillforms.updateAuditPanel({
                    columns: [{
                        pptname: "msg",
                        caption: "错误信息"
                    }, {
                        pptname: "level",
                        caption: "错误级别"
                    }, {
                        pptname: "exp",
                        caption: "审核公式"
                    }]
                });
            }
        }, {
            id: "ok",
            caption: "提交",
            icon: "sz-commons-dialog-icon-ok",
            click: function(dlg, fillforms) {
                fillforms.submit({
                    "success": function() {
                        var sys = sz.sys;
                        var pno = '${f2}'
                        var uuid = '${m2}';
                        $.post(sys.ctx('/meta/xtjg/collections/cj/F_XZXK_XG/resources/custom.action'), {
                            'method': 'updateRecord',
                            'pno': pno,
                            'uid': uuid
                        }, function(d) {

                        });
                        dlg.close();
                        $rpt.recalc();
                        // $rpt.getCurrentResult().find('.collapse-up:visible,.sz-bi-prst-parampanel-collapse-up:visible').trigger('click');
                    }
                });
                return true;
            }
        }, {
            caption: "取消",
            icon: "sz-commons-dialog-icon-cancel",
            click: function(dlg, fillforms) {
                // 定义一些操作
                dlg.close();
            }
        }]
    };
    (function(args) {
        var title = args.title ? args.title : "";
        var width = args.width ? args.width : "500";
        var height = args.height ? args.height : "300";

        var dlg = sz.ci.FillFormsDialog.create({
            'title': title,
            'minwidth': width,
            'minheight': height,
            'width': width,
            'height': height,
            'showhelp': false
        });
        dlg.show(args);

        return dlg;
    })(args);
})