/**
 * Created by kharlamov.a on 08.10.2016.
 */
Ext.define('InOut.view.archivedrequests.gridArchivedRequests', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridarchivedrequests',

    requires: [
        'InOut.view.archivedrequests.modelArchivedRequests',
        'InOut.view.archivedrequests.controlArchivedRequests',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.view.Table',
        'Ext.grid.column.Number',
        'Ext.grid.column.Date',
        'Ext.grid.column.Boolean'
    ],
    viewModel: {type: 'modelArchivedRequests'},
    controller: 'controlarchivedrequests',

    bind: {
        store: '{storeArchivedRequests}'
    },

    columns: [
        {
            xtype: 'rownumberer',
            width: 45,
            align:'center'
        },
        {
            dataIndex: 'absent_fio',
            text: 'Отсутсвующий',
            width: 300,
            align:'left'
        },
        {
            dataIndex: 'absent_date',
            text: 'Дата отсутствия',
            xtype: 'datecolumn',
            format: 'Y-m-d',
            align:'center',
            width: 100
        },
        {
            dataIndex: 'absent_time_begin',
            text: 'Начало',
            align:'center',
            width: 70
        },
        {
            dataIndex: 'absent_time_end',
            text: 'Конец',
            align:'center',
            width: 70
        },
        {
            dataIndex: 'absent_reason',
            text: 'Тип',
            align:'center',
            width: 50
        },
        {
            dataIndex: 'absent_comment',
            text: 'Комментарий',
            width: 450,
            align:'left'
        },
        {
            dataIndex: 'status',
            text: 'Состояние',
            align:'center'
        },
        {
            dataIndex: 'email_type',
            text: 'Последнее событие',
            width: 450,
            align:'right'
        }
    ],
    dockedItems: [
        {
            xtype: 'toolbar',
            items: [
                {
                    xtype: 'button',
                    text: 'выгрузить в excel',
                    action: 'excel',
                    listeners: {click:'arActions'},
                    iconCls: 'fa fa-lg fa-file-excel-o'
                }
            ]
        },
        {
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true
        }
    ]
});
