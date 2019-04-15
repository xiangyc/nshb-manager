'use strict';
App.factory('OrderService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/tradeLog', {}, {
            'orderList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/order/list'}
    });
}]);
