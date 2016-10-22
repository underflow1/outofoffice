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
    }
});
