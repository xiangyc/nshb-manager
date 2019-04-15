'use strict';
App.controller('RedpacketSendCtrl', ['$scope', '$log','RedpacketService','$filter','$uibModal','alertService',function ($scope, $log, RedpacketService,$filter,$uibModal,alertService) {

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
            mobile: $scope.mobile,
            title: $scope.title,
            status: $scope.status,
            startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };

        RedpacketService.redpacketSendList(params, function (data) {
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
        $scope.mobile = null;
        $scope.title = null;
        $scope.startDate = null;
        $scope.endDate = null;
    };

    $scope.showRedpacketDetail = function (redpacketId) {

        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/redpackets/redpacket-detail.html',
            controller: 'RedpacketDetailCtrl',
            backdrop: "static",
            resolve: {
                data: function () {
                    return redpacketId;
                }
            },
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };

}]);

App.controller('RedpacketDetailCtrl', ['$scope','data','RedpacketService','$confirm','$uibModalInstance',
    function ($scope,data, RedpacketService,$confirm,$uibModalInstance) {

    // 接收参数
    $scope.redpacketId = data;

    $scope.init = function () {
        RedpacketService.RedpacketDetail({id: $scope.redpacketId,type:1}, function (data) {
            $scope.data = data;
        });
    };

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);
