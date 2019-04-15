/**
 * Created by xiangyc on 2017/6/11.
 */
'use strict';

/**
 *  将数据进行转换, 如后台数据为状态status 为 1：开启， 2： 关闭, ,使用方法如：{{ status | decode:1:"开启":2:"关闭":"<默认值,可选>") }}
 */
App.filter('decode', function() {

    return function() {
        var args,input,arg1, arg2;
            args = Array.prototype.slice.call(arguments);
            input = args.shift();
        while ((arg1 = args.shift()) !== null) {
            arg2 = args.shift();
            if (arg2 === null) {
                return arg1;
            } else {
               if (arg1 == input) {
                   return arg2;
               }
            }
        }
        return input;
    };
});

/**
 * 如果为null或者"" 时， 转换为默认值
 */
App.filter('nvl', function() {
    return function(input, defaultValue) {
        if (!input || input === "") {
            return defaultValue;
        }
        return input;
    };
});

App.filter('nvl2', function() {
    return function(input, value1, value2) {
        if (!input || input === "") {
            return value2;
        }
        return value1;
    };
});

/**
 * 截取字符串
 */
 App.filter("limit", function() {
     return function(input,limit) {
         if(null===input){
             return input;
         }
         if(input.length<limit){
             return input;
         }
         return input.substr(0,limit)+"....";
     };

 });

/**
 * 绑定类似文章内容数据时自动转义html标签
 */
App.filter('trustHtml', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    };
});

/**
 * 数字转换为百分比
 */
App.filter('percent', function($filter) {
    return function(input) {
        var number = input * 100;
        return  $filter('number')(number, 2) + '%' ;
    };
});


/**
 * 数字加百分号后缀
 */
App.filter('percentSuffix', function($filter) {
    return function(input) {
        return  $filter('number')(input, 2) + '%' ;
    };
});

/**
 * 我们返回的内容中包含一系列的html标记。表现出来的结果就如我们文章开头所说的那样。这时候我们必须告诉它安全绑定。
 * 它可以通过使用$ sce.trustAsHtml()。该方法将值转换为特权所接受并能安全地使用“ng-bind-html”。所以，我们必须在我们的控制器中引入$sce服务
 */
App.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);
