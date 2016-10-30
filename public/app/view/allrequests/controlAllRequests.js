/**
 * Created by kharlamov.a on 13.10.2016.
 */
Ext.define('InOut.view.allrequests.controlAllRequests', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.controlallrequests',

    init: function() {

    },

    arActions:function(element) {
        var me = this;
        var startDate = Ext.getCmp('all_date_begin').getSubmitValue();
        var endDate = Ext.getCmp('all_date_end').getSubmitValue();
        switch (element.action) {
            case 'getall' :
                me.view.getStore().getProxy().url = '/allrequestsrange/' + startDate + '/' + endDate;
                me.view.getStore().load();
                console.log('all ' + startDate, endDate, me.view.getStore().getProxy().url);
                break;
            case 'getexcel' :
                Ext.DomHelper.append(Ext.getBody(), {
                    tag:          'iframe',
                    /*frameBorder:  0,
                    width:        0,
                    height:       0,*/
                    css:          'display:none;visibility:hidden;height:0px;',
                    src:          '/allrequestsrangeexcel/' + startDate + '/' + endDate
                });
                break;
        }
    }
});