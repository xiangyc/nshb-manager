/**
 * xiangyc
 */
'use strict';
App.controller('ContactListCtrl', ['$scope','$uibModal','$confirm','alertService','$filter','ContactService',function($scope,$uibModal,$confirm,alertService,$filter,ContactService) {
    $scope.contact={};
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
            type:1
        };
        ContactService.queryContactList(params, function (data) {
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


	$scope.editContact = function (id) {
        $scope.contact =  ContactService.queryContactById({id: id},function() {
            $scope.showEditForm('md');
        });

        $scope.showEditForm = function () {
            var uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/system/edit-contact.html',
                controller: 'EditContactCtrl',
                backdrop: "static",
                resolve: {
                    data: function () {
                        return $scope.contact;
                    }
                },
                size: 'md'
            });
            uibModalInstance.result.then(function () {
                $scope.getPage();
            });
        };
    };
    
    $scope.addContact = function () {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/system/add-contact.html',
            controller: 'AddContactCtrl',
            backdrop: "static",
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };
    
    $scope.deleteContact = function (id) {
        $confirm({title: '提示框', text: '确认删除该条记录?', ok: '确认', cancel: '取消'},{size: 'sm'}).then(function (){
            ContactService.deleteContact({id: id}, function () {
                alertService.addSuccessAlert('删除成功');
                $scope.getPage();
            });
        });
    };

}]);


App.controller('AddContactCtrl', ['$scope','$uibModalInstance','ContactService','alertService',function($scope,$uibModalInstance,ContactService,alertService) {

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        //验证
        if(!$scope.contact){
            alertService.addErrorAlert('联系我们不能为空');
            return;
        }

        if(!$scope.contact.content){
            alertService.addErrorAlert('内容不能为空');
            return;
        }


        ContactService.addOrUpdate({ content: $scope.contact.content,type:1},function() {
            $uibModalInstance.close();
            alertService.addSuccessAlert('添加成功');
        });

    };

}]);

App.controller('EditContactCtrl',['$scope','$uibModalInstance','ContactService','data','alertService',function($scope,$uibModalInstance,ContactService,data,alertService) {

    //设置初始值
    $scope.contact = data;
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        //验证
        if(!$scope.contact){
            alertService.addErrorAlert('联系我们不能为空');
            return;
        }
        if(!$scope.contact.content){
            alertService.addErrorAlert('内容不能为空');
            return;
        }
        ContactService.addOrUpdate({id: $scope.contact.id, content: $scope.contact.content,type:1},function() {
            $uibModalInstance.close();
            alertService.addSuccessAlert('修改成功');
        });

    };

}]);

