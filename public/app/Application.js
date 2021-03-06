/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('InOut.Application', {
    extend: 'Ext.app.Application',
    name: 'InOut',


    stores: [
        'InOut.store.storeADUsers',
        'InOut.store.storeRequest'
        // TODO: add global / shared stores here
    ],
    
    init: function() {

    },

    launch: function () {
        // TODO - Launch the application
        var mask = Ext.get('loading-mask'),
            parent = Ext.get('loading-parent');
        parent.fadeOut({callback: function(){ parent.destroy(); }});
        mask.fadeOut({callback: function(){ mask.destroy(); }});
    },


    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    },

    routes : {
        'show/:id' : {
            before: 'onBefore',
            action: 'onShowRequestRoute',
            conditions : {
                ':id' : '([0-9]+)'
            }
        },
        'create' : {
            before: 'onShowCreateRoute'
        },
        'archive' : {
            before: 'onShowArchiveRoute'
        },
        'incoming' : {
            before: 'onShowIncomingRoute'
        },
        'outgoing' : {
            before: 'onShowOutgoingRoute'
        }
    },
    listen : {
        controller : {
            '#' : {
                unmatchedroute : 'onUnmatchedRoute'
            }
        }
    },

    onBefore : function(id, action) {
        console.log(id, action);
        action.resume();
    },

    onShowCreateRoute: function(){
        var window = Ext.create('InOut.view.request.windowRequest', {
            title: 'Создание нового запроса.',
            viewModel:{
                data: {
                    showMode: 'New'
                }
            }
        });
        window.show();
    },

    onShowRequestRoute: function(id) {
        console.log('onShowRequestRoute!!!!!!!!');
        Ext.Ajax.request({
            scope: this,
            method: 'GET',
            url: 'preloadrecord/'+ id,
            success: function(response) {
                var store = Ext.getStore('storeRequest');
                store.getProxy().url = 'preloadrecord/'+ id;
                store.load();
                store.on('load', function(store, records) {
                    if (Ext.isEmpty(records[0])) {
                        Ext.Msg.alert('Ошибка!', 'Такой записи не существует!');
                    } else {
                        if (records[0].data.deleted) {
                            Ext.Msg.alert('Ошибка!','Эта запись была удалена пользователем ' + records[0].data.   updated_user);
                        } else {
                            if (records[0].data.status == 'Новый') {
                                var window = Ext.create('InOut.view.request.windowRequest', {
                                    title: 'Согласование запроса.',
                                    viewModel:{
                                        data: {
                                            showMode: 'Approve'
                                        }
                                    }
                                });
                                window.down('form').loadRecord(records[0]);
                                window.show();
                            } else {
                                var window = Ext.create('InOut.view.request.windowRequest', {
                                    title: 'Запрос уже обработан!',
                                    viewModel:{
                                        data: {
                                            showMode: 'ReadOnly'
                                        }
                                    }
                                });
                                window.down('form').loadRecord(records[0]);
                                window.show();
                            }
                        }
                    }
                })
            },
            failure: function(response){
                Ext.Msg.alert('Ошибка!','У вас нет доступа к этой заявке.');
            }
        })
    },

    onShowArchiveRoute: function(){
        console.log('ARCHIVE!!!!!!!!!!!');
        var mainPanel = Ext.getCmp('maintabpanel');
        if (mainPanel){
            mainPanel.setActiveTab(2);
        }
    },
    onShowIncomingRoute: function(){
        console.log('INCOMING!!!!!!!!!!!');
        var mainPanel = Ext.getCmp('maintabpanel');
        if (mainPanel){
            mainPanel.setActiveTab(1);
        }
    },
    onShowOutgoingRoute: function(){
        console.log('OUTGOING!!!!!!!!!!!');
        var mainPanel = Ext.getCmp('maintabpanel');
        if (mainPanel){
            mainPanel.setActiveTab(0);
        }
    },

    onUnmatchedRoute : function(hash) {
        console.log('!!!!!!!!!!!');
        this.redirectTo( 'archive' );
    },



});
