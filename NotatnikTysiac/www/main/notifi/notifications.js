angular.module('notifications', []).controller('notificationsCtrl', notificationsCtrl)

function notificationsCtrl($scope) {
    var ctrl = this;
    ctrl.player;
    ctrl.notifications = [];

    activate();

    function activate(){
        ctrl.notifications = JSON.parse(localStorage.getItem("Tysiac.Player.Notif"));
        ctrl.player = JSON.parse(localStorage.getItem("Tysiac.Player"));
        console.log(ctrl.notifications);
    }

    ctrl.accepted = function (notyfication, state) {
        setActivateState(notyfication.Id, state).then(data => {
            console.log(data);
            getNotifications();
        });
    }

    ctrl.delete = function(notification){
        deleteNotification(notification.Id).then(data =>{
            getNotifications();
        });
    }

    function getNotifications() {
        getNotificationsByPlayerId(ctrl.player.Id).then(data => {

            var notifications = JSON.parse(data);
            ctrl.notifications = notifications.notyfications;
            $scope.$apply();
            console.log(ctrl.notifications);
            localStorage.setItem("Tysiac.Player.Notif", JSON.stringify(ctrl.notifications));
        });
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

    function deleteNotification(idNotf) {
        return $.ajax({
            url: "http://solidarnosclukowica.pl/tysiac/deleteNotification.php",
            type: "POST",
            data: {
                id: idNotf
            }
        });
    }

}