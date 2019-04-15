'use strict';
App.controller('SystemMessageListCtrl', ['$scope', '$log','SystemMessageService','$filter','alertService','$uibModal',function ($scope, $log, SystemMessageService,$filter,alertService,$uibModal) {

    //select中默认显示数
    $scope.viewby = '10';
    //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
    //翻页时，页面上显示的最大页数，
    $scope.maxSize = 10;
    // 初始化在修改时需要返回的data对象
    $scope.data = [];

    //分页
    $scope.getPage = function () {

        //查询参数
        var params = {
            targetRange: $scope.targetRange,
            ageRange: $scope.ageRange,
            sex: $scope.sex,
            type: $scope.type,
            start: ( $scope.currentPage - 1),
            maxResult: $scope.itemsPerPage
        };

        SystemMessageService.systemMessageList(params, function (data) {
            //查询成功处理
            $scope.totalItems = data.totalItems;
            $scope.data = data.items === null ? [] : data.items;

        });
    };
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };
    $scope.pageChanged = function () {
        $scope.getPage();
    };
    //切换pageSize
    $scope.setItemsPerPage = function (num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1; //reset to first paghe
        $scope.getPage();
    };

    $scope.query = function () {
        $scope.currentPage = 1; //reset to first paghe
        $scope.getPage();
    };
    $scope.reset = function () {
        $scope.targetRange = null;
        $scope.ageRange = null;
        $scope.sex = null;
        $scope.type = null;
    };

    $scope.openSendSystemMessageWin = function () {

        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/message/send-system-message.html',
            controller: 'SendSystemMessageCtrl',
            backdrop: "static",
            size: 'lg'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };

}]);

App.controller('SendSystemMessageCtrl', ['$scope','SystemMessageService','$uibModalInstance','alertService',
    function ($scope, SystemMessageService,$uibModalInstance,alertService) {

    $scope.changeTarget = function () {
        if($scope.systemMessage.targetRange === '0'){
            $("#ageRange").attr("disabled","disabled");
            $("#sex").attr("disabled","disabled");
            $("#type").attr("disabled","disabled");
         } else {
            $("#ageRange").removeAttr("disabled");
            $("#sex").removeAttr("disabled");
            $("#type").removeAttr("disabled");
        }
    };

    $scope.saveSystemMessage = function () {
        if(!$scope.systemMessage){
            alertService.addErrorAlert('请配置系统消息！');
            return;
        }
        if(!$scope.systemMessage.targetRange){
            alertService.addErrorAlert('请选择目标条件！');
            return;
        }
        if(!$scope.systemMessage.content){
            alertService.addErrorAlert('请填写消息内容！');
            return;
        }
        SystemMessageService.saveSystemMessage($scope.systemMessage, function () {
            alertService.addSuccessAlert('成功配置系统消息！');
            $uibModalInstance.close();
        });
    };

    $scope.onCancelClick = function () {
        $uibModalInstance.close();
        $uibModalInstance.dismiss('cancel');
    };

}]);
