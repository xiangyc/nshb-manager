'use strict';
App.factory('CouponService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/coupon', {}, {
            'couponList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/coupon/list'},
            'sendCoupon': {method: 'POST', isArray: false, url: App.config.urlRoot + '/coupon/send'}
    });
}]);
