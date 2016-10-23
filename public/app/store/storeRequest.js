/**
 * Created by kharlamov.a on 10.10.2016.
 */

Ext.define('InOut.store.storeRequest', {
    extend: 'Ext.data.Store',
    storeId: 'storeRequest',
    autoLoad: false,
    proxy: {
        type: 'ajax',
        url: '/testaaa/0',
        reader: {
            type: 'json',
            rootProperty: 'data',
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
});