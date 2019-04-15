'use strict';
App.factory('Login', ['$resource',
    function ($resource) {
        return $resource(App.config.urlRoot +'/staff', {id: '@id'}, {
            'login': {method: 'POST',  url: App.config.urlRoot + '/staff/login'},
            'captcha': {method: 'GET', isArray: false, url: App.config.urlRoot + '/staff/captcha'},
            'getStaff': {method: 'GET',  url: App.config.urlRoot + '/staff/currentStaff', isArray: false},
            'logout': {method: 'POST',  url: App.config.urlRoot + '/staff/logout'}
    });
}]);


App.factory('PlatformService', ['$resource',
    function ($resource) {
        return $resource(App.config.urlRoot +'/platform', {id: '@id'}, {
            'findPlatformStatistics': {method: 'GET',  url: App.config.urlRoot + '/platform/statistics', isArray: false}
    });
}]);
