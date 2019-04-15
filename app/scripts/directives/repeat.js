/**
 * Created by andychen on 2016/5/20
 */
'use strict';

App.directive('repeatFinish',function($compile){
    return {
        link: function(scope){
            if(scope.$last){
                //向父控制器传递事件
                scope.$emit('repeatFinishEvent');

                $compile("<check-permission />")(scope);
            }
        }
    };
});

App.directive('repeatSelect',function($compile){
    return {
        link: function(scope){
            if(scope.$last){
                //向父控制器传递事件
                scope.$emit('repeatFinishEvent');

                $compile("<check-user />")(scope);
            }
        }
    };
});


App.directive('errorSrc', function () {
        var errorSrc = {
		        link: function postLink(scope, element, attrs) {
				element.bind('error', function() {
				angular.element(this).attr("src", attrs.errorSrc); 
				}); 
				attrs.$observe('ngSrc', function(value) { //ng-src值为null,加载err-src
	              if (!value && attrs.errorSrc) {
	                attrs.$set('src', attrs.errorSrc);
	              }
	            });
			} 
		} 
	return errorSrc;
})