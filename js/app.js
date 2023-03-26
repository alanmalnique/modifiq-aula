var ModifiQApp = angular.module('ModifiQApp', ['ModifiQApp.controllers', 'ModifiQApp.services', 'ngRoute', 'oitozero.ngSweetAlert']),
    ModifiQApiVersion = '1.0.0',
    ModifiQApiUrl = 'http://127.0.0.1:8000',
    ModifiqAulaUrl = 'http://127.0.0.1:8080';

// Adapter
window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
window.URL = window.URL || window.mozURL || window.webkitURL;
window.navigator.getUserMedia = window.navigator.getUserMedia || window.navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia || window.navigator.mediaDevices.getUserMedia;

var iceConfig = {
    'iceServers': [
        {
            urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
                'stun:stun3.l.google.com:19302',
                'stun:stun4.l.google.com:19302'
            ]
        },
        {
            urls: 'turn:yourturnserver',
            username: 'yourusername',
            credential: 'yourpassword'
        }
    ]
}

var signalingServer = 'http://127.0.0.1:4000';

ModifiQApp.run(function($rootScope, $http, webRequest, localService, $interval, $location) {
    $rootScope.pagina = '';
    $rootScope.urlApi = ModifiQApiUrl;
    $rootScope.pagina = '';
});

ModifiQApp.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	$httpProvider.defaults.withCredentials = true;
	delete $httpProvider.defaults.headers.common["X-Requested-With"];
	$httpProvider.defaults.headers.common["Accept"] = "application/json";
	$httpProvider.defaults.headers.common["Content-Type"] = "application/json";
	$httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
	$httpProvider.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, PUT, DELETE, OPTIONS';
	$httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, Content-Type, X-Auth-Token';
}]);