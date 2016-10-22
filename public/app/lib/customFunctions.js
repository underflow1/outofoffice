/**
 * Created by kharlamov.a on 15.10.2016.
 */
/**
 * Define some useful javascript functions, common for whole project
 */
Ext.define('InOut.lib.customFunctions', {
    alternateClassName: 'Ext.lib.customFunctions',

    singleton: true,

    getconfirm: function (callback){
        Ext.Msg.prompt('Внимание! Удаление записи', 'Для полного стирания записи <br> введите слово - ERASE', function(btn, text) {
            var dgfs = '';
            if ((btn == 'ok') && (text == 'ERASE')) {
                dgfs = true;
            }
            else {
                if (btn == 'cancel') {
                    dgfs = false;
                } else {
                    Ext.MessageBox.alert('Ошибка', 'Необходимо ввести слово ERASE');
                    dgfs = false;
                }
            }
            callback(dgfs);
        });
    },

    showToast: function(text) {
        Ext.toast({
            html: text,
            closable: false,
            align: 't',
            slideInDuration: 400,
            minWidth: 400
        });
    }

});

