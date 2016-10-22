/*
 * File: app/view/MyWindow.js
 *
 * This file was generated by Sencha Architect version 4.0.2.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 6.2.x Classic library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 6.2.x Classic. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('InOut.view.RecordWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.RecordWindow',

    requires: [
        'InOut.view.RecordWindowViewModel',
        'InOut.view.RecordWindowViewController',
        'Ext.form.Panel',
        'Ext.form.field.Date',
        'Ext.form.field.Time',
        'Ext.toolbar.Toolbar',
        'Ext.container.ButtonGroup',
        'Ext.button.Button'
    ],

    viewModel: {
        type: 'RecordWindow'
    },
    height: '',
    width: 400,
    title: 'Создать запись',

    items: [
        {
            xtype: 'form',
            height: 345,
            bodyPadding: 10,
            items: [
                {
                    xtype: 'combobox',
                    anchor: '100%',
                    fieldLabel: 'Руководитель'
                },
                {
                    xtype: 'combobox',
                    anchor: '100%',
                    fieldLabel: 'Отсутствующий'
                },
                {
                    xtype: 'datefield',
                    anchor: '100%',
                    fieldLabel: 'Дата отсутствия'
                },
                {
                    xtype: 'timefield',
                    anchor: '100%',
                    width: 200,
                    fieldLabel: 'Начало'
                },
                {
                    xtype: 'timefield',
                    anchor: '100%',
                    width: 200,
                    fieldLabel: 'Завершение'
                },
                {
                    xtype: 'combobox',
                    anchor: '100%',
                    fieldLabel: 'Тип'
                },
                {
                    xtype: 'textfield',
                    width: 376,
                    fieldLabel: 'Комментарий'
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    items: [
                        {
                            xtype: 'buttongroup',
                            flex: 1,
                            anchor: '100%',
                            frame: false,
                            columns: 3,
                            items: [
                                {
                                    xtype: 'button',
                                    text: 'Создать'
                                },
                                {
                                    xtype: 'button',
                                    text: 'Согласовать'
                                },
                                {
                                    xtype: 'button',
                                    text: 'Отклонить'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]

});
