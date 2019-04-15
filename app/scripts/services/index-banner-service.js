'use strict';
App.factory('IndexBannerService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/banner', {}, {
            'indexBannerList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/banner/list'},
            'queryIndexBannerById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/banner/detail/:id'},
            'changeStatus': {method: 'POST', isArray: false, url: App.config.urlRoot + '/banner/update-status'}
    });
}]);
