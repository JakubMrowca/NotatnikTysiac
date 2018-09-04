angular.module('score', []).controller('scoreCtrl', scoreCtrl)

function scoreCtrl($scope,$interval) {
    var ctrl = this;
    var player = JSON.parse(localStorage.getItem("Tysiac.Player"));
    getActiveGameLocal();
    getPlayerName();
    function getActiveGameLocal(id) {
        var activeGame = localStorage.getItem("Tysiac.ActiveGame");
        if (activeGame !== undefined && activeGame !== null) {
            ctrl.activeGame = JSON.parse(activeGame);
        }
    }

    $interval(function (){
        getActiveGame(player.Id).then(data => {
            if(data != "[]")
            {
                activeGame = JSON.parse(data);
                if(activeGame.active.length > 0){
                    ctrl.activeGame = activeGame.active[0];
                    $scope.$apply();
                }
                else{
                  window.location.href ="./index.html";
                }
                console.log(activeGame);
            }else{
              window.location.href ="./index.html";
            }  
            });
    },10000)

    function getPlayerName(){
        getPlayerById(ctrl.activeGame.Id_Player1).then(data => {ctrl.nick1 = JSON.parse(data).id[0].Nick; $scope.$apply()});
        getPlayerById(ctrl.activeGame.Id_Player2).then(data =>  {ctrl.nick2 = JSON.parse(data).id[0].Nick; $scope.$apply()});
        getPlayerById(ctrl.activeGame.Id_Player3).then(data =>  {ctrl.nick3 = JSON.parse(data).id[0].Nick; $scope.$apply()});
        getPlayerById(ctrl.activeGame.Id_Player4).then(data =>  {ctrl.nick4 = JSON.parse(data).id[0].Nick; $scope.$apply()});
    }

    function getPlayerById(idPlayer) {
        return $.ajax({
            url: "http://solidarnosclukowica.pl/tysiac/getPlayer.php",
            type: "POST",
            data: {
                id: idPlayer
            }
        });
    }

    function getActiveGame(id) {
        return $.ajax({
            url: "http://solidarnosclukowica.pl/tysiac/getActiveGame.php",
            type: "POST",
            data: {
                playerId: id
            }
        });
    }

}