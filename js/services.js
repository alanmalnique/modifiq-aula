var ModifiQAppServices = angular.module('ModifiQApp.services', []);

ModifiQAppServices.service('webRequest', function(ajaxRequest){

	this.get = function(action, $data, successCallback, errorCallback){
		ajaxRequest.new("GET", ModifiQApiUrl+"/api/"+action, $data, successCallback, errorCallback);
	}

	this.post = function(action, $data, successCallback, errorCallback){
		ajaxRequest.new("POST", ModifiQApiUrl+"/api/"+action, $data, successCallback, errorCallback);
	}

	this.put = function(action, $data, successCallback, errorCallback){
		ajaxRequest.new("PUT", ModifiQApiUrl+"/api/"+action, $data, successCallback, errorCallback);
	}

	this.delete = function(action, $data, successCallback, errorCallback){
		ajaxRequest.new("DELETE", ModifiQApiUrl+"/api/"+action, $data, successCallback, errorCallback);
	}

	this.upload = function(action, $data, successCallback, errorCallback){
		ajaxRequest.new("UPLOAD", ModifiQApiUrl+"/api/"+action, $data, successCallback, errorCallback);
	}
});

ModifiQAppServices.service('ajaxRequest', function($http, $rootScope, alerta, $location, loading){
	this.new = function($method, $url, $data, $successCallback, $errorCallback){
		var headers = {};
		if($rootScope.loginToken != undefined){
			if($method == "UPLOAD"){
				headers = {
		            'Content-Type': undefined,
					'Authorization': 'Bearer ' + $rootScope.loginToken,
					'X-Api-Version': 'v'+ModifiQApiVersion
		        };
			}else{
				headers = {
		            'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + $rootScope.loginToken,
					'X-Api-Version': 'v'+ModifiQApiVersion
		        };
			}
		}else{
			headers = {
	            'Content-Type': 'application/json',
				'X-Api-Version': 'v'+ModifiQApiVersion
	        };
		}
		if($method == "POST"){
			$http({
				method: "POST",
				url: $url,
				data: $data,
				withCredentials: false,
		        headers: headers
			}).then($successCallback, function(err){
				if(err.status == 401){
					loading.hide();
					alerta.show('warning', 'Atenção', 'A sua sessão expirou. Realize o login novamente!', false, function(){
						$location.path("/logout");
					});
				}else{
					$errorCallback(err);
				}
			});
		}else if($method == "GET"){
			$http({
				method: "GET",
				url: $url,
				withCredentials: false,
		        headers: headers,
				params: $data
			}).then($successCallback, function(err){
				if(err.status == 401){
					loading.hide();
					alerta.show('warning', 'Atenção', 'A sua sessão expirou. Realize o login novamente!', false, function(){
						$location.path("/logout");
					});
				}else{
					$errorCallback(err);
				}
			});
		}else if($method == "PUT"){
			$http({
				method: "PUT",
				url: $url,
				data: $data,
				withCredentials: false,
		        headers: headers
			}).then($successCallback, function(err){
				if(err.status == 401){
					loading.hide();
					alerta.show('warning', 'Atenção', 'A sua sessão expirou. Realize o login novamente!', false, function(){
						$location.path("/logout");
					})
				}else{
					$errorCallback(err);
				}
			});
		}else if($method == "DELETE"){
			$http({
				method: "DELETE",
				url: $url,
				data: $data,
				withCredentials: false,
		        headers: headers
			}).then($successCallback, function(err){
				if(err.status == 401){
					loading.hide();
					alerta.show('warning', 'Atenção', 'A sua sessão expirou. Realize o login novamente!', false, function(){
						$location.path("/logout");
					})
				}else{
					$errorCallback(err);
				}
			});
		}if($method == "UPLOAD"){
			$http({
				method: "POST",
				url: $url,
				data: $data,
				withCredentials: false,
		        headers: headers
			}).then($successCallback, function(err){
				if(err.status == 401){
					loading.hide();
					alerta.show('warning', 'Atenção', 'A sua sessão expirou. Realize o login novamente!', false, function(){
						$location.path("/logout");
					});
				}else{
					$errorCallback(err);
				}
			});
		}
	}
})

ModifiQAppServices.factory('localService', ['$http',function($http){
	return {
		set:function(key,value){
	    	return localStorage.setItem(key,JSON.stringify(value));
		},
		get:function(key){
	    	return JSON.parse(localStorage.getItem(key));
		},
		destroy:function(key){
	    	return localStorage.removeItem(key);
		},
	};
}])

ModifiQAppServices.factory('sessionService', ['$http',function($http){
	return {
		set:function(key,value){
	    	return sessionStorage.setItem(key,JSON.stringify(value));
		},
		get:function(key){
	    	return JSON.parse(sessionStorage.getItem(key));
		},
		destroy:function(key){
	    	return sessionStorage.removeItem(key);
		},
	};
}])

ModifiQAppServices.factory('loading', ['$http',function($http){
	return {
		show:function(){
	    	$(".loading").fadeIn("normal");
		},
		hide:function(){
	    	$(".loading").fadeOut("normal");
		}
	};
}])

ModifiQAppServices.factory('alerta', ['SweetAlert',function(SweetAlert){
	return {
		show:function(tipo, titulo, texto, cancelar, callbackok, callbackcancelar){
			if(tipo == undefined){
				tipo = 'warning';
			}
	    	SweetAlert.swal({
	            title: titulo, //Bold text
	            text: texto, //light text
	            type: tipo, //type -- adds appropiriate icon
	            showCancelButton: cancelar, // displays cancel btton
	            confirmButtonColor: "#DD6B55",
	            confirmButtonText: "OK",
	            cancelButtonText: "Cancelar",
	            closeOnConfirm: true, //do not close popup after click on confirm, usefull when you want to display a subsequent popup
	            closeOnCancel: true
	        },
	        function(isConfirm){ //Function that triggers on user action.
	            if(isConfirm){
	                if(callbackok != undefined){
	                	callbackok();
	                }
	            } else {
	                if(callbackcancelar != undefined){
	                	callbackcancelar();
	                }
	            }
	        });
		}
	};
}])

ModifiQAppServices.directive('videoPlayer', function ($sce) {
    return {
	    template: '<div><video ng-src="{{trustSrc()}}" autoplay playsinline></video></div>',
	    restrict: 'E',
	    replace: true,
	    scope: {
	        vidSrc: '@'
	    },
	    link: function (scope) {
	        console.log('Initializing video-player');
	        scope.trustSrc = function () {
	        	console.log(scope.vidSrc);
		        if (!scope.vidSrc) {
		            return undefined;
		        }
		        return scope.vidSrc;
	        };
	    }
    };
});