'use strict';
App.controller('MemberDetailCtrl', ['$scope','data','MemberService','$confirm','$uibModalInstance','alertService',
    function ($scope,data, MemberService,$confirm,$uibModalInstance,alertService) {

    // 接收参数
    $scope.memberId = data;

    $scope.enable = function (memberId,status) {
        if (status == 1 ) {
            return;
        }
        $confirm({title: '提示', text: '确认启用该用户吗?', ok: '确定', cancel: '取消'},{size: 'sm'}).then(function () {
            MemberService.enableMember ({id: memberId}, function(){
                $uibModalInstance.close();
                alertService.addSuccessAlert('启用会员成功!');
            });
        });
    };

    $scope.forbid = function (memberId,status) {
        if (status === 0 ) {
            return;
        }
        $confirm({title: '提示', text: '确认禁用该用户吗?', ok: '确定', cancel: '取消'},{size: 'sm'}).then(function () {
            MemberService.forbidMember({id: memberId}, function () {
                $uibModalInstance.close();
                alertService.addSuccessAlert('禁用会员成功!');
            });
        });
    };

    $scope.init = function () {
        MemberService.memberDetail({id: $scope.memberId}, function (data) {
            $scope.member = data;
        });
    };

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);
