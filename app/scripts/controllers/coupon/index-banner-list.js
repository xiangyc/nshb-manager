'use strict';
App.controller('IndexBannerListCtrl', ['$scope', '$log','IndexBannerService','$filter','alertService','$uibModal','$confirm',function ($scope, $log, IndexBannerService,$filter,alertService,$uibModal,$confirm) {

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
    
    $scope.banner = {};

    //分页
    $scope.getPage = function () {

        //查询参数
        var params = {
            status: $scope.status,
            bannerName: $scope.bannerName,
            startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };

        IndexBannerService.indexBannerList(params, function (data) {
            //查询成功处理
            $scope.totalItems = data.totalItems;
            $scope.data = data.items === null ? [] : data.items;

            $scope.count = 0;

            for(var i=0;i<data.items.length;i++){
                //alert(JSON.stringify(data.items[i].status));
                if(data.items[i].status === 1){
                    $scope.count = $scope.count + 1;
                }
            }

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
        $scope.bannerName = null;
        $scope.startDate = null;
        $scope.endDate = null;
    };
    
    $scope.addIndexBanner = function (size) {
        $scope.banner = {};
        $scope.showCreateForm(size);
    };

    $scope.showCreateForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/coupon/index-banner-add.html',
            controller: 'system.AddIndexBannerCtrl',
            backdrop: "static",
            size: size
        });
        uibModalInstance.result.then(function () {
            $scope.reset();
            $scope.query();
            alertService.addSuccessAlert('成功添加首页banner！');
        });
    };

    $scope.showEditForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/coupon/index-banner-edit.html',
            controller: 'system.EditIndexBannerCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return $scope.banner;
                }
            },
            size:size
        });
        uibModalInstance.result.then(function () {
            $scope.reset();
            $scope.query();
            alertService.addSuccessAlert('成功修改首页banner！');
        });
    };
    
    $scope.editIndexBanner = function (id) {
        $scope.banner =  IndexBannerService.queryIndexBannerById({id:id},function() {
            $scope.showEditForm('md');
        });

    };
    
    
    $scope.upShelf = function (id,status) {
        //alert($scope.count);

        if(status === 1){
            alertService.addErrorAlert('该banner已经上架！');
            return;
        }

        if($scope.count === 6){
            alertService.addErrorAlert('banner最多可上架6个！');
            return;
        }
    	
    	$confirm({title: '提示', text: '确认是否上架该banner?',ok:'确认',cancel: '取消'},{size: 'sm'}).then(function () {
            IndexBannerService.changeStatus({id: id,status:1}, function () {
                $scope.query();
                alertService.addSuccessAlert('成功上架');
            });
        });
    };

    $scope.offShelf = function (id) {
    	
    	$confirm({title: '提示', text: '确认是否下架该banner?',ok:'确认',cancel: '取消'},{size: 'sm'}).then(function () {
            IndexBannerService.changeStatus({id: id,status:-1}, function () {
                $scope.query();
                alertService.addSuccessAlert('成功下架');
            });
        });
    
    };

}]);


App.controller('system.AddIndexBannerCtrl',  ['$scope','$uibModalInstance','alertService','$http',function ($scope,$uibModalInstance,alertService,$http) {
    

    $scope.save = function () {
        
        if(!$scope.banner){
            alertService.addErrorAlert('首页banner信息不能为空！');
            return;
        }
        
        if(!$scope.banner.bannerName){
            alertService.addErrorAlert('banner名称不能为空！');
            return;
        }
        
        var formData = new FormData();
        var file = document.getElementById("changeImg").files[0];
      	formData.append("file", file);
      	formData.append("bannerName", $scope.banner.bannerName);
      	
      	if(!file){
        	alertService.addErrorAlert('banner图片不能为空');
        	return;
      	}
      	$http.post(App.config.urlRoot + '/banner/save',formData, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
        }).success(function () {
            //关闭窗口
            $uibModalInstance.close();
        });
    };
    
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);


App.controller('system.EditIndexBannerCtrl',  ['$scope','$uibModalInstance','alertService', '$http','items',function ($scope,$uibModalInstance,alertService,$http,items) {
	
	//设置初始值
    $scope.banner = items;
    
   	//修改门店
    $scope.save = function () {
    	
    	if(!$scope.banner){
            alertService.addErrorAlert('首页banner信息不能为空！');
            return;
        }
        
        if(!$scope.banner.bannerName){
            alertService.addErrorAlert('banner名称不能为空！');
            return;
        }
        
        var formData = new FormData();
        var file = document.getElementById("changeImg").files[0];
      	formData.append("file", file);
      	formData.append("bannerName", $scope.banner.bannerName);
      	formData.append("id", $scope.banner.id);
      	
      	$http.post(App.config.urlRoot + '/banner/update',formData, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
        }).success(function () {
            //关闭窗口
            $uibModalInstance.close();
        });
    };
    
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);