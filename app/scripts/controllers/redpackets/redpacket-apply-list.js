'use strict';
App.controller('RedpacketApplyCtrl', ['$scope', '$log','RedpacketService','$filter','$uibModal','alertService',function ($scope, $log, RedpacketService,$filter,$uibModal,alertService) {

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
        $scope.status = null;
        $scope.title = null;
        $scope.startDate = null;
        $scope.endDate = null;
    };

    $scope.openRedpacketWin = function (redpacketId,status) {
        if(status == 1 || status == -1 || status == 2){
            return;
        }

        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/redpackets/redpacket-audit.html',
            controller: 'RedpacketAuditCtrl',
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

App.controller('RedpacketAuditCtrl', ['$scope','data','RedpacketService','$confirm','$uibModalInstance','alertService',
    function ($scope,data, RedpacketService,$confirm,$uibModalInstance,alertService) {

    // 接收参数
    $scope.redpacketId = data;

    $scope.init = function () {
        RedpacketService.redpacketApplyDetail({id: $scope.redpacketId}, function (data) {
            $scope.redpacketApply = data;
            if(data.banners == ""){
            	$("#defaultImg").removeClass('hide');
            }
        });
    };

    $scope.auditPass = function () {
        if($scope.auditNote){
            alertService.addErrorAlert('审核通过不需要填写原因!');
            return;
        } else {
            $confirm({title: '提示', text: '确认通过该商家红包申请吗?', ok: '确定', cancel: '取消'},{size: 'sm'}).then(function () {
                RedpacketService.auditRedPackets({id: $scope.redpacketId,status:1}, function () {
                    $uibModalInstance.close();
                    alertService.addSuccessAlert('商家红包申请通过!');
                });
            });
        }
    };

    $scope.auditNotPass = function () {

        if($scope.auditNote){
            $confirm({title: '提示', text: '确认不通过该商家红包申请吗?', ok: '确定', cancel: '取消'},{size: 'sm'}).then(function () {
                RedpacketService.auditRedPackets({id: $scope.redpacketId,status:-1,auditNote:$scope.auditNote}, function () {
                    $uibModalInstance.close();
                    alertService.addSuccessAlert('商家红包申请不通过!');
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
