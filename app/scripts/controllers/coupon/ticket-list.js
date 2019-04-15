'use strict';
App.controller('TicketListCtrl', ['$scope', '$log','TicketService','$filter','alertService','$uibModal','$confirm','VdmUtil',function ($scope, $log, TicketService,$filter,alertService,$uibModal,$confirm,VdmUtil) {

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
            startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };

        TicketService.ticketList(params, function (data) {
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
        $scope.startDate = null;
        $scope.endDate = null;
    };

    $scope.openAddTicketWin = function () {

        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/coupon/add-ticket.html',
            controller: 'AddTicketCtrl',
            backdrop: "static",
            size: 'lg'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };

    $scope.delete = function (id) {
        $confirm({title: '确认', text: '确定删除该门票吗？',ok:'确认',cancel: '取消'},{size: 'sm'}).then(function () {
            TicketService.delete({id: id}, function () {
                $scope.reset();
                $scope.query();
                alertService.addSuccessAlert('删除成功!');
            });
        });
    };

    //上线
    $scope.onUpshelf = function (id,status) {
        if(status==1){
            alertService.addErrorAlert('该门票已经上线！');
            return;
        }

        $confirm({title: '提示', text: '确定上线门票吗？',ok:'确认',cancel: '取消'},{size: 'sm'}).then(function () {
            TicketService.updateStatus({id: id,status:1}, function () {
                $scope.reset();
                $scope.query();
                alertService.addSuccessAlert('上线门票成功！');
            });
        });
    };

}]);

App.controller('AddTicketCtrl', ['$scope','TicketService','$uibModalInstance','alertService','VdmUtil',
    function ($scope, TicketService,$uibModalInstance,alertService,VdmUtil) {

    TicketService.getProvinceList({},function(data) {
        $scope.provinceList = data; 
    });

    $scope.changeProvince=function() {
        if ($scope.provinceId) {
            // 所属品牌
            TicketService.getRegionList({provinceId: $scope.provinceId}, function (data) {
                $scope.regionList = data;
            });
        } else {
            $scope.regionList = null;
        }
    };

    $scope.save = function () {
        var options1=$("#select1 option:selected");
        var options2=$("#select2 option:selected");
        if(!$scope.startDate){
            alertService.addErrorAlert('开始时间不能为空！');
            return;
        }
        if(!$scope.endDate){
            alertService.addErrorAlert('结束时间不能为空！');
            return;
        }

        if ($scope.startDate > $scope.endDate) {
             alertService.addErrorAlert('结束时间必须大于起始时间！');
             return;
        }

        if(!$scope.provinceId){
            alertService.addErrorAlert('省不能为空！');
            return;
        }
        if(!$scope.regionId){
            alertService.addErrorAlert('市不能为空！');
            return;
        }
        if(!$scope.value){
            alertService.addErrorAlert('张数不能为空！');
            return;
        }

        if(!VdmUtil.validateInteger($scope.value)){
            alertService.addErrorAlert('张数必须为整数！');
            return;
        }

        var cityName = options1.text();
        var regionName = options2.text();

        var startTime = new Date($scope.startDate).getTime();
        var endTime = new Date($scope.endDate).getTime();

        TicketService.saveTicket({value:$scope.value,startTime:startTime,endTime:endTime,cityName:cityName,regionName:regionName}, function () {
            $uibModalInstance.close();
        });
    };

    $scope.onCancelClick = function () {
        //$uibModalInstance.close();
        $uibModalInstance.dismiss('cancel');
    };

}]);
