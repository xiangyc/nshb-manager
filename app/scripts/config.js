'use strict';
var Config = {
    name: 'demoManagerApp',
    urlRoot:'/api/v2',
    debug: true
};

// 加载json 数据
window.onload = function () {
    // Files to load initially.
    var files = [
        {property: 'routes', file: 'routes.json'}
    ];
    var loaded = 0;
    // Request object
    var Request = function (item, file) {
        var loader = new XMLHttpRequest();
        // onload event for when the file is loaded
        loader.onload = function () {
            loaded++;
            if (item === 'routes') {
                Config[item] = JSON.parse(this.responseText);
            }
            // We've loaded all dependencies, lets bootstrap the application.
            if (loaded === files.length) {
                // Declare error if we are missing a name.
                if (angular.isUndefined(Config.name)) {
                    console.error('Config.name is undefined, please update this property.');
                }
                App.config = Config;

                // 启动bootstrap app ， 注意，这里启动在html页面是不能加ng-app, 否则会先按照html 中的先启动
                angular.bootstrap(document, [Config.name]);
            }
        };

        loader.open('get', file, true);
        loader.send();
    };
    for (var index in files) {
        new Request(files[index].property, files[index].file);
    }
};

App.config(function($logProvider,$stateProvider,$urlRouterProvider,$httpProvider ){
    if (angular.isUndefined(Config.debug) || Config.debug !== false) {
        Config.debug = true;
    }
    if (Config.debug) {
        $logProvider.debugEnabled(true);
    } else {
        $logProvider.debugEnabled(false);
    }

    // 权限判断
    $httpProvider.interceptors.push(function($q, $location, $rootScope) {
        return {
            'responseError': function(response) {
                console.log(response);
                if (response.status == 401) {
                    $location.path('/login');
                } else if (response.status == 403) {
                    $rootScope.$emit('myError','没有权限');
                } else if (response.status == 500) {
                    if(response.data.message){
                        $rootScope.$emit('myError', response.data.message);
                    }else{
                        $rootScope.$emit('myError', "未知错误");
                    }
                }else if(response.status == 503){
                    //$rootScope.$emit('myError', "服务器正在维护或者已暂停");
                }
                return $q.reject(response);
            }
        };
    });

    // 加载路由
    angular.forEach(Config.routes, function (state) {
        $stateProvider.state(state);
        $urlRouterProvider.otherwise('/index');
    });
});


App.run(['$http','$rootScope','UI', function($http, $rootScope, UI) {

    $http.defaults.headers.post = {"Content-Type": "application/x-www-form-urlencoded"};
    $http.defaults.headers.put = {"Content-Type": "application/x-www-form-urlencoded"};
    $http.defaults.transformRequest = function(data){
        var str = [];
        if (data) {
            if (!angular.isObject(data)) {
                return data;
            }
            if (data.toJSON) {
                data = data.toJSON();
            }
            for (var p in data) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(data[p]));
            }
        }
        str = str.join("&");
        return str;
    };

    $rootScope.$on('$routeChangeStart', function(evt, next) {
        var url = next.originalPath;
        if (url.indexOf('/login') === 0) {
            $rootScope.toLogin = true;
        } else {
            $rootScope.toLogin = false;
        }
    });

    $rootScope.$on('myError', function(event, args){
        UI.alert({title:'提示', message: args});
    });

    $rootScope.alerts = [];

    $rootScope.addAlert = function(msg) {
        $rootScope.alerts.push({msg: msg});
    };

    $rootScope.closeAlert = function(index) {
        $rootScope.alerts.splice(index, 1);
    };

}]);
