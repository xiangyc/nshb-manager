'use strict';
App.factory('SystemMessageService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/systemMessage', {id: '@id'}, {
            'systemMessageList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/systemMessage/list'},
            'saveSystemMessage': {method: 'POST', isArray: false, url: App.config.urlRoot + '/systemMessage'}
    });
}]);
