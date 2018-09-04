angular.module('savedGame', []).controller('savedGameCtrl', savedGameCtrl)

function savedGameCtrl($scope) {
    var ctrl = this;
    var player;
    ctrl.showContent = false;
    ctrl.notifications;
    ctrl.printGame = false;
    ctrl.game;
    ctrl.sum1 = 0;
    ctrl.sum2 = 0;

    ctrl.player = JSON.parse(localStorage.getItem("Tysiac.Player"));

    ctrl.logout = function () {
        localStorage.removeItem("Tysiac.Player");
        localStorage.removeItem("Tysiac.Player.Notif");
        window.location.href = "../../login/Login.html";
    }

    ctrl.calculate1 = function (pkt) {
        var pkt1 = ctrl.sum1 + pkt;
        console.log(pkt);
        ctrl.sum1 = pkt1
        return pkt1;
    }
    ctrl.calculate2 = function (pkt) {
        var pkt1 = ctrl.sum2 + pkt;
        ctrl.sum2 = pkt1
        return pkt1;
    }

    getSavedGame(ctrl.player.Id).then(data => {
        ctrl.allGames = JSON.parse(data);
        ctrl.allGames.game.forEach(game => {
            var replace = game.Game.replaceAll('&quot;', '"');
            console.log(replace);
            game.Game = JSON.parse(replace);
        });
        console.log(ctrl.allGames);
        $scope.$apply();
    })

    ctrl.showGame = function (game) {
        ctrl.scores = game.scores;
        for (let i = 0; i < ctrl.scores.length; i++) {
            if (!ctrl.scores[i - 1]) {
                ctrl.scores[i].sum1 = ctrl.scores[i].pkt1;
                ctrl.scores[i].sum2 = ctrl.scores[i].pkt2;
            }
            else {
                ctrl.scores[i].sum1 = ctrl.scores[i - 1].sum1 + ctrl.scores[i].pkt1;
                ctrl.scores[i].sum2 = ctrl.scores[i - 1].sum2 + ctrl.scores[i].pkt2;
            }
        }
    
    ctrl.printGame = true;
    ctrl.game = game;
    console.log(ctrl.scores);
}

//http
function getSavedGame(idPlayer) {
    return $.ajax({
        url: "http://solidarnosclukowica.pl/tysiac/getSavedGames.php",
        type: "POST",
        data: {
            idPlayer: idPlayer
        }
    });
}

ctrl.back = function(){
    ctrl.printGame = false;
    ctrl.game = undefined;
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

}