/**
 * Created by xiangyc on 2017/7/9.
 * 兴趣标签管理
 */
'use strict';
App.controller('InterestListCtrl', ['$scope', 'InterestService', '$log','$uibModal','UI','alertService','$confirm',function ($scope, InterestService, $log,$uibModal,UI,alertService,$confirm) {

    $scope.interest = {};
    var maxCount = 0;

    //查询列表
    $scope.getPage = function() {
        InterestService.query(function (data) {
            $scope.data = data;
            if (data){
                maxCount = data.length;
            }
        });
    };

    // 刷新
    $scope.query  = function () {
        $scope.getPage();
    };

    //添加兴趣标签
    $scope.addInterest = function (size) {
        if (maxCount >= 12){
            alertService.addErrorAlert('兴趣标签最多为12项！');
            return;
        }
       $scope.interest = {};
       $scope.showCreateForm(size);
    };

    //创建窗口
    $scope.showCreateForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/member/interest-add.html',
            controller: 'system.EditInterestCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return $scope.interest;
                }
            },
            size: size
        });
        uibModalInstance.result.then(function () {
            if($scope.interest.id){
                //修改
                InterestService.update({ id: $scope.interest.id, name: $scope.interest.name, note: $scope.interest.note  },function() {
                    $scope.query();
                    alertService.addSuccessAlert('修改兴趣标签成功！');
                });
            }else{
                //添加
                InterestService.update({ name: $scope.interest.name, note: $scope.interest.note  },function() {
                    $scope.query();
                    alertService.addSuccessAlert('添加兴趣标签成功！');
                });
            }
        });
    };

    //删除兴趣标签
    $scope.onDeleteInterestClick = function (id) {
        $confirm({title: '确认', text: '确定删除该兴趣标签吗？',ok:'确认',cancel: '取消'},{size: 'sm'}).then(function () {
            InterestService.delete({id: id}, function () {
                $scope.query();
                alertService.addSuccessAlert('删除兴趣标签成功!');
            });
        });
    };
    //修改时根据id查询兴趣标签
    $scope.onEditInterestClick = function (id) {
        $scope.interest =  InterestService.queryInterestById({id:id},function() {
            $scope.showCreateForm('md');
        });

    };

}]);

//新建/编辑兴趣标签
App.controller('system.EditInterestCtrl',  ['$scope','$uibModalInstance','items','alertService',function ($scope,$uibModalInstance,items,alertService) {
    //设置初始值
    $scope.interest = items;
    $scope.onSaveEdit = function () {
        if(!$scope.interest){
            alertService.addErrorAlert('标签信息不能为空！');
            return;
        }
        if(!$scope.interest.name){
            alertService.addErrorAlert('标签名称不能为空！');
            return;
        }
        if(!$scope.interest.note){
            $scope.interest.note = "";
        }
        $uibModalInstance.close();
    };
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
