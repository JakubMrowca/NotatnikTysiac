class GameFour {

    constructor(isOnlineGame) {
        this.clearGame();
        this.isOnlineGame = isOnlineGame;      
    }

    clearGame() {
        this.count = 0;
        this.player = [];
        this.scores = [];
        this.isOnlineGame = false;
        this.teamOneScore = 0;
        this.teamTwoScore = 0;
        this.teamOneBomb = false;
        this.teamTwoBomb = false;
        this.gameCountWhenUseOneBomb = null;
        this.gameCountWhenUseTwoBomb = null;
        this.clearPkt();
        this.clearRate();
    }

    clearPkt() {
        this.teamOnePkt = 0;
        this.teamTwoPkt = 0;
    }

    clearRate() {
        this.rate = 0;
        this.activeTeam = "";
    }

    static loadGame() {
        var gameFourJson = localStorage.getItem("Tysiac.GameFour");
        if (gameFourJson === undefined || gameFourJson === null)
            return null;
        else
            var gameFour = JSON.parse(gameFourJson)
        var newGame = new GameFour()
        newGame.loadStats(gameFour);
        return newGame;
    }

    loadStats(saveStats){
        this.count = saveStats.count;
        this.player = saveStats.player;
        this.scores = saveStats.scores;
        this.isOnlineGame = saveStats.isOnlineGame;
        this.teamOneScore = saveStats.teamOneScore;
        this.teamTwoScore = saveStats.teamTwoScore;
        this.teamOneBomb = saveStats.teamOneBomb;
        this.teamTwoBomb = saveStats.teamTwoBomb;
        this.gameCountWhenUseOneBomb = saveStats.gameCountWhenUseOneBomb;
        this.gameCountWhenUseTwoBomb = saveStats.gameCountWhenUseTwoBomb;
        this.teamOnePkt = saveStats.teamOnePkt;
        this.teamTwoPkt = saveStats.teamTwoPkt;
        this.rate = saveStats.rate;
        this.activeTeam = saveStats.activeTeam;
        this.isOnlineGame = saveStats.isOnlineGame;
    }

    saveGame() {
        localStorage.setItem("Tysiac.GameFour", JSON.stringify(this));
    }

    endGame() {
        this.clearGame();
        localStorage.removeItem("Tysiac.GameFour");
    }

    setRate() {
        if (this.teamOnePkt > this.teamTwoPkt) {
            this.rate = this.teamOnePkt;
            this.activeTeam = "T1";
        }
        else {
            this.rate = this.teamTwoPkt;
            this.activeTeam = "T2";
        }

        this.clearPkt();
    }

    addPkt() {
        this.checkMaxPkt();
        this.checkActiveTeam();
        this.pushToScoresAndAddToScore();
        this.clearRate();
        this.clearPkt();
        this.count += 1;
    }

    checkMaxPkt() {
        if (this.teamOnePkt > this.players[0].maxPkt)
            this.players[0].maxPkt = this.teamOnePkt;

        if (this.teamOnePkt > this.players[1].maxPkt)
            this.players[1].maxPkt = this.teamOnePkt;

        if (this.teamTwoPkt > this.players[2].maxPkt)
            this.players[2].maxPkt = this.teamTwoPkt;

        if (this.teamTwoPkt > this.players[3].maxPkt)
            this.players[3].maxPkt = this.teamTwoPkt;
    }

    checkActiveTeam() {

        if (this.activeTeam === "T1")
            this.checkPartyForTeamOne();
        else
            this.checkPartyForTeamTwo();
    }

    checkPartyForTeamOne() {
        if (this.teamOnePkt < this.rate) {
            this.checkMinPkt(0, 1);
            this.teamOnePkt = this.rate * -1;
        }
    }
    checkPartyForTeamTwo() {
        if (this.teamTwoPkt < this.rate) {
            this.checkMinPkt(2, 3);
            this.teamTwoPkt = this.rate * -1
        }
    }

    checkMinPkt(playerOneIndex, playerTwoIndex) {
        if (this.rate < this.players[playerOneIndex].minPkt)
            this.players[playerOneIndex].minPkt = this.rate;
        if (this.rate < this.players[playerTwoIndex].minPkt)
            this.players[playerTwoIndex].minPkt = this.rate;
    }

    pushToScoresAndAddToScore() {
        let score = {
            pkt1: this.teamOnePkt,
            pkt2: this.teamTwoPkt
        }
        this.scores.push(score);

        this.teamOneScore = this.teamOneScore + this.teamOnePkt;
        this.teamTwoScore = this.teamTwoScore + this.teamTwoPkt;
        this.clearPkt()
    }

    returnWinTeam() {
        var winTeam = null;
        if (this.teamOneScore >= 1000 && this.teamOneScore > this.teamTwoScore)
            winTeam = "T1";

        if (this.teamTwoScore >= 1000 && this.teamTwoScore > this.teamOnePkt)
            winTeam = "T2";

        if(winTeam != null)
            console.log(this)
        return winTeam;
    }

    reapetLastParty() {
        this.scores.splice((this.scores.length) - 1, 1);
        this.calculateScores();
        this.clearRate();
        this.revertBomb();
        this.count = this.scores.length;
    }

    calculateScores() {
        var tmpScore1 = 0;
        var tmpScore2 = 0;

        for (let i = 0; i < this.scores.length; i++) {
            tmpScore1 += this.scores[i].pkt1;
            tmpScore2 += this.scores[i].pkt2;
        }
        this.teamOneScore = tmpScore1;
        this.teamTwoScore = tmpScore2;
    }

    revertBomb(){
        if(this.gameCountWhenUseOneBomb === this.scores.length)
            this.teamOneBomb = false;
        if(this.gameCountWhenUseTwoBomb === this.scores.length)
            this.teamTwoBomb = false;    
    }

    useTeamOneBomb(){
        this.teamOneBomb = true;
        this.teamOnePkt = 0;
        this.teamTwoPkt = 60;
        this.gameCountWhenUseOneBomb = this.scores.length;
        this.pushToScoresAndAddToScore();
    }

    useTeamTwoBomb(){
        this.teamTwoBomb = true;
        this.teamOnePkt = 60;
        this.teamTwoPkt = 0;
        this.gameCountWhenUseTwoBomb = this.scores.length;
        this.pushToScoresAndAddToScore();
    }

}