/*
 * File: app/view/MyViewportViewController.js
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

Ext.define('InOut.view.ViewportViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.viewportviewcontroller',

    init: function() {

    },

    activategridarchivedrequests: function(){
        var me = this;
        var startDate = Ext.getCmp('archive_date_begin').getSubmitValue();
        var endDate = Ext.getCmp('archive_date_end').getSubmitValue();
        me.view.getStore().getProxy().url = '/archivedrequestsrange/' + startDate + '/' + endDate;
        me.view.getStore().load();
        console.log(startDate, endDate);
    },

});
