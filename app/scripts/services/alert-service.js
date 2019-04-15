/**
 * Created by zengfan on 2016/6/21.
 */
'use strict';
App.factory('alertService', function($rootScope) {
    var alertService = {};
    // 创建一个全局的 alert 数组
    $rootScope.alerts = [];
    /**
     *
     * @param type  [error,warning,info,success,danger]
     * @param msg
     */
    alertService.addAlert = function(type, msg) {
        $rootScope.alerts.push({'type': type, 'msg': msg, 'close': function(){ alertService.closeAlert(this); }});
    };
    alertService.addSuccessAlert = function(msg) {
        alertService.addAlert('success',msg);
    };
    alertService.addErrorAlert = function(msg) {
        alertService.addAlert('danger',msg);
    };
    alertService.closeAlert = function(alert) {
        alertService.closeAlertIdx($rootScope.alerts.indexOf(alert));
    };
    alertService.closeAlertIdx = function(index) {
        $rootScope.alerts.splice(index, 1);
    };
    return alertService;
});
