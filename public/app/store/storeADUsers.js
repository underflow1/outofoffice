/**
 * Created by kharlamov.a on 11.10.2016.
 */
Ext.define('InOut.store.storeADUsers', {
    extend: 'Ext.data.Store',
    storeId: 'storeADUsers',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: '/adusers',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});