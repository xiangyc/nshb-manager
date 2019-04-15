'use strict';
App.controller('MemberListCtrl', ['$scope', '$log','MemberService','VdmUtil','UI','$filter','$rootScope','$uibModal','alertService',function ($scope, $log, MemberService,VdmUtil,UI,$filter,$rootScope,$uibModal,alertService) {

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

    //分页
    $scope.getPage = function () {
        //校验日期
        if ($scope.startDate > $scope.endDate) {
             alertService.addErrorAlert('结束时间必须大于起始时间！');
             return;
        }
        //查询参数
        var params = {
            mobile: $scope.mobile,
            type: $scope.type,
            status: $scope.status,
            startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };

        MemberService.memberList(params, function (data) {
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
        $scope.mobile = null;
        $scope.type = null;
        $scope.status = null;
        $scope.startDate = null;
        $scope.endDate = null;
    };

    $rootScope.showMemberDetail = function (memberId,type) {
        if(type === 0){
            var uibModalInstance1 = $uibModal.open({
                animation: true,
                templateUrl: 'views/member/member-detail.html',
                controller: 'MemberDetailCtrl',
                backdrop: "static",
                resolve: {
                    data: function () {
                        return memberId;
                    }
                },
                size: 'md'
            });
            uibModalInstance1.result.then(function () {
                $scope.getPage();
            });
        } else {
            var uibModalInstance2 = $uibModal.open({
                animation: true,
                templateUrl: 'views/member/member-auth-detail.html',
                controller: 'MemberAuthDetailCtrl',
                backdrop: "static",
                resolve: {
                    data: function () {
                        return memberId;
                    }
                },
                size: 'max'
            });
            uibModalInstance2.result.then(function () {
                $scope.getPage();
            });
        }

    };

    $rootScope.freeAuth = function (memberId,type,status,authStatus) {
        if(status === 0){
            alertService.addErrorAlert('请先启用该会员再进行免认证！');
            return;
        }
        if(authStatus === 0 || authStatus === 1 || authStatus === 2){
            return;
        }

	    var uibModalInstance = $uibModal.open({
	        animation: true,
	        templateUrl: 'views/member/member-free-auth.html',
	        controller: 'MemberFreeAuthCtrl',
	        backdrop: "static",
	        resolve: {
	            data: function () {
	                return memberId;
	            }
	        },
	        size: 'md'
	    });
	    uibModalInstance.result.then(function () {
	        $scope.getPage();
	    });

    };

}]);

App.controller('MemberFreeAuthCtrl', ['$scope','data','MemberService','$confirm','$uibModalInstance','alertService','$http', 
    function ($scope,data, MemberService,$confirm,$uibModalInstance,alertService,$http) {

    // 接收参数
    $scope.memberId = data;
    
    $scope.onSaveEdit = function () {
    	var formData = new FormData();
      	var file = document.getElementById("changeImg").files[0];
      	
    	if(!$scope.memberAuth){
            alertService.addErrorAlert('商家信息不能为空！');
            return;
        }
        if(!$scope.memberAuth.businessName){
            alertService.addErrorAlert('商家名称不能为空！');
            return;
        }
        if(!$scope.memberAuth.businessAddress){
            alertService.addErrorAlert('商家地址不能为空！');
            return;
        }
        
        if(!file){
	        alertService.addErrorAlert('logo图片不能为空！');
	        return;
      	}

      	var id = $scope.memberId;
      	var businessName = $scope.memberAuth.businessName;
      	var businessAddress = $scope.memberAuth.businessAddress;
      	
      	formData.append("file", file);
      	formData.append("id", id);
      	formData.append("businessName", businessName);
      	formData.append("businessAddress", businessAddress);

      	$http.post(App.config.urlRoot + '/member/freeAuth',formData, {
        	transformRequest: angular.identity,
        	headers: {'Content-Type': undefined}
        })
        .success(function (ret) {
        	if (ret && ret.id){
				alertService.addSuccessAlert('该会员成功免认证为商家!');
			} else {
				alertService.addErrorAlert(ret.message);
			}
            //关闭窗口
            $uibModalInstance.close();
        });
          
    };

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);
