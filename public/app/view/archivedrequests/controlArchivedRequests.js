/**
 * Created by kharlamov.a on 13.10.2016.
 */
Ext.define('InOut.view.archivedrequests.controlArchivedRequests', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.controlarchivedrequests',

    init: function() {

    },

    arActions:function(element) {
        var me = this;
        var startDate = Ext.getCmp('archive_date_begin').getSubmitValue();
        var endDate = Ext.getCmp('archive_date_end').getSubmitValue();
        switch (element.action) {
            case 'getarchive' :
                me.view.getStore().getProxy().url = '/archivedrequestsrange/' + startDate + '/' + endDate;
                me.view.getStore().load();
                console.log('archive ' + startDate, endDate, me.view.getStore().getProxy().url);
                break;
            case 'getexcel' :
                Ext.DomHelper.append(Ext.getBody(), {
                    tag:          'iframe',
                    /*frameBorder:  0,
                    width:        0,
                    height:       0,*/
                    css:          'display:none;visibility:hidden;height:0px;',
                    src:          '/archivedrequestsrangeexcel/' + startDate + '/' + endDate
                });
                break;
        }
    }
});