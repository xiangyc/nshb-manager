'use strict';
App.controller('RedpacketCollectCtrl', ['$scope', '$log','RedpacketCollectService','$filter','$uibModal','alertService',function ($scope, $log, RedpacketCollectService,$filter,$uibModal,alertService) {

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
            status: $scope.status,
            businessName: $scope.businessName,
            startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };

        RedpacketCollectService.redpacketCollectList(params, function (data) {
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
        $scope.status = null;
        $scope.businessName = null;
        $scope.startDate = null;
        $scope.endDate = null;
    };

    $scope.openRedpacketWin = function (redpacketId,status,banners) {
        if(status == 1 || status == -1 || status == 2){
            return;
        }

        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/quizzes/redpacket-collect-audit.html',
            controller: 'RedpacketCollectAuditCtrl',
            backdrop: "static",
            resolve: {
                data: function () {
                    return redpacketId;
                },
                banners:function(){
                    return banners;
                }
            },
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };

}]);

App.controller('RedpacketCollectAuditCtrl', ['$scope','data','RedpacketCollectService','$confirm','$uibModalInstance','alertService','banners',
    function ($scope,data, RedpacketCollectService,$confirm,$uibModalInstance,alertService,banners) {

    // 接收参数
    $scope.redpacketId = data;
    $scope.banners = banners;
    //alert(JSON.stringify(banners));

    $scope.auditPass = function () {
        if($scope.auditNote){
            alertService.addErrorAlert('审核通过不需要填写原因!');
            return;
        } else {
            $confirm({title: '提示', text: '确认通过该申请吗?', ok: '确定', cancel: '取消'},{size: 'sm'}).then(function () {
                RedpacketCollectService.auditRedPacketsCollect({id: $scope.redpacketId,status:1}, function () {
                    $uibModalInstance.close();
                    alertService.addSuccessAlert('红包集申请通过!');
                });
            });
        }
    };

    $scope.auditNotPass = function () {

        if($scope.auditNote){
            $confirm({title: '提示', text: '确认不通过该申请吗?', ok: '确定', cancel: '取消'},{size: 'sm'}).then(function () {
                RedpacketCollectService.auditRedPacketsCollect({id: $scope.redpacketId,status:-1,auditNote:$scope.auditNote}, function () {
                    $uibModalInstance.close();
                    alertService.addSuccessAlert('红包集申请不通过!');
                });
            });
        } else {
            alertService.addErrorAlert('请先输入审核不通过原因!');
            return;
        }
    };

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);
