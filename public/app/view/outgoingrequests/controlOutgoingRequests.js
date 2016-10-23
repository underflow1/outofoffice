/**
 * Created by kharlamov.a on 13.10.2016.
 */
Ext.define('InOut.view.outgoingrequests.controlOutgoingRequests', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.controloutgoingrequests',
    requires: [
        'InOut.view.request.windowRequest',
    ],

    init: function() {
        this.listen({
            store: {
                '#storeOutgoingRequests': {
                    load: 'onLoad'
                }
            }
        });
    },

    onLoad: function (store) {
        if (store.getCount() == 0) {
            this.getView().setTitle('Мои запросы');
        } else {
            this.getView().setTitle('Мои запросы (Открытых: ' + store.getCount() + ')');
        }
    },

    showCurrentRequest:function(grid, record) {
        var window = Ext.create('InOut.view.request.windowRequest');
        window.down('form').loadRecord(record);
        //console.log(record);
        window.show();
    },

    outActions:function(element) {
        var me = this;
        switch (element.action) {
            case 'showNewRequestWindow':
                    Ext.create('InOut.view.request.windowRequest', {
                        title: 'Создание нового запроса.',
                        viewModel:{
                            data: {
                                showMode: 'New'
                            }
                        }
                    }).show();
                    break;

            case 'deleteRequests' :
                if (!Ext.isEmpty(me.view.getSelectionModel().getSelection())){
                    Ext.lib.customFunctions.getconfirm(function(confirm){
                        if (confirm){
                            var array = [];
                            //это если надо отправить только выделенную строку
                            /*array.push(me.view.getSelectionModel().getSelection()[0].data.id);*/
                            //это если надо отправить только выделенные строки
                            me.view.getSelectionModel().getSelection().forEach(function(item) {
                                array.push(item.data.id);
                                var rec = Ext.data.Record;
                                Ext.Ajax.request({
                                    scope: this,
                                    method: 'GET',
                                    url: '/testaaa/' + item.data.id,
                                    success: function(response){
                                        console.log(Ext.decode(response.responseText).data);
                                        rec.data = Ext.decode(response.responseText).data;
                                        console.log(rec);
                                    }
                                })
                            });
                            console.log(array);
                            //это если надо перебрать всё в гриде
                            /* me.view.getStore().data.items.forEach(function(item) {
                             array.push(item.data.id);
                             });*/
                            Ext.Ajax.request({
                                scope: this,
                                method: 'POST',
                                url: '/deleterequest',
                                params: {data: Ext.JSON.encode(array)},
                                success: function() {
                                    me.getStore('storeOutgoingRequests').reload();
                                },
                                failure: function (response) {
                                    Ext.alert('Ошибка', response)
                                }
                            });
                        } else {
                            Ext.lib.customFunctions.showToast('Ничего не удалено!');
                        }
                    })
                }
                else {
                    Ext.lib.customFunctions.showToast('Нечего удалять');
                    //Ext.MessageBox.alert('Нечего удалять','Ничего не выделено!' );
                }
                break;
            }
        }
});