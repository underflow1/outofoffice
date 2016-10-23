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
        'archive' : {
            before: 'onShowArchiveRoute'
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

    onShowRequestRoute: function(id) {
        console.log('onShowRequestRoute!!!!!!!!');
        var store = Ext.getStore('storeRequest');
        store.getProxy().url = 'testaaa/'+ id;
        store.load();
        store.on('load', function(store, records) {
            if (Ext.isEmpty(records[0])) {
                Ext.lib.customFunctions.showToast('Такой записи не существует!');
            } else {
                if (records[0].data.deleted) {
                    Ext.lib.customFunctions.showToast('Эта запись была удалена пользователем ' + records[0].data.   updated_user);
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

    onShowArchiveRoute: function(){
        console.log('ARCHIVE!!!!!!!!!!!');
        var mainPanel = Ext.getCmp('maintabpanel');
        if (mainPanel){
            mainPanel.setActiveTab(2);
            var startDate = Ext.getCmp('archive_date_begin').getSubmitValue();
            var endDate = Ext.getCmp('archive_date_end').getSubmitValue();
            Ext.getStore('storeArchivedRequests').getProxy().url = '/archivedrequestsrange/' + startDate + '/' + endDate;
            Ext.getStore('storeArchivedRequests').load();
            console.log(Ext.getStore('storeArchivedRequests').getProxy().url);
        }
    },

    onUnmatchedRoute : function(hash) {
        console.log('!!!!!!!!!!!');
        this.redirectTo( 'archive' );
    },



});
