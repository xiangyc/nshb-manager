'use strict';
App.factory('RedpacketCollectService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/collection', {id: '@id'}, {
            'redpacketCollectList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/collection/redpacket/list'},
            'redpacketCollectApplyDetail': {method: 'GET', isArray: false, url: App.config.urlRoot + '/collection/detail'},
            'auditRedPacketsCollect': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/collection/redpacket/audit/:id'}
    });
}]);
