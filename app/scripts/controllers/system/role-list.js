'use strict';
App.controller('RoleListCtrl', ['$scope', 'RoleService', '$log','$uibModal','UI','$confirm','alertService',function ($scope, RoleService, $log, $uibModal,UI,$confirm,alertService) {
    //select中默认显示数
    $scope.viewby = '10';
   //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
    //角色
    $scope.role = {};

    //分页
    $scope.getPage = function() {
        //查询参数
        var params = {
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        RoleService.query(params, function (data) {
            $scope.totalItems = data.totalItems;
            $scope.data = data.items;
        });
    };

    $scope.query  = function () {
        $scope.currentPage = 1;
        $scope.getPage();
    };

    //添加角色
    $scope.addRole = function (size) {
       $scope.role = {};
        $scope.showCreateForm(size);
    };

  //创建窗口
    $scope.showCreateForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/system/role-add.html',
            controller: 'system.EditRoleCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return $scope.role;
                }
            },
            size: size
        });
        uibModalInstance.result.then(function () {
            if($scope.role.id){
                //修改
                RoleService.update({ id: $scope.role.id, name: $scope.role.name, note: $scope.role.note  },function() {
                    $scope.query();
                    alertService.addSuccessAlert('修改角色成功！');
                });
            }else{
                //添加
                RoleService.update({ name: $scope.role.name, note: $scope.role.note  },function() {
                    $scope.query();
                    alertService.addSuccessAlert('添加角色成功！');
                });
            }
        });
    };

    //删除角色
    $scope.onDeleteRole = function (id) {
        $confirm({title: '确认?', text: '确定删除角色', ok: '确定', cancel: '取消'},{size: 'sm'}).then(function (){
            RoleService.rolestaff({id: id}, function (data) {
               if (data !== null && data.length > 0){
                   UI.alert({title:'提示',message:'该角色被引用不能删除， 请先删除角色下用户！'});
               }else {
                   RoleService.delete({id: id },function() {
                       $scope.query();
                       alertService.addSuccessAlert('删除角色成功！');
                   });
               }
            });
        });
    };

    //修改角色
    $scope.onEditRole = function (id) {
        $scope.role =  RoleService.queryRoleById({id: id},function() {
            $scope.showCreateForm('md');
        });
    };

    //分配权限
    $scope.grantPermission = function(role){
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/system/permission-grant.html',
            controller: 'system.PermissionGrantCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return role;
                }
            },
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            //保存
        });
    };

    //分配用户
    $scope.grantStaff = function(role) {
       var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/system/edit-staff-role.html',
            controller: 'system.StaffRoleCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return role;
                }
            },
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            //保存
        });
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

}]);

//角色权限设置
App.controller('system.PermissionGrantCtrl',  ['$scope','$uibModalInstance','Permission','RoleService','ivhTreeviewBfs','ivhTreeviewMgr','items','alertService',function ($scope,$uibModalInstance,Permission,RoleService,ivhTreeviewBfs,ivhTreeviewMgr,items,alertService) {
    //设置初始值
    $scope.role = items;
    $scope.menu = [];
    $scope.rolePermission = [];
    $scope.selectedItems = [];

    function selectMenu(menus, selectedIds) {
        angular.forEach(menus, function(menu) {
            if (menu.children && menu.children.length > 0) {
                selectMenu(menu.children, selectedIds);
            } else {
                angular.forEach(selectedIds, function (id) {
                    if (menu.id == id) {
                        $scope.selectedItems.push(id);
                        return;
                    }
                });
            }
        });

    }

    Permission.allpermission(function(data){
        if(data){
          $scope.menu = data;
            Permission.rolepermission({id: $scope.role.id}, function(data){
                if(data){
                    angular.forEach(data, function(item){
                        $scope.rolePermission.push(item.id);
                    });
                    selectMenu($scope.menu, $scope.rolePermission);
                    $scope.setSelect();
                }
            });
        }
    });

    //选择已选项
    $scope.setSelect = function(){
       // ivhTreeviewMgr.selectEach($scope.menu, $scope.rolePermission);
       ivhTreeviewMgr.selectEach($scope.menu, $scope.selectedItems);
    };

    //全选
    $scope.onSelectAll = function(){
        ivhTreeviewMgr.selectAll($scope.menu);
    };

    //全消
    $scope.onUnSelectAll = function(){
        ivhTreeviewMgr.deselectAll($scope.menu);
    };

    //保存
    $scope.onSaveEdit = function () {
        var ids = "0|";

        ivhTreeviewBfs($scope.menu, function(node) {
            if (node.selected){
                ids += node.id + "|";
            }

        });

        if(ids.length > 0){
            ids = ids.substring(0,ids.length - 1);
        }

        RoleService.addpermission({id: $scope.role.id, permissionIds: ids}, function(data){
            if(data){
                alertService.addSuccessAlert('角色权限设置成功！');
                $uibModalInstance.close();
            }
        });

        $uibModalInstance.close();
    };

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

//新建/编辑角色
App.controller('system.EditRoleCtrl',  ['$scope','$uibModalInstance','items','alertService',function ($scope,$uibModalInstance,items,alertService) {
    //设置初始值
    $scope.role = items;
    $scope.onSaveEdit = function () {
        if(!$scope.role){
            alertService.addErrorAlert('角色信息不能为空！');
            return;
        }
        if(!$scope.role.name){
            alertService.addErrorAlert('角色名称不能为空！');
            return;
        }
        if(!$scope.role.note){
            alertService.addErrorAlert('角色说明不能为空！');
            return;
        }
        $uibModalInstance.close();
    };
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
