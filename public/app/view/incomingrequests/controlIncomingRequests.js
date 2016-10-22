/**
 * Created by kharlamov.a on 13.10.2016.
 */
Ext.define('InOut.view.incomingrequests.controlIncomingRequests', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.controlincomingrequests',
    requires: [
        'InOut.view.request.windowRequest',
    ],

    init: function() {
        this.listen({
            store: {
                '#storeIncomingRequests': {
                    load: 'onLoad'
                }
            }
        });
    },
    onLoad: function (store) {
        if (store.getCount() == 0) {
            this.getView().setTitle('Мои запросы');
        } else {
            this.getView().setTitle('Мои запросы (Не обработанных: ' + store.getCount() + ')');
        }
    },

    approveCurrentRequest:function(grid, record) {
        var window = Ext.create('InOut.view.request.windowRequest', {
            title: 'Согласование запроса.',
            viewModel:{
                data: {
                    showMode: 'Approve'
                }
            }
        });
        window.down('form').loadRecord(record);
        window.show();
    },

    inActions:function(element) {
        var me = this;
        switch (element.action) {
            case 'approveRequests' :
                if (me.view.getStore().getCount() != 0){
                    console.log(me.view.getStore().getCount());
                    var array = [];
                    //это если надо отправить только выделенную строку
                    /*array.push(me.view.getSelectionModel().getSelection()[0].data.id);*/
                    //это если надо отправить только выделенные строки
                    /*me.view.getSelectionModel().getSelection().forEach(function(item) {
                     array.push(item.data.id);
                     });*/
                    //это если надо перебрать всё в гриде
                    me.view.getStore().data.items.forEach(function(item) {
                        array.push(item.data.id);
                    });
                    Ext.Ajax.request({
                        scope: this,
                        method: 'POST',
                        url: '/approverequests',
                        params: {data: Ext.JSON.encode(array)},
                        success: function() {
                            //me.getStore('storeIncomingRequests').reload();
                            Ext.getStore('storeOutgoingRequests').reload();
                            Ext.getStore('storeIncomingRequests').reload();
                        },
                        failure: function (response) {
                            Ext.alert('Ошибка', response)
                        }
                    });
                }
                else {
                    Ext.lib.customFunctions.showToast('Нечего согласовывать');
                }
                break;
            }
        }
});