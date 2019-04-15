'use strict';
//角色用户设置
App.controller('system.StaffRoleCtrl',  ['$scope','$uibModalInstance','StaffService','RoleService','items','UI','alertService',function ($scope,$uibModalInstance,StaffService,RoleService,items,UI,alertService) {
    $scope.role = items;

    //设置初始值
    //select中默认显示数
    $scope.viewby = '10';
    //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
    //翻页时，页面上显示的最大页数，
    $scope.maxSize = 10;
    $scope.totalItems = 0;
    $scope.staff = [];
    $scope.isQueryStaff = true;
    $scope.checkItem = [];

    //分页
    $scope.getPage = function() {
        //查询参数
        var params = {
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };

        StaffService.query(params,function (data) {
            $scope.totalItems = data.totalItems;
            $scope.data = data.items;

            if($scope.isQueryStaff){
                RoleService.rolestaff({id: $scope.role.id}, function(data){
                    if(data){
                        $scope.staff = data;
                        angular.forEach($scope.staff, function(data){
                            $scope.checkItem.push(data.staff.id);
                        });

                        $scope.setSelect();
                        $scope.isQueryStaff = false;
                    }
                });
            }else{
                RoleService.rolestaff({id: $scope.role.id}, function(){
                    $scope.setSelect();
                });
            }
        });
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

    //选择已选项
    $scope.setSelect = function(){
        var chkArray = document.getElementsByName("userChk");

        angular.forEach($scope.checkItem, function(data){
            for (var i = 0; i < chkArray.length; i++) {
                if(data == chkArray[i].value){
                    chkArray[i].checked = true;
                }
            }
        });
    };

    //选择员工
    $scope.selectSatff = function(id, item){
        if(item.target.checked) {
            var existsId = false;
            angular.forEach($scope.checkItem, function(data){
                if(data == id){
                    existsId = true;
                }
            });

            if(!existsId) {
                $scope.checkItem.push(id);
            }
        }else{
            for(var i = 0; i < $scope.checkItem.length; i++) {
                if($scope.checkItem[i] == id) {
                    $scope.checkItem.splice(i, 1);
                }
            }
        }
    };

    //全选、全消
    $scope.selectAll = function() {
        var chkAll = document.getElementById("chkAll");
        var chkArray = document.getElementsByName("userChk");

        if (chkAll.checked) {
            for (var i = 0; i < chkArray.length; i++) {
                chkArray[i].checked = true;
            }
        } else {
            for (var j = 0; j < chkArray.length; j++) {
                chkArray[j].checked = false;
            }
        }
    };

    //父控制器中监听事件
    $scope.$on('repeatFinishEvent',function(){
        $scope.setSelect();
    });

    //保存
    $scope.onSaveEdit = function () {
        var ids = "0|";

        for (var i = 0; i <  $scope.checkItem.length; i++) {
            ids += $scope.checkItem[i] + "|";
        }

        if(ids.length > 0){
            ids = ids.substring(0,ids.length - 1);
        }

        RoleService.save({id: $scope.role.id, staffIds: ids}, function(data){
            if(data){
                alertService.addSuccessAlert('分配用户成功！');
                $uibModalInstance.close();
            }
        });
    };

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
