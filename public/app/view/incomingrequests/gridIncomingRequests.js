/**
 * Created by kharlamov.a on 08.10.2016.
 */
Ext.define('InOut.view.incomingrequests.gridIncomingRequests', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridincomingrequests',

    requires: [
        'InOut.view.incomingrequests.modelIncomingRequests',
        'InOut.view.incomingrequests.controlIncomingRequests',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'Ext.view.Table',
        'Ext.grid.column.Number',
        'Ext.grid.column.Date',
        'Ext.grid.column.Boolean'
    ],
    viewModel: {type: 'modelIncomingRequests'},
    controller: 'controlincomingrequests',

    bind: {
        title: '{tabOut}',
        store: '{storeIncomingRequests}'
    },

    listeners : {
        itemdblclick: 'approveCurrentRequest'
    },

    selModel: {
        mode: 'SIMPLE'
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
                    text: 'Согласовать всё',
                    action: 'approveRequests',
                    listeners: {click:'inActions'},
                    iconCls: 'fa fa-lg fa-thumbs-o-up'
                }
            ]
        }
    ]
});