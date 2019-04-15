'use strict';
App.factory('TradeLogService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/tradeLog', {}, {
            'tradeLogList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/tradeLog/list'}
    });
}]);
