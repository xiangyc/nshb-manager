'use strict';
App.factory('AboutService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/about/:id', {}, {
        'addOrUpdate': {method: 'POST', isArray: false, url: App.config.urlRoot + '/about/addOrUpdate/:id'},
        'queryAboutById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/about/query/:id'},
        'queryAboutList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/about/list'},
        'deleteAbout': {method: 'POST', isArray: false, url: App.config.urlRoot + '/about/delete'}
    });
}]);
