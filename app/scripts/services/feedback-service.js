'use strict';
App.factory('FeedBackService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/feedBack', {}, {
            'feedBackList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/feedback/list'}
    });
}]);
