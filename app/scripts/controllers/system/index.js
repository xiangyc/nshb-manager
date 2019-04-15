'use strict';
App.controller('IndexCtrl', ['$scope','$location','Login','PlatformService', function($scope, $location,Login,PlatformService) {
    Login.getStaff(function(data) {
        if(data.id){
            $scope.username = data.loginName;
            $scope.userId = data.id;
        } else {
            $location.path('/login');
        }
    });

    $scope.init = function () {
        PlatformService.findPlatformStatistics(function (data) {
            $scope.platform = data;
        });
    };


}]);
