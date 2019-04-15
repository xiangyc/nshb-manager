'use strict';
App.factory('Permission', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/permission/:id', {}, {
        'rolepermission': {method: 'GET', isArray: true, url: App.config.urlRoot + '/permission/rolepermission/:id'},
        'allpermission': {method: 'GET',  isArray: true, url: App.config.urlRoot + '/permission/allpermission'},
        'menu': {method: 'GET', isArray: true, url: App.config.urlRoot + '/permission/menu'}
    });
}]);

App.factory('RoleService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/role/:id', {id: '@id'}, {
        'query': {method: 'GET', isArray: false, url: App.config.urlRoot + '/role/list'},
        'queryRoleById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/role/query/:id'},
        'update': {method: 'POST', isArray: false, url: App.config.urlRoot + '/role/update'},
        'delete': {method: 'POST', isArray: false, url: App.config.urlRoot + '/role/delete'},
        'save': {method: 'POST', isArray: false, url: App.config.urlRoot + '/role/add'},
        'addpermission': {method: 'POST', isArray: false, url: App.config.urlRoot + '/role/addpermission'},
        'rolestaff': {method: 'GET', isArray: true, url: App.config.urlRoot + '/role/rolestaff/:id'}
    });
}]);
