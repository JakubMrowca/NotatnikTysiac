angular.module('score', []).controller('scoreCtrl', scoreCtrl)

function scoreCtrl($scope) {
    var ctrl = this;

    getActiveGame();
    getPlayerName();
    function getActiveGame(id) {
        var activeGame = localStorage.getItem("Tysiac.ActiveGame");
        if (activeGame !== undefined && activeGame !== null) {
            ctrl.activeGame = JSON.parse(activeGame);
        }
    }

    function getPlayerName(){
        getPlayerById(ctrl.activeGame.Id_Player1).then(data => ctrl.nick1 = JSON.parse(data).id[0].Nick);
        getPlayerById(ctrl.activeGame.Id_Player2).then(data => ctrl.nick2 = JSON.parse(data).id[0].Nick);
        getPlayerById(ctrl.activeGame.Id_Player3).then(data => ctrl.nick3 = JSON.parse(data).id[0].Nick);
        getPlayerById(ctrl.activeGame.Id_Player4).then(data => ctrl.nick4 = JSON.parse(data).id[0].Nick);

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


}