'use strict';
App.factory('ContactService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/about/:id', {}, {
        'addOrUpdate': {method: 'POST', isArray: false, url: App.config.urlRoot + '/about/addOrUpdate/:id'},
        'queryContactById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/about/query/:id'},
        'queryContactList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/about/list'},
        'deleteContact': {method: 'POST', isArray: false, url: App.config.urlRoot + '/about/delete'}
    });
}]);