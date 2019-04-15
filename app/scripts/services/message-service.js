'use strict';
App.factory('MessageService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/message', {id: '@id'}, {
            'messageList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/message/list'},
            'readMessage': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/message/:id'},
    });
}]);
