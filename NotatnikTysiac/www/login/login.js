angular.module('login', []).controller('loginCtrl', loginCtrl)

function loginCtrl($http, $scope) {
    var ctrl = this;
    var user;

    ctrl.loginAction = function () {
        if ($scope.form.$valid) {

            login().then(data => {
                user = JSON.parse(data);

                if (checkLogin(user))
                    getAndSetPlayer(user.Id_Player[0].Id_Player)

            });
        }
    }
    ctrl.registration = function(){
        window.location.href = "../registration/Registration.html"
    }
    
    function getAndSetPlayer(idPlayer) {
        getPlayerById(idPlayer).then(data => {
          var player = JSON.parse(data);
          player = player.id[0];
          localStorage.setItem("Tysiac.Player",JSON.stringify(player));
          getActiveGame(player.Id).then(data => {
          if(data != "[]")
          {
              activeGame = JSON.parse(data);
              if(activeGame.active.length > 0){
                localStorage.setItem("Tysiac.ActiveGame", JSON.stringify(activeGame.active[0]));
                window.location.href ="../main/score.html";
              }
              else{
                window.location.href ="../main/index.html";
              }
              console.log(activeGame);
          }else{
            window.location.href ="../main/index.html";
          }  
          });
         
        })
    }

    function checkLogin(user) {
        var msg = document.getElementById("errorLogin");
        if (user.length === 0) {
            msg.style.display = "block";
            return false;
        }
        else {
            msg.style.display = "none";
            return true;
        }
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

    function login() {
        return $.ajax({
            url: "http://solidarnosclukowica.pl/tysiac/checkLogin.php",
            type: "POST",
            data: {
                password: ctrl.password,
                login: ctrl.login
            }
        });
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

};