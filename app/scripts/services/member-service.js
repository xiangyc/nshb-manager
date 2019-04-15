'use strict';

App.factory('MemberService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/member', {id: '@id'}, {
            'memberList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/member/list'},
            'memberDetail': {method: 'GET', isArray: false, url: App.config.urlRoot + '/member/:id'},
            'memberAuthDetail': {method: 'GET', isArray: false, url: App.config.urlRoot + '/member/auth/:id'},
            'memberInterestList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/member/interest/list'},
            'forbidMember': {method: 'PUT', url: App.config.urlRoot + '/member/forbid/:id'},
            'enableMember': {method: 'PUT', url: App.config.urlRoot + '/member/enable/:id'},
            'auditAuth': {method: 'PUT', url: App.config.urlRoot + '/memberAuth/auditAuth/:id'},
            'memberFreeAuth': {method: 'put', isArray: false, url: App.config.urlRoot + '/member/freeAuth/:id'}
    });
}]);
