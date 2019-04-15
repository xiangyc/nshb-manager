'use strict';

App.factory('MemberAuthService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/memberAuth', {id: '@id'}, {
            'memberAuthList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/memberAuth/list'},
            'memberAuth': {method: 'GET', isArray: false, url: App.config.urlRoot + '/memberAuth/auth/list'},
            'deleteAuth': {method: 'POST', isArray: false, url: App.config.urlRoot + '/memberAuth/delete/:id'}
    });
}]);
