'use strict';
App.factory('StaffService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/staff/:id', {id: '@id'}, {
            'update': {method: 'PUT'},
            'save': {method: 'POST', isArray: false, url: App.config.urlRoot + '/staff'},
            'query': {method: 'GET', isArray: false, url: App.config.urlRoot + '/staff/list'},
            'queryStaffById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/staff/:id'},
            'forbidStaff':{method:'PUT', url:App.config.urlRoot +'/staff/forbid/:id'},
            'startStaff':{method:'PUT', url:App.config.urlRoot +'/staff/start/:id'},
            'changePwd':{method:'PUT', url:App.config.urlRoot +'/staff/changePwd'},
            'resetPwd':{method:'PUT', url:App.config.urlRoot +'/staff/resetPwd/:id'}
    });
}]);
