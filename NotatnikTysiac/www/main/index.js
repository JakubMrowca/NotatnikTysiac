angular.module('index', []).controller('mainCtrl', mainCtrl)

function mainCtrl($scope, $interval) {
    var ctrl = this;
    var player;
    var notificationCount;
    ctrl.showContent = false;
    ctrl.notifications = [];
    activate();

    if ("Notification" in window) {
        Notification.requestPermission(function (permission) {
        });
    }

    ctrl.newGame = function (playerCount) {
        if (playerCount == 4) {
            window.location.href = "../choseTeam/fourPlayer.html";
        }
        else
            window.location.href = "../choseTeam/threePlayer.html";
    }

    ctrl.logout = function () {
        localStorage.removeItem("Tysiac.Player");
        localStorage.removeItem("Tysiac.Player.Notif");
        window.location.href = "../login/Login.html";
    }

    ctrl.accepted = function (notyfication, state) {
        setActivateState(notyfication.Id, state).then(data => {
            console.log(data);
            getNotifications();
        });
    }

    function activate() {
        player = JSON.parse(localStorage.getItem("Tysiac.Player"));
        if (player !== undefined && player !== null) {
            ctrl.showContent = true;
            ctrl.nick = player.Nick;
            ctrl.win = player.Win;
            ctrl.played = player.Played;
            console.log(player);
            getNotifications();
            var intervalPromise = $interval(function () {
                getNotifications();
            }, 30000);
        }

    }

    function getNotifications() {
        getNotificationsByPlayerId(player.Id).then(data => {
            notificationCount = JSON.parse(localStorage.getItem("Tysiac.NotifCount"));
            var notifications = JSON.parse(data);
            if (notificationCount != undefined && notifications.notyfications.length > notificationCount) {
                sendNotifi(notifications.notyfications[notifications.notyfications.length - 1]);
            }
            ctrl.notifications = notifications.notyfications;
            localStorage.setItem("Tysiac.NotifCount", JSON.stringify(ctrl.notifications.length));
            $scope.$apply();
            console.log(ctrl.notifications);
            localStorage.setItem("Tysiac.Player.Notif", JSON.stringify(ctrl.notifications));
        });
    }

    function sendNotifi(lastNotification) {
        var notification = new Notification('Notatnik Tysi¹c', {
            tag: 'Powiadomienie',
            body: lastNotification.Content
        });
        notification.onshow = function () { console.log('show'); };
        notification.onclose = function () { console.log('close'); };
        notification.onclick = function () { console.log('click'); };
    }

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

}