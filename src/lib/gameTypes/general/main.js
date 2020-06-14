import React from 'react';
import {ListItem, Input} from 'react-onsenui';

class GameGeneralMain {
    name = "Allgemein";
    key = "general";
    scoreMax = 0;
    inputScore = '';
    delaerNow = 0;


    getDealer(players, round) {
        return round % players.length;
    }
    isDealer(players, round, playerIndex) {
        if(playerIndex === this.getDealer(players, round)) {
            return true;
        }
        return false;
    }
    
    getBeginner(players, round) {
        let dealer = this.getDealer(players, round);
        dealer++;
        if(players.length <= dealer) {
            return 0;
        }
        return dealer;
    }

    defaultScore() {
        return 0;
    }

    storeSettings() {
        this.scoreMax = parseInt(document.getElementById('scoreMax').value);
    }

    checkSettings() {
        let errors = {};
        if(this.scoreMax === 0 || isNaN(this.scoreMax)) {
            errors.scoreMax = "Keine Gesamtpunktzahl angeben";
        }
        return errors;
    }

    setSettings(settings) {
        this.scoreMax = settings.scoreMax;
    }

    getSettings() {
        let obj = {};
        obj.scoreMax = this.scoreMax;

        return obj;
    }

    isGameFinish(players) {
        for(let player of players) {
            if(this.calculateSum(player) >= this.scoreMax) {
                return true;
            }
        }
        return false;
    }

    isRoundFinish(round, roundNow, players) {
        if(round >= roundNow-1) {
            return false;
        }
        for(let player of players) {
            if(player.score[round] !== 0) {
                return true;
            }
        }
        return false;
    }

    getRanglist(players) {
        let rangList = [];
        for(let player of players) {
            let newRang = {player: player, sum: this.calculateSum(player)};
            let i = 0;
            while(i < rangList.length) {
                if(rangList[i].sum < newRang.sum) {
                    break;
                }
                i++;
            }
            rangList.splice(i, 0, newRang);
        }
        return rangList;
    }

    displayCreateOptions() {
        return (
            <ListItem>
                <div className="center">
                    <label style={{paddingRight: '10px', width: '35%', textAlign: 'left', fontWeight: 'bold'}}>Maximale Punktzahl: </label>
                    <Input id="scoreMax"
                        style={{width: '60%'}}/>
                </div>
            </ListItem>
        );
    }

    loadScoreForm(player, round) {
        this.inputScore = player.score[round];
    }
    
    storeScoreForm() {
        return parseFloat(this.inputScore);
    }

    focusScoreForm() {
        document.getElementById("formScore")._input.select();
    }

    displayScoreForm() {
        return (
            <>
                <label style={{textAlign: 'right', fontWeight: 'bold'}}>Punktestand: </label>
                <Input id="formScore" 
                        placeholder='Punktestand' 
                        value={this.inputScore} string
                        onChange={(event) => { this.inputScore = event.target.value }}
                />
            </>
        );
    }

    displayScore(score) {
        return score;
    }

    displayRound(round) {
        return (round+1);
    }

    displayScoreNumber(score) {
        return score;
    }

    calculateSum(player) {
        let sum = 0;
        for(let score of player.score) {
            sum = sum + score;
        }
        return sum;
    }

    displaySum(player) {
        return this.calculateSum(player);
    }

    repeatGame(game) {
        let players = game.players.players;
        let winner = game.gameType.getRanglist(game.players.players)[0];
        let winnerIndex = 0;
        for(let i=0; i<players.length; i++) {
            if(players[i] === winner.player) {
                winnerIndex = i;
            }
            game.players.players[i].score = [];
        }
        for(let i=0; i<winnerIndex; i++) {
            players.push(players.shift());
        }
        let newName = game.name.split("#");
        let gameNumber = parseInt(newName.slice(-1));
        if(isNaN(gameNumber)) {
            gameNumber = 1;
        }
        let gameName = newName.join("#")+" ";
        if(newName.length > 1) {
            gameName = newName.slice(0, -1).join('#');
        }
        game.name = gameName + '#'+(++gameNumber); 
        game.round = 0;
        game.status = "CREATE"
        game.id = -1;
        game.start = new Date();
        game.end = null;
        game.store();
        return game;
    }
    
}

export default GameGeneralMain;