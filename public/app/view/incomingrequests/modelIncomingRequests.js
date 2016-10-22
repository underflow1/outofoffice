/**
 * Created by kharlamov.a on 10.10.2016.
 */
Ext.define('InOut.view.incomingrequests.modelIncomingRequests', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.modelIncomingRequests',

    formulas: {
        tabOut: function() {
            //var mycount = Ext.getStore('storeIncomingRequests').getCount();
            /* var grid = Ext.ComponentQuery.query('gridincomingrequests')[0];
             console.log(grid.getStore());
             console.log(Ext.getStore('storeIncomingRequests'));
             console.log(this.getStore('storeIncomingRequests').data.items);*/
            return Ext.getStore('storeIncomingRequests').getCount()
        }
    },

    stores: {
        storeIncomingRequests: {
            //reference: 'storeIncomingRequests',
            storeId: 'storeIncomingRequests',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                    url: '/incomingrequests',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            },

            idProperty: 'id',
            fields: [
                {name: 'id', type: 'int'},
                {name: 'created_at', type: 'date'},
                {name: 'updated_at', type: 'date'},
                {name: 'created_user', type: 'string'},
                {name: 'updated_user', type: 'string'},
                {name: 'absent_user', type: 'string'},
                {name: 'absent_fio', type: 'string'},
                {name: 'absent_email', type: 'string'},
                {name: 'absent_date', type: 'date'},
                {name: 'absent_comment', type: 'string'},
                {name: 'absent_time_begin', type: 'string'},
                {name: 'absent_time_end', type: 'string'},
                {name: 'absent_reason', type: 'string'},
                {name: 'approve_user', type: 'string'},
                {name: 'approve_fio', type: 'string'},
                {name: 'approve_email', type: 'string'},
                {name: 'status', type: 'string'},
                {name: 'email_type', type: 'string'},
                {name: 'deleted', type: 'bool'}
            ]
        }
    }
});