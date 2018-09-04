angular.module('start', []).controller('startCtrl', startCtrl)

function startCtrl() {

    function getActiveGame(id) {
        return $.ajax({
            url: "http://solidarnosclukowica.pl/tysiac/getActiveGame.php",
            type: "POST",
            data: {
                playerId: id
            }
        });
    }

    var activeGame = localStorage.getItem("Tysiac.GameFour");
    if (activeGame !== undefined && activeGame !== null){
        window.location.href ="game/gameFour.html";
    return;}

    var activePlayer = localStorage.getItem("Tysiac.Player");
    if(activePlayer !== undefined && activePlayer !== null){
        activePlayer = JSON.parse(activePlayer);
        getActiveGame(activePlayer.Id).then(data =>{
            console.log(data);
        });
        window.location.href ="main/index.html";
    }
    
    else
        window.location.href ="login/Login.html";
}