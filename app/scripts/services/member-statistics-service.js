'use strict';

App.factory('MemberStatisticsService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/memberStatistics', {id: '@id'}, {
            'memberStatisticsList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/memberStatistics/list'}
    });
}]);
