'use strict';
App.controller('RegionListCtrl', ['$scope', 'RegionService', '$log','$uibModal','UI','alertService',function ($scope, RegionService, $log,$uibModal,UI,alertService) {

    //select中默认显示数
    $scope.viewby = '10';
   //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
    //翻页时，页面上显示的最大页数，
    $scope.maxSize = 10;

    $scope.file = {};

    //分页
    $scope.getPage = function() {
        //查询参数
        var params = {
            regionName: $scope.regionName,
            provinceName: $scope.provinceName,
            start: ($scope.currentPage - 1),
            maxResult: $scope.itemsPerPage
        };
        RegionService.regionList(params,function (data) {
            $scope.totalItems = data.totalItems;
            $scope.data = data.items;
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

    $scope.query  = function () {
        $scope.currentPage = 1; //reset to first paghe
        $scope.getPage();
    };
    $scope.reset = function() {
        $scope.regionName = null;
        $scope.provinceName = null;
    };
    //上传logo
    $scope.uploadLogo = function (id) {
        $scope.showCreateForm(id);
    };
    //上传logo弹出窗口
    $scope.showCreateForm = function (id) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/system/upload-logo.html',
            controller: 'system.UploadLogoCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return id;
                }
            },
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            $scope.reset();
            $scope.query();
            alertService.addSuccessAlert('上传地市LOGO成功！');
        });
    };

}]);
//上传logo控制器
App.controller('system.UploadLogoCtrl',  ['$scope','$uibModalInstance','RegionService','items','alertService','$http', function ($scope,$uibModalInstance,RegionService,items,alertService,$http) {
    $scope.id = items;
    $scope.init = function () {
      RegionService.findRegionByProvinceId({id: $scope.id},function (data) {
          $scope.region = data;
      });
    };
    $scope.submit = function () {
      var formData = new FormData();
      var file = document.getElementById("changeImg").files[0];
      formData.append("file", file);
      formData.append("id", $scope.id);
      if(!file){
        alertService.addErrorAlert('logo图片不能为空！');
        return;
      }
      $http.post(App.config.urlRoot + '/region',formData, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
          })
          .success(function () {
            //关闭窗口
            $uibModalInstance.close();
          });
    };

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
