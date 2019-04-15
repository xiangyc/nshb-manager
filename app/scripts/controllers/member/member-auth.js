'use strict';
App.controller('MemberAuthCtrl', ['$scope', '$log','MemberAuthService','VdmUtil','UI','$filter','$rootScope','$uibModal','alertService',function ($scope, $log, MemberAuthService,VdmUtil,UI,$filter,$rootScope,$uibModal,alertService) {

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
            realName: $scope.realName,
            mobile: $scope.mobile,
            status: -2,
            startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };

        MemberAuthService.memberAuthList(params, function (data) {
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
        $scope.realName = null;
        $scope.status = -2;
        $scope.startDate = null;
        $scope.endDate = null;
    };


    $rootScope.showMemberDetail = function (memberId) {
        var uibModalInstance2 = $uibModal.open({
                animation: true,
                templateUrl: 'views/member/member-auth-detail.html',
                controller: 'MemberAuthDetailCtrl',
                backdrop: "static",
                resolve: {
                    data: function () {
                        return memberId;
                    }
                },
                size: 'max'
            });
            uibModalInstance2.result.then(function () {
                $scope.getPage();
            });

    };

}]);
