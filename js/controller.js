var ModifiQAppController = angular.module('ModifiQApp.controllers', []);

ModifiQAppController.controller('indexController', function($scope, $location, webRequest, alerta, localService, sessionService, $timeout, $rootScope, $interval){
    $scope.logout = function(){
        alerta.show('warning', 'Atenção', 'Deseja realmente efetuar o logout?', true, function(){
            sessionService.destroy("usuario");
            localService.destroy("usuario");
            $location.path("/");
        });
    }
    $rootScope.collapse = function(){
    	var vw = $(window)[0].innerWidth;
    	if (vw > 991) {
            $(".pcoded-main-container").toggleClass("pcoded-main-container-collapsed");
    		$("nav").toggleClass("navbar-collapsed");
        }
    }
    $rootScope.usuario = {};
     $rootScope.$on("login",function(){
        $rootScope.usuario = sessionService.get("usuario");
        $rootScope.loginToken = $scope.usuario.token;
    });
     
    var localData = localService.get("usuario");
    var sessionData = sessionService.get("usuario");
    if(localData || sessionData){
        if(localData && !sessionData){
            sessionService.set("usuario", localData);
        }
        $rootScope.$broadcast("login");
        if($location.url() == ""){
            $location.path("/dashboard");
        }
    }
    $rootScope.acessarAula = function(){
        var usuario = sessionService.get("usuario");
        var url = ModifiqAulaUrl + '/professor?token='+usuario.token;
        Object.assign(document.createElement('a'), {
            target: '_blank',
            href: url,
        }).click();
    }
});

ModifiQAppController.controller('menuController', function($scope, $location, webRequest, localService, sessionService, $timeout, $rootScope, $interval){
    $rootScope.usuario = {};
    $scope.$watch("login",function(){
        $rootScope.usuario = sessionService.get("usuario");
    });
});