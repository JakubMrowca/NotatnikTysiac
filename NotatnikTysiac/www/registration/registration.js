angular.module('registration', []).controller('regCtrl', regCtrl)

function regCtrl($scope) {
    var ctrl = this;

    ctrl.registration = function () {
        checkLogin(ctrl.login).then(data => {
            if (data === true) {
                checkNick(ctrl.nick).then(response => {
                    if (response === true) {
                        createPlayer();
                    }
                });
            }
        });
    }

    ctrl.goToLogin = function () {
        window.location.href = "../login/Login.html";
    }

    function checkLogin(login) {
        return new Promise((resolve, reject) => {
            var errorMessage = document.getElementById("errorMessage");

            checkField("Konta", "Login", login).then(data => {
                if (data === '[[{"COUNT(*)":"0"}]]') {
                    errorMessage.style.display = "none";
                    resolve(true);
                } else {
                    errorMessage.style.display = "block";
                    errorMessage.innerText = "Taki Login już istnieje w bazie danych."
                    resolve(false);
                }
            });

        });
    }
    function checkNick(nick) {
        return new Promise((resolve, reject) => {
            var errorMessage = document.getElementById("errorMessage");

            checkField("Gracze", "Nick", nick).then(data => {
                if (data === '[[{"COUNT(*)":"0"}]]') {
                    errorMessage.style.display = "none";
                    resolve(true);
                } else {
                    errorMessage.style.display = "block";
                    errorMessage.innerText = "Taki Nick już istnieje w bazie danych."
                    resolve(false);
                }
            });
        });
    }
    function addAccount(idPlayer) {
        insertAccount(ctrl.login, ctrl.password, idPlayer).then(data => {
            if (data > 0) {
                var succesMsg = document.getElementById("succesMessage");
                succesMsg.style.display = "block";
                sendEmail();
            }
        });
    }
    //insert player to db and return id new insert player
    function createPlayer() {
        insertPlayer(ctrl.nick, ctrl.email).then(data => {
            addAccount(data);
        });
    }

    function sendEmail(){
        
    }

    //http
    function checkField(table, field, checkTerm) {
        return $.ajax({
            url: "http://solidarnosclukowica.pl/tysiac/checkField.php",
            type: "POST",
            data: {
                field: field,
                table: table,
                check: checkTerm
            }
        });
    }

    function insertAccount(login, password, idPlayer) {
        return $.ajax({
            url: "http://solidarnosclukowica.pl/tysiac/insertAccount.php",
            type: "POST",
            data: {
                login: login,
                password: password,
                idPlayer: idPlayer
            }
        });
    }
    function insertPlayer(nick, email) {
        return $.ajax({
            url: "http://solidarnosclukowica.pl/tysiac/insertPlayer.php",
            type: "POST",
            data: {
                nick: nick,
                email: email
            }
        });
    }
    function getPlayerByNick(nick) {
        return $.ajax({
            url: "http://solidarnosclukowica.pl/tysiac/getPlayerByNick.php",
            type: "POST",
            data: {
                nick: nick
            }
        });
    }

}