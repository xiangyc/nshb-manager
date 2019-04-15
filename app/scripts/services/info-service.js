'use strict';

App.factory('InfoService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/infos/:id', {}, {
        infos:{method: 'GET', isArray: false, url: App.config.urlRoot +'/members'}
    });
}]);
