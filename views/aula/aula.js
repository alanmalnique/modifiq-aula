ModifiQAppController.controller('aulaController', function($scope, $routeParams, webRequest, localService, sessionService, $timeout, $rootScope, $interval, $location, loading, alerta){
    $scope.tipo = $routeParams.tipo;
    $scope.camera = $routeParams.camera;
    $scope.microfone = $routeParams.microfone;
    $scope.sala = $routeParams.sala;
    $scope.peers = [];
    $scope.nome = sessionService.get("nome");
    $scope.id = '';
    $scope.encerrada = false;

    var socket = io(signalingServer);
    var connected = false;
    var peerConnections = {}, currentId, stream;

    $scope.carregaCameraLocal = function(){
        navigator.mediaDevices.getUserMedia (
            {
                video: {
                    deviceId: {
                        exact: $scope.camera
                    }
                },
                audio: {
                    deviceId: {
                        exact: $scope.microfone
                    }
                }
            }
        )
        .then(function(localMediaStream) {
            window.stream = localMediaStream;
            var videoLocal = document.getElementById("video-local");
            videoLocal.srcObject = localMediaStream;
            stream = localMediaStream;
            Dish();
            if(!connected){
                socket.emit('init', { room: $scope.sala, professor: $scope.tipo == 1 ? true : false, nome: $scope.nome }, function (roomid, id) {
                    console.log("Init chamado, sala: "+roomid);
                    roomId = roomid;
                    currentId = id;
                    connected = true;
                });
            }
        })
        .catch(function(err) {
            alerta.show('warning', 'Atenção', 'Você precisa dar permissão para acesso a câmera e microfone');
        });
    }
    $scope.carregaCameraLocal();

    function getPeerConnection(id, professor, nome) {
        if (peerConnections[id]) {
            return peerConnections[id];
        }
        var pc = new RTCPeerConnection(iceConfig);
        peerConnections[id] = pc;
        pc.addStream(stream);
        pc.onicecandidate = function (evnt) {
            socket.emit('msg', { by: currentId, to: id, ice: evnt.candidate, type: 'ice' });
        };
        pc.onaddstream = function (evnt) {
            console.log('Carregou o stream '+id+'. Professor: '+professor);
            if(id != currentId){
                $scope.peers.push({
                    id: id,
                    nome: nome
                });
                $scope.$apply();
                $timeout(function(){
                    document.getElementById('video-'+id).srcObject = evnt.stream;
                    Dish();
                }, 2000);
            }
        };
        return pc;
    }

    function handleMessage(data) {
        var pc = getPeerConnection(data.by, data.professor, data.nome);
        switch (data.type) {
            case 'sdp-offer':
                console.log(pc);
                pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
                    console.log('Setting remote description by offer');
                    pc.createAnswer(function (sdp) {
                        pc.setLocalDescription(sdp);
                        socket.emit('msg', { by: currentId, to: data.by, sdp: sdp, type: 'sdp-answer', professor: data.professor, nome: data.nome });
                    }, function (e) {
                      console.log(e);
                    });
                }, function (e) {
                    console.log(e);
                });
            break;
            case 'sdp-answer':
                pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
                    console.log('Setting remote description by answer');
                }, function (e) {
                    console.error(e);
                });
            break;
            case 'ice':
                if (data.ice) {
                    console.log('Adding ice candidates');
                    pc.addIceCandidate(new RTCIceCandidate(data.ice));
                }
            break;
        }
    }

    function makeOffer(params) {
        var id = params.id;
        var pc = getPeerConnection(id, params.professor, params.nome);
        pc.createOffer(function (sdp) {
            pc.setLocalDescription(sdp);
            console.log('Creating an offer for', id);
            console.log({ by: currentId, to: id, sdp: sdp, type: 'sdp-offer', professor: $scope.tipo == 1 ? true : false, nome: $scope.nome });
            socket.emit('msg', { by: currentId, to: id, sdp: sdp, type: 'sdp-offer', professor: $scope.tipo == 1 ? true : false, nome: $scope.nome });
        }, function (e) {
            console.log(e);
        },
        { mandatory: { OfferToReceiveVideo: true, OfferToReceiveAudio: true }});
    }

    socket.on('peer.connected', function (params) {
        console.log(params);
        makeOffer({ id: params.id, professor: params.professor, nome: params.nome });
    });

    socket.on('msg', function (data) {
        handleMessage(data);
    });

    socket.on('peer.disconnected', function (data) {
        console.log('Client disconnected, removing stream');
        $scope.peers = $scope.peers.filter(function (p) {
            return p.id !== data.id;
        });
        $scope.$apply();
    });

    $scope.encerrar = function(){
        alerta.show('warning', 'Atenção', 'Deseja realmente encerrar a aula?', true, function(){
            loading.show();
            var id = sessionService.get("id");
            webRequest.post("geral/aula", {tipo: 2, tipo_aula: $scope.tipo, id: id}, function(ok){
                loading.hide();
                alerta.show('success', 'Sucesso', 'A aula foi encerrada com sucesso!', false, function(){
                    $(".videos-alunos").remove();
                    $scope.encerrada = true;
                    stream.getTracks().forEach(function(track) {
                        track.stop();
                    });
                })
            }, function(err){

            });
        })
    }

    $scope.fechar = function(){
        window.close();
    }

});

function Area(Increment, Count, Width, Height, Margin = 10) {
    let i = w = 0;
    let h = Increment * 0.75 + (Margin * 2);
    while (i < (Count)) {
        if ((w + Increment) > Width) {
            w = 0;
            h = h + (Increment * 0.75) + (Margin * 2);
        }
        w = w + Increment + (Margin * 2);
        i++;
    }
    if (h > Height) return false;
    else return Increment;
}
// Dish:
function Dish() {

    // variables:
        let Margin = 2;
        let Scenary = document.getElementById('videos-alunos');
        let Width = Scenary.offsetWidth - (Margin * 2);
        let Height = Scenary.offsetHeight - (Margin * 2);
        let Cameras = document.getElementsByClassName('videos');
        let max = 0;
    
    // loop (i recommend you optimize this)
        let i = 1;
        while (i < 5000) {
            let w = Area(i, Cameras.length, Width, Height, Margin);
            if (w === false) {
                max =  i - 1;
                break;
            }
            i++;
        }
    
    // set styles
        max = max - (Margin * 2);
        setWidth(max, Margin);
}

// Set Width and Margin 
function setWidth(width, margin) {
    console.log(width);
    let Cameras = document.getElementsByClassName('videos');
    for (var s = 0; s < Cameras.length; s++) {
        Cameras[s].style.width = width + "px";
        Cameras[s].style.margin = margin + "px";
        Cameras[s].style.height = ((width * 0.75) + 40) + "px";
    }
}

// Load and Resize Event
window.addEventListener("load", function (event) {
    Dish();
    window.onresize = Dish;
}, false);

$(window).resize(function(){
    Dish();
})