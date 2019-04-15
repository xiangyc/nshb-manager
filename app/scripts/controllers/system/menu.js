'use strict';
App.controller('MenuCtrl', ['$scope', 'Permission', function($scope, Permission) {

    //isCollapsed    true: 是折叠, false ：展开
    $scope.currentMenu = null;
    $scope.menuChanged = function(menu) {
         $scope.menus.forEach(function (val,index,arr) {
             if (arr[index] != menu){
                 arr[index].isCollapsed = false;
             }
         });

         if ($scope.currentMenu == menu){
             $scope.currentMenu.isCollapsed = !$scope.currentMenu.isCollapsed;
         }else {
             $scope.currentMenu = menu;
             $scope.currentMenu.isCollapsed = true;
         }
     };


     $scope.menuChildrenChanged = function(menuId) {
           // 刷新时打开当前地址栏中菜单的父菜单
           $scope.menus.forEach(function (pval , pindex , parr) {
               parr[pindex].children.forEach(function (val , index , arr) {
                   if (arr[index].id == menuId){
                       $('#menu'+menuId).addClass("active").siblings().removeClass("active");
                   }

               });
           });
      };

    //加载菜单、默认折叠
    $scope.getmenu = function () {
        Permission.menu(function (data) {
            $scope.menus = data ;
            $scope.currentMenu = $scope.menus[0];
            //$scope.currentMenu.isCollapsed = true;
        });
    };
    $scope.getmenu();

}]);
