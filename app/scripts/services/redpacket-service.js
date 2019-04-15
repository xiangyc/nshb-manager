'use strict';
App.factory('RedpacketService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/redpacket', {id: '@id'}, {
            'redpacketSendList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/redpacket/send/list'},
            'redpacketReceiveList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/redpacket/receive/list'},
            'RedpacketDetail': {method: 'GET', isArray: true, url: App.config.urlRoot + '/redpacket/send/detail/:id'},
            'redpacketApplyDetail': {method: 'GET', isArray: false, url: App.config.urlRoot + '/redpacket/apply/detail/:id'},
            'auditRedPackets': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/redpacket/audit/:id'},
            'redpacketCountDownList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/quizzes/redpacket/list'},
            'queryRedpacketCountDownById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/quizzes/redpacket/:id'},
            'saveCountDown': {method: 'POST', isArray: false, url: App.config.urlRoot + '/quizzes/redpacket/add'},
            'changeStatus': {method: 'POST', isArray: false, url: App.config.urlRoot + '/quizzes/update-status'},
            'getConfigValueByName':{method: 'GET', isArray: false, url: App.config.urlRoot + '/quizzes/getConfigValue'},
            'updateConfigValueByName':{method: 'PUT', isArray: false, url: App.config.urlRoot + '/quizzes/updateConfigValue'},
            'getQuizzesGroupList': {method: 'GET', isArray: true, url: App.config.urlRoot + '/quizzes/groupList'},
            "redpacketQuestionList": {method: 'GET', isArray: false, url: App.config.urlRoot + '/quizzes/question/list'},
            'deleteQuestion': {method: 'POST', isArray: false, url: App.config.urlRoot + '/quizzes/delete'}
    });
}]);
