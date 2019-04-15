'use strict';
App.factory('TicketService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/coupon', {}, {
            'ticketList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/coupon/search'},
            'tradeLoglist': {method: 'GET', isArray: false, url: App.config.urlRoot + '/tradeLog/list'},
            'getProvinceList': {method: 'GET', isArray: true, url: App.config.urlRoot + '/region/province'},
            'getRegionList': {method: 'GET', isArray: true, url: App.config.urlRoot + '/region/all'},
            'delete': {method: 'POST', isArray: false, url: App.config.urlRoot + '/coupon/delete'},      
            'updateStatus':{method:'POST', isArray: false,url:App.config.urlRoot +'/coupon/update-status'},
            'saveTicket': {method: 'POST', isArray: false, url: App.config.urlRoot + '/coupon/save'}
    });
}]);
