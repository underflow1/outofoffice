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
        switch (element.action) {
            case 'getarchive' :
                var startDate = Ext.getCmp('archive_date_begin').getSubmitValue();
                var endDate = Ext.getCmp('archive_date_end').getSubmitValue();
                me.view.getStore().getProxy().url = '/archivedrequestsrange/' + startDate + '/' + endDate;
                me.view.getStore().load();
                console.log(startDate, endDate, me.view.getStore().getProxy().url);
                break;
        }
    }
});