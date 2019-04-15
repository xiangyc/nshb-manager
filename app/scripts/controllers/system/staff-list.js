'use strict';
App.controller('StaffListCtrl', ['$scope', 'StaffService', '$log','$uibModal','UI','alertService','$confirm',function ($scope, StaffService, $log,$uibModal,UI,alertService,$confirm) {

    //select中默认显示数
    $scope.viewby = '10';
   //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
    //翻页时，页面上显示的最大页数，
    $scope.maxSize = 10;

    $scope.user = {};

    //分页
    $scope.getPage = function() {
        //查询参数
        var params = {
            loginName: $scope.loginName,
            name: $scope.name,
            mobile: $scope.mobile,
            start: ($scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        StaffService.query(params,function (data) {
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
        $scope.name = null;
        $scope.loginName = null;
        $scope.mobile = null;
    };
    //添加员工
    $scope.addStaff = function (size) {
        $scope.user = {};
        $scope.showCreateForm(size);
    };
    //添加员工弹出窗口
    $scope.showCreateForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/system/staff-add.html',
            controller: 'system.AddStaffCtrl',
            backdrop: "static",
            size: size
        });
        uibModalInstance.result.then(function () {
            $scope.reset();
            $scope.query();
            alertService.addSuccessAlert('添加用户成功！');
        });
    };
    //修改员工弹出窗口
    $scope.showEditForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/system/staff-edit.html',
            controller: 'system.EditStaffCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return $scope.user;
                }
            },
            size:size
        });
        uibModalInstance.result.then(function () {
            $scope.reset();
            $scope.query();
            alertService.addSuccessAlert('修改用户成功！');
        });
    };
    //删除员工绑定事件
    $scope.onDeleteStaffClick = function (id) {
        $confirm({title: '确认', text: '确定删除用户吗？',ok:'确认',cancel: '取消'},{size: 'sm'}).then(function () {
            StaffService.delete({id: id}, function () {
                $scope.reset();
                $scope.query();
                alertService.addSuccessAlert('删除用户成功!');
            });
        });
    };
    //修改员工
    $scope.onEditStaffClick = function (id) {
        $scope.user =  StaffService.queryStaffById({id:id},function() {
            $scope.showEditForm('md');
        });

    };
    //禁用员工
    $scope.deactiveStaff = function (id) {
        $confirm({title: '提示', text: '确定禁用用户吗？',ok:'确认',cancel: '取消'},{size: 'sm'}).then(function () {
            StaffService.forbidStaff({id: id}, function () {
                $scope.reset();
                $scope.query();
                alertService.addSuccessAlert('禁用用户成功!');
            });
        });
    };
    //启用员工
    $scope.activeStaff = function (id) {
        $confirm({title: '提示', text: '确定启用用户吗？',ok:'确认',cancel: '取消'},{size: 'sm'}).then(function () {
            StaffService.startStaff({id: id}, function () {
                $scope.reset();
                $scope.query();
                alertService.addSuccessAlert('启用用户成功！');
            });
        });
    };
    $scope.resetPwd = function (id) {
        $confirm({title: '确认?', text: '确定将密码重置为设置的手机号码吗',ok:'确认',cancel: '取消'},{size: 'sm'}).then(function () {
            $scope.user =  StaffService.resetPwd({id:id},function() {
                $scope.reset();
                $scope.query();
                alertService.addSuccessAlert('密码重置成功！');
            });
        });
    };

}]);
//添加用户控制器
App.controller('system.AddStaffCtrl',  ['$scope','$uibModalInstance','StaffService','alertService',function ($scope,$uibModalInstance,StaffService,alertService) {

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    $scope.submit = function () {
        if(!$scope.user){
            alertService.addErrorAlert('用户信息不能为空！');
            return;
        }
        if(!$scope.user.loginName){
            alertService.addErrorAlert('用户账号不能为空！');
            return;
        }
        if(!$scope.user.name){
            alertService.addErrorAlert('姓名不能为空！');
            return;
        }
        if(!$scope.user.mobile){
            alertService.addErrorAlert('手机号不能为空！');
            return;
        }
        if(!myreg.test($scope.user.mobile)) {
            alertService.addErrorAlert('请输入有效的手机号码！');
            return;
        }
        if(!$scope.user.position){
            alertService.addErrorAlert('职位不能为空！');
            return;
        }
        StaffService.save($scope.user, function () {
            $uibModalInstance.close();
        });
    };
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
//修改用户控制器
App.controller('system.EditStaffCtrl',  ['$scope','$uibModalInstance','items','alertService',function ($scope,$uibModalInstance,items,alertService) {

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    //设置初始值
    $scope.user = items;
   //修改员工
    $scope.submit = function () {
        if(!$scope.user.name){
            alertService.addErrorAlert('姓名不能为空！');
            return;
        }
        if(!$scope.user.mobile){
            alertService.addErrorAlert('手机号不能为空！');
            return;
        }
        if(!myreg.test($scope.user.mobile)) {
            alertService.addErrorAlert('请输入有效的手机号码！');
            return;
        }
        if(!$scope.user.position){
            alertService.addErrorAlert('职位不能为空！');
            return;
        }
        $scope.user.$update(function () {
            //关闭窗口
            $uibModalInstance.close();
        });
    };
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
App.controller('system.ChangeStaffPwdCtrl',  ['$scope','Staff','UI','alertService','$uibModalInstance','$location','StaffService', function ($scope,Staff,UI,alertService,$uibModalInstance, $location,StaffService) {
    $scope.submit = function () {
        if($scope.myForm.$valid){
            var parms = {
                orginPassword : $scope.orginpassword,
                newPassword : $scope.password
            };
            StaffService.changePwd(parms,function () {
                alertService.addSuccessAlert('密码修改成功！');
                $scope.reset();
            });
        }
    };


    $scope.reset = function () {
        $scope.password = null;
        $scope.passwordagain = null;
        $scope.orginpassword = null;
        $location.path('/login');
    };

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
