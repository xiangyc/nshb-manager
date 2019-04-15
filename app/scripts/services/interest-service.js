'use strict';
App.factory('InterestService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/interest/:id', {id: '@id'}, {
            'update': {method: 'POST', isArray: false, url: App.config.urlRoot + '/interest/update'},
            'delete': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/interest/delete/:id'},
            'query': {method: 'GET', isArray: true, url: App.config.urlRoot + '/interest/list'},
            'queryInterestById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/interest/:id'}
    });
}]);
