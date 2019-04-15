'use strict';
App.controller('AuthDetailCtrl', ['$scope','data','MemberService','$confirm','$uibModalInstance','alertService',
    function ($scope,data, MemberService,$confirm,$uibModalInstance,alertService) {

    // 接收参数
    $scope.memberId = data;

    $scope.auditPass = function (memberId) {
        if($scope.auditNote){
            alertService.addErrorAlert('审核通过不需要填写原因!');
            return;
        } else {
            $confirm({title: '提示', text: '确认通过该商家认证申请吗?', ok: '确定', cancel: '取消'},{size: 'sm'}).then(function () {
                MemberService.auditAuth({id: memberId,status:1}, function () {
                    $uibModalInstance.close();
                    alertService.addSuccessAlert('商家认证申请通过!');
                });
            });
        }
    };

    $scope.auditNotPass = function (memberId) {

        if($scope.auditNote){
            $confirm({title: '提示', text: '确认不通过该商家认证申请吗?', ok: '确定', cancel: '取消'},{size: 'sm'}).then(function () {
                MemberService.auditAuth({id: memberId,status:-1,auditNote:$scope.auditNote}, function () {
                    $uibModalInstance.close();
                    alertService.addSuccessAlert('商家认证申请不通过!');
                });
            });
        } else {
            alertService.addErrorAlert('请先输入审核不通过原因!');
            return;
        }
    };

    $scope.init = function () {
        MemberService.memberAuthDetail({id: $scope.memberId}, function (data) {
            $scope.member = data;
        });
    };

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);
