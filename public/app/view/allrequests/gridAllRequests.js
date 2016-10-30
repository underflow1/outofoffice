/**
 * Created by kharlamov.a on 08.10.2016.
 */
Ext.define('InOut.view.allrequests.gridAllRequests', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridallrequests',

    requires: [
        'InOut.view.allrequests.modelAllRequests',
        'InOut.view.allrequests.controlAllRequests',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.view.Table',
        'Ext.grid.column.Number',
        'Ext.grid.column.Date',
        'Ext.grid.column.Boolean'
    ],
    //viewModel: {type: 'modelAllRequests'},
    controller: 'controlallrequests',
    defaultToken: 'all',

    bind: {
        store: '{storeAllRequests}'
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
        {   dataIndex: 'approve_fio',
            text: 'Согласующий',
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
        }/*,
        {
            dataIndex: 'email_type',
            text: 'Последнее событие',
            width: 450,
            align:'right'
        }*/
    ],
    dockedItems: [
        {
            xtype: 'toolbar',
            items: [
                {
                    name: 'all_date_begin',
                    startDay: 1,
                    id: 'all_date_begin',
                    xtype: 'datefield',
                    format: 'Y-m-d',
                    fieldLabel: 'Начало периода',
                    value: new Date((new Date()).valueOf() - 1000*3600*24*30)
                },
                {
                    xtype: 'tbspacer',
                    width: 10
                },
                {
                    name: 'all_date_end',
                    id: 'all_date_end',
                    xtype: 'datefield',
                    format: 'Y-m-d',
                    fieldLabel: 'Конец периода',
                    value: new Date(),
                    startDay: 1
                },
                {
                    xtype: 'tbspacer',
                    width: 10
                },
                {
                    xtype: 'button',
                    text: 'Вывести!',
                    action: 'getall',
                    listeners: {click:'arActions'},
                    iconCls: 'fa fa-lg fa-list'
                },
                {
                    xtype: 'tbfill'
                },
                {
                    xtype: 'button',
                    text: 'выгрузить в excel',
                    action: 'getexcel',
                    listeners: {click:'arActions'},
                    iconCls: 'fa fa-lg fa-file-excel-o'
                }
            ]
        },
        {
            xtype: 'toolbar',
            dock: 'bottom',
            displayInfo: true
        }
    ]
});
