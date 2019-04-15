'use strict';
App.factory('MobileSendService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/mobileRecords', {}, {
            'mobileSendList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/mobileRecords/list'}
    });
}]);
