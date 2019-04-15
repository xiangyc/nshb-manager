/**
 * Created by tanzhiming on 2016/5/19.
 */
'use strict';

App.factory('Exporter', [function() {
    return {
        exportFile: function(url, param) {
            url = App.config.urlRoot + url;
            var form = document.createElement('form');
            document.body.appendChild(form);
            for (var p in param) {
                if (param[p]) {
                    createInput(form, 'hidden', p, param[p]);
                }
            }
            //form.method = 'get';
            //form.action = url;
            form.setAttribute('method', 'get');
            form.setAttribute('action', url);
            form.submit();
            document.body.removeChild(form);
            function createInput(form, type, name, value) {
                var tmpInput = document.createElement('input');
                //tmpInput.type = type;
                //tmpInput.name = name;
                //tmpInput.value = value;
                tmpInput.setAttribute('type', type);
                tmpInput.setAttribute('name', name);
                tmpInput.setAttribute('value', value);
                form.appendChild(tmpInput);
            }
        }
    };

}]);
