angular.module('ranking', []).controller('rankingCtrl', rankingCtrl)

function rankingCtrl($scope,$interval) {
    var ctrl = this;
    ctrl.player;
    ctrl.notifications = [];
    ctrl.players;
  
    ctrl.logout = function () {
        localStorage.removeItem("Tysiac.Player");
        localStorage.removeItem("Tysiac.Player.Notif");
        window.location.href = "../../login/Login.html";
    }
    getAllPlayers().then(data =>{
        console.log(data);
        var players = JSON.parse(data).id;
        for(let i =0; i < players.length; i++){
            if(Number.parseInt(players[i].Played) > 0)
                players[i].score = (Number.parseInt(players[i].Win) / Number.parseInt(players[i].Played)) * Number.parseInt(players[i].Played);
            else{
                players[i].score = 0;
            }
        };
        ctrl.players = players;
        $scope.$apply();
        console.log(players);
    })

    //http
    function getNotificationsByPlayerId(idPlayer) {
        return $.ajax({
            url: "http://solidarnosclukowica.pl/tysiac/getNotificationsByPlayerId.php",
            type: "POST",
            data: {
                idPlayer: idPlayer
            }
        });
    }

    function setActivateState(idNotf, state) {
        return $.ajax({
            url: "http://solidarnosclukowica.pl/tysiac/setActiveState.php",
            type: "POST",
            data: {
                id: idNotf,
                state: state
            }
        });
    }

    function getAllPlayers() {
        return $.ajax({
            url: "http://solidarnosclukowica.pl/tysiac/getAllPlayers.php",
            type: "POST"
        });
    }

}