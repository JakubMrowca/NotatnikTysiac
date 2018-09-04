angular.module('notifications', []).controller('notificationsCtrl', notificationsCtrl)

function notificationsCtrl($scope,$interval) {
    var ctrl = this;
    ctrl.player;
    ctrl.notifications = [];

    activate();

    function activate(){
        ctrl.player = JSON.parse(localStorage.getItem("Tysiac.Player"));
        console.log(ctrl.notifications);
        getNotifications();
        var intervalPromise = $interval(function(){
            getNotifications();
        },10000);
    }

    ctrl.accepted = function (notyfication, state) {
        setActivateState(notyfication.Id, state).then(data => {
            console.log(data);
            getNotifications();
        });
    }

    
    ctrl.logout = function () {
        localStorage.removeItem("Tysiac.Player");
        localStorage.removeItem("Tysiac.Player.Notif");
        window.location.href = "../../login/Login.html";
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