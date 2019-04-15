'use strict';
App.controller('LoginCtrl', ['$scope', '$rootScope', 'Login', function($scope, $rootScope, Login){

    $scope.addDefultCssAndCaptcha = function () {

        //初始化图形验证码
        $scope.changeCaptchaUrl();

        // 默认密码，代码可删除
        //$scope.user.username = "admin";
        //$scope.user.password = "jszadmin";
    };

    $scope.user = {};

    $scope.changeCaptchaUrl = function() {
        $scope.captchaUrl = App.config.urlRoot +  '/staff/captcha?_'+ new Date().getTime();
    };

    $scope.login = function($event) {
        if ($event && $event.type == 'keypress' && $event.keyCode != 13) {
            return false;
        }
        $scope.errorMessage = '';

        if (!$scope.user.username) {
            $scope.errorMessage = '用户名必须填写';
            return;
        }
        if (!$scope.user.password) {
            $scope.errorMessage = '密码必须填写';
            return;
        }
        if (!$scope.user.captcha) {
            $scope.errorMessage = '验证码必须填写';
            return;
        }
        Login.login($scope.user, function(data) {
			
			if (data.obj && data.obj.id){
				window.location="/";
			} else {
				$scope.errorMessage = data.message;
			}

        }, function(data) {
            $scope.errorMessage = data.data.error;
            if ( $scope.errorMessage == '验证码过期' || $scope.errorMessage == '验证码已经失效') {
                $scope.changeCaptchaUrl();
            }
        });
    };
}]);

App.controller('LogoutCtrl', ['$scope', 'Login', '$location', '$uibModal','alertService',function($scope, Login, $location,$uibModal,alertService) {

    Login.getStaff(function(data) {
        if(data.id){
            $scope.username = data.loginName;
            $scope.userId = data.id;
        } else {
            $location.path('/login');
        }
    });

    $scope.logout = function(userId) {
        if (userId) {
            // 退出
            Login.logout(function() {
                $location.path('/login');
            }, function(data) {
                console.log(data.data.error);
            });
        }
    };

    $scope.changePwd = function() {
        $scope.pwd = {};
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/system/change-password.html',
            controller: 'system.changePasswordCtrl',
            backdrop: "static",
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            alertService.addSuccessAlert('修改密码成功！');
        });
        
    };

}]);

App.controller('system.changePasswordCtrl',  ['$scope','$uibModalInstance','StaffService','alertService',function ($scope,$uibModalInstance,StaffService,alertService) {
    $scope.submit = function () {

        if(!$scope.pwd){
            alertService.addErrorAlert('请填写密码信息！');
            return;
        }
        if(!$scope.pwd.orginPassword){
            alertService.addErrorAlert('原密码不能为空且最少不能小于6位！');
            return;
        }
        if(!$scope.pwd.newPassword){
            alertService.addErrorAlert('新密码不能为空且最少不能小于6位！');
            return;
        }
        StaffService.changePwd($scope.pwd, function () {
            $uibModalInstance.close();
        });
    };
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);