'use strict';
App.controller('RedpacketQuestionCtrl', ['$scope', '$log','RedpacketService','$filter','$uibModal','alertService','$confirm','Exporter',function ($scope, $log, RedpacketService,$filter,$uibModal,alertService,$confirm,Exporter) {

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
            title: $scope.title,
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };

        RedpacketService.redpacketQuestionList(params, function (data) {
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
    };

    $scope.openImportPage = function () {
       
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/quizzes/redpacket-import.html',
            controller: 'RedpacketImportCtrl',
            backdrop: "static",
            resolve: {
                data: function () {
                    return $scope.totalItems;
                }
            },
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };

    $scope.deleteQuestion = function (id) {
        $confirm({title: '确认', text: '确定删除该题目吗？',ok:'确认',cancel: '取消'},{size: 'sm'}).then(function () {
            RedpacketService.deleteQuestion({id: id}, function () {
                $scope.query();
                alertService.addSuccessAlert('删除题目成功!');
            });
        });
    };

    $scope.openExportPage = function () {
         Exporter.exportFile('/quizzes/exportExcel', {
          title: $scope.title
         });
    };

}]);

App.controller('RedpacketImportCtrl', ['$scope','RedpacketService','$confirm','$uibModalInstance','alertService','$http','data',
    function ($scope, RedpacketService,$confirm,$uibModalInstance,alertService,$http,data) {

    var totalCount = data;
    $scope.importExcel = function () {
        if(!$scope.file){
            alertService.addErrorAlert('请选择正确格式的excel!');
            return;
        }

        var formData = new FormData();
        formData.append("file", $scope.file);

        formData.append("totalCount", totalCount);
        
        $http.post(App.config.urlRoot + '/quizzes/importExcel',formData, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
        }).success(function (ret) {
            if(ret && ret.success){
                alertService.addSuccessAlert("导入成功");
                //关闭窗口
                $uibModalInstance.close();
            } else {
                alertService.addErrorAlert(ret.message);
            }
            
        });
    };

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);
