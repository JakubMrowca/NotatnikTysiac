angular.module('fourPlayer', []).controller('fourPlayerCtrl', fourPlayerCtrl)

function fourPlayerCtrl($scope, $interval) {
    var ctrl = this;
    var newFourGame;
    ctrl.players = [
        {
            checked: false,
            exist: true,
            accept: false,
            reject: false,
            state: "init",
            id: 0,
            notifiId: 0,
            nick: ""
        },
        {
            checked: false,
            exist: true,
            accept: false,
            reject: false,
            state: "init",
            notifiId: 0,
            id: 0,
            nick: ""
        },
        {
            checked: false,
            exist: true,
            accept: false,
            reject: false,
            state: "init",
            notifiId: 0,
            id: 0,
            nick: ""
        }
    ];


    var allAccept = true;
    ctrl.onlineGame = false;

    activate();

    ctrl.toggle = function (count) {
        if (count == 1) {
            ctrl.onlineGame = false;
            ctrl.errorTemp = false;
            ctrl.errorOnline = false;
        }
        else
            ctrl.onlineGame = true;
        ctrl.errorTemp = false;
        ctrl.errorOnline = false;
    }

    ctrl.sendInvite = function (playerNick, playerNr) {
        var player;
        for (let i = 0; i < ctrl.players.length; i++) {
            if (ctrl.players[i].nick === playerNick) {
                player = ctrl.players[i];
                break;
            }
        }
        if (player.state === "waiting")
            return;
        if (player.state === "ready")
            return;
        if (player.state === "reject")
            player.checked = false;
        player.exist = true;
        player.accept = false;
        player.reject = false;
        player.state = "init";
        player.notifiId = 0;
        player.id = 0;

        getPlayerByNick(player.nick).then(data => {
            let tmp = JSON.parse(data)
            if (tmp.player === undefined) {
                player.exist = false;
                player.checked = true;
                player.state = "exist";
                $scope.$apply();
                return;
            }
            player.exist = true;
            player.checked = true;
            player.state = "waiting";
            player.id = tmp.player[0].Id;
            player.entity = tmp.player[0];
            $scope.$apply();
            sendNotification(player);

        });
    }

    ctrl.startTempGame = function () {
        if (ctrl.player2temp === undefined || ctrl.player2temp === '' ||
            ctrl.player3temp === undefined || ctrl.player3temp === '' ||
            ctrl.player4temp === undefined || ctrl.player4temp === '') {

            ctrl.errorTemp = true;
            return;
        }
        else {
            ctrl.errorTemp = false;
        }
        var tempPlayers = [{
            nick: ctrl.player1.Nick,
            maxPkt: 0,
            minPkt: 0,
            pkt: 0
        },
        {
            nick: ctrl.player2temp,
            maxPkt: 0,
            minPkt: 0,
            pkt: 0
        },
        {
            nick: ctrl.player3temp,
            maxPkt: 0,
            minPkt: 0,
            pkt: 0
        },
        {
            nick: ctrl.player4temp,
            maxPkt: 0,
            minPkt: 0,
            pkt: 0
        }];
        localStorage.setItem("Tysiac.Players", JSON.stringify(tempPlayers));
        localStorage.setItem("Tysiac.OnlineGame", JSON.stringify(false));

        window.location.href = "../game/gameFour.html"

    }
    ctrl.checkButtons = function () {
        for (let i = 0; i < ctrl.players.length; i++) {
            if (ctrl.players[i].accept == false) {
                ctrl.errorOnline = true;
                return;
            }
        }
        ctrl.errorOnline = false;
        console.log("Zaczynamy nowa gre");
        var tezewe = {
            nick: ctrl.player1.Nick,
            maxPkt: 0,
            minPkt: 0,
            pkt: 0,
            entity: ctrl.player1,
            id: ctrl.player1.Id
        }
 
        var tmpTable = [];
        
        tmpTable.push(tezewe);
        tmpTable.push(ctrl.players[0]);
        tmpTable.push(ctrl.players[1]);
        tmpTable.push(ctrl.players[2]);

        ctrl.players = tmpTable;
        localStorage.setItem("Tysiac.Players", JSON.stringify(ctrl.players));
        localStorage.setItem("Tysiac.OnlineGame", JSON.stringify(true));
        window.location.href = "../game/gameFour.html"
    }

    function activate() {
        ctrl.player1 = JSON.parse(localStorage.getItem("Tysiac.Player"));

    }

    function sendNotification(player) {
        var content = "Zostales zaproszony przez: " + ctrl.player1.Nick + " do rozgrywki w czwórke";
        var date = new Date();
        date = date.toYMD();
        var title = "Zaproszenie";
        var withAccepcation = 01;
        insertNotification(player.id, content, title, date, withAccepcation).then(data => {
            let tmp = JSON.parse(data);
            player.notifiId = tmp;
            var intervalPromise = $interval(function () {
                checkAccepcation(player.notifiId).then(data => {
                    let tmp = JSON.parse(data);
                    if (tmp.accepcet[0].Accepcet === "1") {
                        player.accept = true;
                        player.state = "ready";
                        console.log(ctrl.players);
                        $interval.cancel(intervalPromise);
                    }
                    if (tmp.accepcet[0].Accepcet === "2") {
                        player.reject = true;
                        player.state = "reject";
                        $interval.cancel(intervalPromise);
                    }
                    console.log(tmp.accepcet[0].Accepcet);
                })
            }, 10000);
        });
    }


    //http
    function getPlayerByNick(nick) {
        return $.ajax({
            url: "http://solidarnosclukowica.pl/tysiac/getPlayerByNick.php",
            type: "POST",
            data: {
                nick: nick
            }
        });
    }

    function checkAccepcation(notifiId) {
        return $.ajax({
            url: "http://solidarnosclukowica.pl/tysiac/checkAccepcation.php",
            type: "POST",
            data: {
                notifiId: notifiId
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

}