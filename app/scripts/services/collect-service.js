'use strict';
App.factory('CollectService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/collect', {}, {
            'collectList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/collect/list'}
    });
}]);
