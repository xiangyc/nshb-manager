'use strict';
App.controller('MessageCtrl', ['$scope', '$log','MessageService','$filter','alertService','$uibModal',function ($scope, $log, MessageService,$filter,alertService,$uibModal) {

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

        //校验日期
        if ($scope.startDate > $scope.endDate) {
             alertService.addErrorAlert('结束时间必须大于起始时间！');
             return;
        }

        //查询参数
        var params = {
            title: $scope.title,
            status: $scope.status,
            startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ($scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };

        MessageService.messageList(params, function (data) {
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
        $scope.title = null;
        $scope.status = null;
        $scope.startDate = null;
        $scope.endDate = null;

    };

    $scope.showMessageDetail = function (id) {

        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/message/message-detail.html',
            controller: 'MessageDetailCtrl',
            backdrop: "static",
            resolve: {
                data: function () {
                    return id;
                }
            },
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };

}]);


App.controller('MessageDetailCtrl', ['$scope','data','MessageService','$uibModalInstance',
    function ($scope,data, MessageService,$uibModalInstance) {

    // 接收参数
    $scope.messageId = data;
    $scope.init = function () {
        MessageService.readMessage({id: $scope.messageId}, function (data) {
            $scope.message = data;
        });
    };

    $scope.onCancelClick = function () {
        $uibModalInstance.close();
        $uibModalInstance.dismiss('cancel');
    };

}]);
