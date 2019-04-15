'use strict';
App.controller('RedpacketCountDownCtrl', ['$scope', '$log','RedpacketService','$filter','$uibModal','alertService','$confirm',function ($scope, $log, RedpacketService,$filter,$uibModal,alertService,$confirm) {

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
    
    $scope.redpacket = {};

    //分页
    $scope.getPage = function () {

        //校验日期
        if ($scope.startDate > $scope.endDate) {
             alertService.addErrorAlert('结束时间必须大于起始时间！');
             return;
        }

        //查询参数
        var params = {
        	status: $scope.status,
        	startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };

        RedpacketService.redpacketCountDownList(params, function (data) {
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
    	$scope.status = null;
        $scope.startDate = null;
        $scope.endDate = null;
    };
    
    $scope.addRedpacketCountDown = function (size) {
        $scope.redpacket = {};
        $scope.showCreateForm(size);
    };

    $scope.showCreateForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/quizzes/redpacket-add.html',
            controller: 'system.AddRedpacketCtrl',
            backdrop: "static",
            size: size
        });
        uibModalInstance.result.then(function () {
            $scope.reset();
            $scope.query();
            alertService.addSuccessAlert('成功添加秒抢红包活动！');
        });
    };

    $scope.showEditForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/quizzes/redpacket-edit.html',
            controller: 'system.EditRedpacketCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return $scope.redpacket;
                }
            },
            size:size
        });
        uibModalInstance.result.then(function () {
            $scope.reset();
            $scope.query();
            alertService.addSuccessAlert('成功修改秒抢红包活动！');
        });
    };

    $scope.editRedpacketCountDown = function (id) {
        $scope.redpacket =  RedpacketService.queryRedpacketCountDownById({id:id},function() {
            $scope.showEditForm('md');
        });

    };
    
    $scope.setStartOrClose = function () {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/quizzes/set-redpacket-show.html',
            controller: 'system.SetRedpacketShowCtrl',
            backdrop: "static",
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            alertService.addSuccessAlert('成功设置秒抢红包活动！');
        });
    };
    
    
    $scope.upShelf = function (id) {
    	
    	$confirm({title: '提示', text: '确认是否上架该秒抢红包活动?',ok:'确认',cancel: '取消'},{size: 'sm'}).then(function () {
            RedpacketService.changeStatus({id: id,status:1}, function () {
                $scope.query();
                alertService.addSuccessAlert('成功上架秒抢红包活动');
            });
        });
    };

    $scope.offShelf = function (id) {
    	
    	$confirm({title: '提示', text: '确认是否下架该秒抢红包活动?',ok:'确认',cancel: '取消'},{size: 'sm'}).then(function () {
            RedpacketService.changeStatus({id: id,status:-1}, function () {
                $scope.query();
                alertService.addSuccessAlert('成功下架秒抢红包活动');
            });
        });
    
    };

}]);


App.controller('system.AddRedpacketCtrl',  ['$scope','$uibModalInstance','RedpacketService','alertService','$filter','VdmUtil',function ($scope,$uibModalInstance,RedpacketService,alertService,$filter,VdmUtil) {

    $scope.submit = function () {
        
        if(!$scope.redpacket){
            alertService.addErrorAlert('秒抢红包活动信息不能为空！');
            return;
        }
        
        if(!$scope.level){
            alertService.addErrorAlert('请选择参赛活动档位！');
            return;
        }
        
        if(!$scope.redpacket.startTime){
            alertService.addErrorAlert('请选择活动开始时间！');
            return;
        }
        
        if(!$scope.redpacket.pertime){
            alertService.addErrorAlert('请填写每题消耗时间！');
            return;
        }
        
        if(!VdmUtil.validateInteger($scope.redpacket.pertime)){
            alertService.addErrorAlert('每题消耗时间必须为整数！');
            return;
        }
        
        if(!$scope.redpacket.balance){
            alertService.addErrorAlert('请填写活动总奖金！');
            return;
        }
        
        if(!VdmUtil.validatePrice($scope.redpacket.balance)){
            alertService.addErrorAlert('请填写正确格式的活动总奖金！');
            return;
        }
        
        if($scope.redpacket.balance <= 100){
            alertService.addErrorAlert('活动总奖金必须大于100元！');
            return;
        }
        
        if(!$scope.redpacket.couponNum){
            alertService.addErrorAlert('请填写参赛活动消耗券张数！');
            return;
        }
        
        if(!VdmUtil.validateInteger($scope.redpacket.couponNum)){
            alertService.addErrorAlert('参赛活动消耗券张数必须为整数！');
            return;
        }
        
        if(!$scope.redpacket.note){
            $scope.redpacket.note = "";
        }
        
	    var bTime = new Date($scope.redpacket.startTime).getTime();
        
        RedpacketService.saveCountDown({startTime:bTime,pertime:$scope.redpacket.pertime,balance:$scope.redpacket.balance,
        couponNum:$scope.redpacket.couponNum,level:$scope.level,groupId:1,note:$scope.redpacket.note}, function () {
            $uibModalInstance.close();
        });
    };
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);


App.controller('system.EditRedpacketCtrl',  ['$scope','$uibModalInstance','items','alertService','RedpacketService','$filter','VdmUtil',function ($scope,$uibModalInstance,items,alertService,RedpacketService,$filter,VdmUtil) {
    
    //设置初始值
    $scope.redpacket = items;
    
    $scope.redpacket.startTime = $filter('date')(new Date($scope.redpacket.startTime), 'yyyy-MM-dd HH:mm');
    $scope.redpacket.endTime = $filter('date')(new Date($scope.redpacket.endTime), 'yyyy-MM-dd HH:mm');
    
    
    $scope.redLevels = [
                 { id: 200, level: 200},
                 { id: 500, level: 500},
                 { id: 800, level: 800}
             ];
    $scope.levelId = $scope.redpacket.level;
   //修改秒抢活动
    $scope.submit = function () {
        if(!$scope.redpacket){
            alertService.addErrorAlert('秒抢红包活动信息不能为空！');
            return;
        }
        
        if(!$scope.levelId){
            alertService.addErrorAlert('请选择参赛活动档位！');
            return;
        }
        
        if(!$scope.redpacket.startTime){
            alertService.addErrorAlert('请选择活动开始时间！');
            return;
        }
        
        if(!$scope.redpacket.pertime){
            alertService.addErrorAlert('请填写每题消耗时间！');
            return;
        }
        
        if(!VdmUtil.validateInteger($scope.redpacket.pertime)){
            alertService.addErrorAlert('每题消耗时间必须为整数！');
            return;
        }
        
        if(!$scope.redpacket.balance){
            alertService.addErrorAlert('请填写活动总奖金！');
            return;
        }
        
        if(!VdmUtil.validatePrice($scope.redpacket.balance)){
            alertService.addErrorAlert('请填写正确格式的活动总奖金！');
            return;
        }
		
		if($scope.redpacket.balance <= 100){
            alertService.addErrorAlert('活动总奖金必须大于100元！');
            return;
        }
        
        if(!$scope.redpacket.couponNum){
            alertService.addErrorAlert('请填写参赛活动消耗券张数！');
            return;
        }
        if(!VdmUtil.validateInteger($scope.redpacket.couponNum)){
            alertService.addErrorAlert('参赛活动消耗券张数必须为整数！');
            return;
        }
        
        if(!$scope.redpacket.note){
            $scope.redpacket.note = "";
        }
        
        var bTime = new Date($scope.redpacket.startTime).getTime();
        
        RedpacketService.saveCountDown({id:$scope.redpacket.id,startTime:bTime,pertime:$scope.redpacket.pertime,balance:$scope.redpacket.balance,
        couponNum:$scope.redpacket.couponNum,level:$scope.levelId,groupId:1,note:$scope.redpacket.note}, function () {
            $uibModalInstance.close();
        });
    };
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

App.controller('system.SetRedpacketShowCtrl',  ['$scope','$uibModalInstance','alertService','RedpacketService',function ($scope,$uibModalInstance,alertService,RedpacketService) {
	
	$scope.defultConfigValue = function () {
        RedpacketService.getConfigValueByName({name:'sign_is_show_redpacket_count_down'},function(data) {
        	if(data.obj.value === '1'){
        		$("#radio1").attr("checked","checked");
        	} else if(data.obj.value === '0'){
        		$("#radio0").attr("checked","checked");
        	}
        });
    };

    $scope.submit = function () {
    	var value =  $('.radio input[name="setRedShow"]:checked ').val();
		RedpacketService.updateConfigValueByName({name:'sign_is_show_redpacket_count_down',value:value},function(data) {
        	alertService.addSuccessAlert('秒抢红包活动已成功设置');
        	$uibModalInstance.close();
        });
        
    };
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
