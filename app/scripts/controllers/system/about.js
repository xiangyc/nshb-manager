/**
 * xiangyc
 */
'use strict';
App.controller('AboutListCtrl', ['$scope','$uibModal','$confirm','alertService','$filter','AboutService',function($scope,$uibModal,$confirm,alertService,$filter,AboutService) {
    $scope.about={};
    //select中默认显示数
    $scope.viewby = '10';
    //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
	
    //分页
    $scope.getPage = function() {
        //查询参数
        var params = {
            startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage,
            type:0
        };
        AboutService.queryAboutList(params, function (data) {
            $scope.totalItems = data.totalItems;
            $scope.data = data.items;
        });
    };

    $scope.query  = function () {
        $scope.currentPage = 1;
        $scope.getPage();
    };

    // 下一页
    $scope.pageChanged = function () {
        $scope.getPage();
    };

    //切换pageSize
    $scope.setItemsPerPage = function (num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1; //reset to first paghe
        $scope.getPage();
    };


	$scope.editAbout = function (id) {
        $scope.about =  AboutService.queryAboutById({id: id},function() {
            $scope.showEditForm('md');
        });

        $scope.showEditForm = function () {
            var uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/system/edit-about.html',
                controller: 'EditAboutCtrl',
                backdrop: "static",
                resolve: {
                    data: function () {
                        return $scope.about;
                    }
                },
                size: 'md'
            });
            uibModalInstance.result.then(function () {
                $scope.getPage();
            });
        };
    };
    
    $scope.addAbout = function () {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/system/add-about.html',
            controller: 'AddAboutCtrl',
            backdrop: "static",
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };
    
    $scope.deleteAbout = function (id) {
        $confirm({title: '提示框', text: '确认删除该条记录?', ok: '确认', cancel: '取消'},{size: 'sm'}).then(function (){
            AboutService.deleteAbout({id: id}, function () {
                alertService.addSuccessAlert('删除成功');
                $scope.getPage();
            });
        });
    };

}]);


App.controller('AddAboutCtrl', ['$scope','$uibModalInstance','AboutService','alertService',function($scope,$uibModalInstance,AboutService,alertService) {

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        //验证
        if(!$scope.about){
            alertService.addErrorAlert('关于我们不能为空');
            return;
        }
        if(!$scope.about.content){
            alertService.addErrorAlert('内容不能为空');
            return;
        }


        AboutService.addOrUpdate({ content: $scope.about.content,type:0},function() {
            $uibModalInstance.close();
            alertService.addSuccessAlert('添加成功');
        });

    };

}]);

App.controller('EditAboutCtrl',['$scope','$uibModalInstance','AboutService','data','alertService',function($scope,$uibModalInstance,AboutService,data,alertService) {

    //设置初始值
    $scope.about = data;
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        //验证
        if(!$scope.about){
            alertService.addErrorAlert('关于我们不能为空');
            return;
        }
        if(!$scope.about.content){
            alertService.addErrorAlert('内容不能为空');
            return;
        }
        AboutService.addOrUpdate({id: $scope.about.id, content: $scope.about.content,type:0},function() {
            $uibModalInstance.close();
            alertService.addSuccessAlert('修改成功');
        });

    };

}]);

