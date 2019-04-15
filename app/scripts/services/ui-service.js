'use strict';
App.controller('ui.alertCtrl', ['$scope', function($scope) {
    $scope.close = function() {
        $scope.$close();
    };
}]);

App.service('UI', ['$uibModal', function($uibModal) {

    return {
        alert: function(obj) {
               $uibModal.open({
                animation: true,
                controller: 'ui.alertCtrl',
                template:
                '<div class="" >                                                                                                        '+
                '    <div class="modal-header">                                                                                                        '+
                '        <h4 class="modal-title" id="myModalLabel">                                                                         '+obj.title+
                '        </h4>                                                                           '+
                '    </div>                                                                                                                            '+
                '    <div class="modal-body" >                                                                                                         '+obj.message+
                '    </div>                                                                                                                            '+
                '    <div class="modal-footer">                                                                                                        '+
                '        <button class="btn btn-primary btn-sm" type="submit" ng-click="close()">确定</button>                                         '+
                '    </div>                                                                                                                            '+
                '</div>                                                                                                                                ',
                size: 'sm'
            });
        },
        confirm: function(obj) {
            $uibModal.open({
                animation: true,
                controller: 'ui.alertCtrl',
                template:
                '<div class="container-fluid" >                                                                                                        '+
                '    <div class="modal-header">                                                                                                        '+
                '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>  '+
                '        <h4 class="modal-title" id="myModalLabel">                                                                         '+obj.title+
                '        </h4>                                                                           '+
                '    </div>                                                                                                                            '+
                '    <div class="modal-body" >                                                                                                         '+obj.message+
                '    </div>                                                                                                                            '+
                '    <div class="modal-footer">                                                                                                        '+
                '        <button class="btn btn-primary btn-sm" type="submit" ng-click="close()">确定</button>                                         '+
                '        <button class="btn btn-default btn-sm" type="submit" ng-click="close()">取消</button>                                         '+
                '    </div>                                                                                                                            '+
                '</div>                                                                                                                                ',
                size: 'sm'
            });
        }
    };
}]);
