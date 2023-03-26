var video, audio;
ModifiQAppController.controller('homeController', function($scope, $routeParams, alerta, webRequest, localService, sessionService, $timeout, $rootScope, $interval, $location, loading){
    $scope.id = $routeParams.id;
    $scope.tipo = $routeParams.tipo;
    $scope.video = '';
    $scope.entrar = function(){
	    if (!window.RTCPeerConnection || !navigator.getUserMedia) {
	    	alerta.show('Atenção', 'WebRTC não é suportado pelo seu navegador. Você pode baixar o Chrome ou Firefox para continuar.');
	    }else{
	    	loading.show();
		    webRequest.post("geral/aula", {tipo: 1, tipo_aula: $scope.tipo, id: $scope.id}, function(ok){
		    	sessionService.set("url", ok.data.data.url);
		    	sessionService.set("nome", ok.data.data.nome);
		    	sessionService.set("id", $scope.id);
		    	loading.hide();
				$timeout(function(){
					$location.path("/aula/"+$scope.tipo+"/"+document.getElementById("media").value+"/"+document.getElementById("microphone").value+"/"+ok.data.data.url+"/ver");
				}, 100);
		    }, function(err){

		    });
		}
	}

	$scope.show_btnmic = false;
	$scope.show_btncam = true;
	
    $scope.medias = [];
    $scope.microphones = [];

	$scope.habilitaCamera = function(){
		navigator.mediaDevices.getUserMedia ({video: true})
		.then(function(localMediaStream) {
			$scope.show_btncam = false;
			$scope.show_btnmic = true;
			$scope.$apply();
		})
		.catch(function(err){
			console.log(err);
			alert('Você precisa dar permissão para acesso a câmera!');
		});
	}

	$scope.habilitaMicrofone = function(){
		navigator.mediaDevices.getUserMedia ({ audio: true})
		.then(function(localMediaStream) {
			$scope.show_btnmic = false;
			$scope.$apply();
 			$scope.carregaDevices();
	 	})
	 	.catch(function(err) {
			alert('Você precisa dar permissão para acesso ao microfone!');
		});
	}

	$scope.carregaDevices = function(){
		navigator.mediaDevices.getUserMedia (
		    {
		        video: true,
		        audio: true
		    }
		)
		.then(function(localMediaStream) {
 			$("#media").show();
 			navigator.mediaDevices.enumerateDevices()
 			.then(function (devices) {
 				console.log(devices);
		        for(var i = 0; i < devices.length; i ++){
		            var device = devices[i];
		            if (device.kind === 'videoinput') {
		                var option = {
		                	value: device.deviceId,
		                	text: device.label || 'camera ' + (i + 1)
		                };
		                $scope.medias.push(option);
		                $scope.$apply();
		            } else if (device.kind === 'audioinput') {
		                var option = {
		                	value: device.deviceId,
		                	text: device.label || 'microfone ' + (i + 1)
		                };
		                $scope.microphones.push(option);
		                $scope.$apply();
		            }
		        };
		    })
		    .catch(function(err){
		    	console.log(err);
		    });
	 	})
		.catch(function(err) {
			    alert('Você precisa dar permissão para acesso a câmera e microfone');
		});
	}
});

function selecionaCameraHome(){
	video = document.getElementById("media").value;
	navigator.mediaDevices.getUserMedia (
	    {
	        video: {
	        	deviceId: video
	        },
	        audio: true
	    }
	)
 	.then(function(localMediaStream) {
 		$("#microphone").show();
 	})
	.catch(function(err) {
		alert('Você precisa dar permissão para acesso a câmera e microfone');
	});
}

function selecionaMicrofoneHome(){
	if(!video){
		alert('Selecione a câmera antes de selecionar o microfone.');
	}else{
		audio = document.getElementById("microphone").value;
		navigator.mediaDevices.getUserMedia (
		    {
		        video: {
		        	deviceId: video
		        },
		        audio: {
		        	devideId: audio
		        }
		    }
		)
	 	.then(function(localMediaStream) {
 			window.stream = localMediaStream;
			var video = document.getElementById("video");
			video.srcObject = localMediaStream;
			setTimeout(function(){
				$("#entrar").show();
			}, 1000);
	 	})
		.catch(function(err) {
		    alert('Você precisa dar permissão para acesso a câmera e microfone');
		});
	}
}