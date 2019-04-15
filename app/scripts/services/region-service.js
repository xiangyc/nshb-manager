'use strict';
App.factory('RegionService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/region/:id', {id: '@id'}, {
            'update': {method: 'PUT'},
            'regionList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/region/list'},
            'findRegionByProvinceId': {method: 'GET', isArray: false, url: App.config.urlRoot + '/region/:id'}
    });
}]);
