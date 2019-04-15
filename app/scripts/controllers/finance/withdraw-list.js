'use strict';
App.controller('WithdrawListCtrl', ['$scope', '$log','WithdrawService','$filter','alertService','$uibModal',function ($scope, $log, WithdrawService,$filter,alertService,$uibModal) {

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
            status: $scope.status,
            startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ($scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };

        WithdrawService.withdrawList(params, function (data) {
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
        $scope.startDate = null;
        $scope.endDate = null;

    };

    // 提现审核
    $scope.openWithdrawApplyWin = function (applyId,status) {
        if(status == 1 || status == -1 || status == 2 || status == -2){
            return;
        }

        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/finance/withdraw-apply-audit.html',
            controller: 'WithdrawApplyAuditCtrl',
            backdrop: "static",
            resolve: {
                data: function () {
                    return applyId;
                }
            },
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };

    //到帐审核
    $scope.openCashApplyWin = function (applyId,status) {
        if(status === 1 || status == -1 || status == 2 || status == -2){
            return;
        }

        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/finance/withdraw-cash-audit.html',
            controller: 'WithdrawCashAuditCtrl',
            backdrop: "static",
            resolve: {
                data: function () {
                    return applyId;
                }
            },
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };

}]);

App.controller('WithdrawApplyAuditCtrl', ['$scope','data','WithdrawService','$confirm','$uibModalInstance','alertService',
    function ($scope,data, WithdrawService,$confirm,$uibModalInstance,alertService) {

    // 接收参数
    $scope.applyId = data;

    $scope.auditPass = function () {
        if($scope.auditNote){
            alertService.addErrorAlert('审核通过不需要填写原因!');
            return;
        } else {
            $confirm({title: '提示', text: '确认通过提现申请吗?', ok: '确定', cancel: '取消'},{size: 'sm'}).then(function () {
                WithdrawService.checkPass({id: $scope.applyId}, function () {
                    $uibModalInstance.close();
                    alertService.addSuccessAlert('提现申请通过!');
                });
            });
        }
    };

    $scope.auditNotPass = function () {

        if($scope.auditNote){
            $confirm({title: '提示', text: '确认不通过提现申请吗?', ok: '确定', cancel: '取消'},{size: 'sm'}).then(function () {
                WithdrawService.checkNotPass({id: $scope.applyId,auditNote:$scope.auditNote}, function () {
                    $uibModalInstance.close();
                    alertService.addSuccessAlert('提现申请不通过!');
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


App.controller('WithdrawCashAuditCtrl', ['$scope','data','WithdrawService','$confirm','$uibModalInstance','alertService',
    function ($scope,data, WithdrawService,$confirm,$uibModalInstance,alertService) {

    // 接收参数
    $scope.applyId = data;

    $scope.cashPass = function () {
        if($scope.auditNote){
            alertService.addErrorAlert('到账通过不需要填写原因!');
            return;
        } else {
            $confirm({title: '提示', text: '确认通过到账申请吗?', ok: '确定', cancel: '取消'},{size: 'sm'}).then(function () {
                WithdrawService.cashPass({id: $scope.applyId}, function () {
                    $uibModalInstance.close();
                    alertService.addSuccessAlert('到账申请通过!');
                });
            });
        }
    };

    $scope.cashNotPass = function () {

        if($scope.auditNote){
            $confirm({title: '提示', text: '确认不通过到账申请吗?', ok: '确定', cancel: '取消'},{size: 'sm'}).then(function () {
                WithdrawService.cashNotPass({id: $scope.applyId,auditNote:$scope.auditNote}, function () {
                    $uibModalInstance.close();
                    alertService.addSuccessAlert('到账申请不通过!');
                });
            });
        } else {
            alertService.addErrorAlert('请先输入到账不通过原因!');
            return;
        }
    };

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);
