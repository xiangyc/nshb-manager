'use strict';
App.factory('WithdrawService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/withdraw', {id: '@id'}, {
            'withdrawList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/withdraw/list'},
            'checkPass': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/withdraw/checkPass/:id'},
            'checkNotPass': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/withdraw/checkNotPass/:id'},
            'cashPass': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/withdraw/loanPass/:id'},
            'cashNotPass': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/withdraw/loanNotPass/:id'}
    });
}]);
