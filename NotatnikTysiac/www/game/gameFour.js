angular.module('gameFour', []).controller('gameFourCtrl', gameFourCtrl)

function gameFourCtrl($http, $scope) {
    var ctrl = this;
    var onlineGame = false;
    ctrl.game;
    ctrl.showSetButton = true;

    activate();

    function activate() {
        ctrl.game = GameFour.loadGame();
        if(ctrl.game == null){
            ctrl.game = new GameFour(true);
            ctrl.game.players = JSON.parse(localStorage.getItem("Tysiac.Players"));
            let date = new Date();
            createGameFour(date).then(function (data){ctrl.game.gameId = Number.parseInt(data)});
        }
        
    }

    ctrl.addPkt = function () {
        toggleButton();

        ctrl.game.addPkt();
        ctrl.game.saveGame();
        updateGameFour();
        var winTeam = ctrl.game.returnWinTeam();
        checkScores(winTeam);

    }

    ctrl.setRate = function () {
        toggleButton();

        ctrl.game.setRate();
    }

    ctrl.back = function () {
        if (ctrl.game.activeTeam !== "") {
            ctrl.game.clearRate();
            toggleButton();
        }
        else
            ctrl.game.reapetLastParty();

        ctrl.game.saveGame();
        updateGameFour();
    }

    ctrl.useBomb = function (team) {
        if (team === "T1")
            ctrl.game.useTeamOneBomb();
        else
            ctrl.game.useTeamTwoBomb();
    }

    ctrl.exit = function () {
        finishGameFour();
        ctrl.game.endGame();
        window.location.href = "../main/index.html"
    }

    function toggleButton() {
        if (ctrl.showSetButton) {
            ctrl.showAddButton = true
            ctrl.showSetButton = false
        }
        else {
            ctrl.showAddButton = false;
            ctrl.showSetButton = true;
        }
    }

    function checkScores(winTeam) {
        if (winTeam === "T1") {
            if (ctrl.game.isOnlineGame) {
                //winner
                ctrl.game.players[0].entity.Win = Number.parseInt(ctrl.game.players[2].entity.Win) + 1;
                ctrl.game.players[0].entity.Played = Number.parseInt(ctrl.game.players[2].entity.Played) + 1;
                ctrl.game.players[0].isWinner = true;
                ctrl.game.players[1].entity.Win = Number.parseInt(ctrl.game.players[3].entity.Win) + 1;
                ctrl.game.players[1].entity.Played = Number.parseInt(ctrl.game.players[3].entity.Played) + 1;
                ctrl.game.players[1].isWinner = true;
                //losses
                ctrl.game.players[2].entity.Played = Number.parseInt(ctrl.game.players[0].entity.Played) + 1;
                ctrl.game.players[3].entity.Played = Number.parseInt(ctrl.game.players[0].entity.Played) + 1;

                onlineWin()
            }
            alert("Wygrala druzyna pierwsza!")
            //ctrl.exit();
        }

        if (winTeam === "T2") {
            if (ctrl.game.isOnlineGame) {
                //winner
                ctrl.game.players[2].entity.Win = Number.parseInt(ctrl.game.players[2].entity.Win) + 1;
                ctrl.game.players[2].entity.Played = Number.parseInt(ctrl.game.players[2].entity.Played) + 1;
                ctrl.game.players[2].isWinner = true;
                ctrl.game.players[3].entity.Win = Number.parseInt(ctrl.game.players[3].entity.Win) + 1;
                ctrl.game.players[3].entity.Played = Number.parseInt(ctrl.game.players[3].entity.Played) + 1;
                ctrl.game.players[3].isWinner = true;
                //losses
                ctrl.game.players[0].entity.Played = Number.parseInt(ctrl.game.players[0].entity.Played) + 1;
                ctrl.game.players[1].entity.Played = Number.parseInt(ctrl.game.players[0].entity.Played) + 1;

                onlineWin()
            }
            alert("Wygrala druzyna druga!")
            //ctrl.exit();
        }
    }

    function onlineWin() {
        savePlayerStats()
        sendNotyfications()
        finishGameFour();
    }

    function savePlayerStats() {
        for (var i = 0; i < ctrl.game.players.length; i++) {
            // ctrl.game.players[i].entity.MaxPkt = ctrl.game.players[i].maxPkt
            // ctrl.game.players[i].entity.MinPkt = ctrl.game.players[i].minPkt
            insertStatsForPlayer(ctrl.game.players[i]);
        }
    }

    function sendNotyfications() {
        var date = new Date();
        date = date.toYMD();
        var title;
        var content;
        for (var i = 0; i < ctrl.game.players.length; i++) {
            if (ctrl.game.players[i].isWinner) {
                title = "Wygrana"
                content = "Wygrales gre w czworo: " + ctrl.game.teamOneScore + " / " + ctrl.game.teamTwoScore + "- Liczba rozdań:" + ctrl.game.count;
            }
            else {
                title = "Przegrana"
                content = "Przegrales gre w czworo: " + ctrl.game.teamOneScore + " / " + ctrl.game.teamTwoScore + "- Liczba rozdań:" + ctrl.game.count;
            }
            insertNotification(ctrl.game.players[i].entity.Id, content, title, date, null)
        }
    }

    function createGameFour() {
        return $.ajax({
            url: "http://solidarnosclukowica.pl/tysiac/createGameFour.php",
            type: "POST",
            data: {
                idPlayer1: ctrl.game.players[0].entity.Id,
                idPlayer2: ctrl.game.players[1].entity.Id,
                idPlayer3: ctrl.game.players[2].entity.Id,
                idPlayer4: ctrl.game.players[3].entity.Id
            }
        });
    }

    function updateGameFour(){
        return $.ajax({
            url: "http://solidarnosclukowica.pl/tysiac/updateGameFour.php",
            type: "POST",
            data: {
                gameId: ctrl.game.gameId,
                score1: ctrl.game.teamOneScore,
                score2: ctrl.game.teamTwoScore,
            }
        });
    }

    function finishGameFour(){
        return $.ajax({
            url: "http://solidarnosclukowica.pl/tysiac/finishGameFour.php",
            type: "POST",
            data: {
                gameId: ctrl.game.gameId,
                max1: ctrl.game.players[1].maxPkt,
                max2: ctrl.game.players[3].maxPkt,
                min1: ctrl.game.players[1].minPkt,
                min2:ctrl.game.players[3].minPkt,
                length:ctrl.game.count
            }
        });
    }

    function insertStatsForPlayer(player) {
        return $.ajax({
            url: "http://solidarnosclukowica.pl/tysiac/insertStatsForPlayer.php",
            type: "POST",
            data: {
                playerId: player.entity.Id,
                win: player.entity.Win,
                played: player.entity.Played
            }
        });
    }

    function insertNotification(playerId, content, title, date, withAccepcation, gameId) {
        return $.ajax({
            url: "http://solidarnosclukowica.pl/tysiac/insertNotification.php",
            type: "POST",
            data: {
                playerId: playerId,
                content: content,
                title: title,
                date: date,
                withAccepcation: withAccepcation,
                gameId: null
            }
        });
    }

    //helpers
    (function () {
        Date.prototype.toYMD = Date_toYMD;
        function Date_toYMD() {
            var year, month, day, hour, min;
            year = String(this.getFullYear());
            month = String(this.getMonth() + 1);
            if (month.length == 1) {
                month = "0" + month;
            }
            day = String(this.getDate());
            hour = String(this.getHours());
            min = String(this.getMinutes());
            if (day.length == 1) {
                day = "0" + day;
            }
            return year + "-" + month + "-" + day + " " + hour+ ":" + min;
        }
    })();

};