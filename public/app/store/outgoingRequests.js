/**
 * Created by kharlamov.a on 10.10.2016.
 */
Ext.define('InOut.store.outgoingRequests', {
    extend: 'Ext.data.Store',

    requires: [
        'InOut.model.outgoingRequests'
    ],

    storeId: 'outgoingRequests',
    model: 'InOut.model.outgoingRequests',
    proxy: {
        type: 'ajax',
        url: '/requests',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});