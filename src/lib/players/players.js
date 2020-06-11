import Player from "./player";
import Store from "../store/store";


class Players {
    constructor() {
        this.players = [];
    }

    addPlayer(name) {
        this.players.push(new Player(name));
    }

    nextPlayerIndexByIndex(indexNow) {
        indexNow++;
        if(this.players.length <= indexNow) {
            indexNow = 0;
        }
        return indexNow;
    }

    nextPlayerByIndex(indexNow) {
        return this.players[this.nextPlayerByIndex(indexNow)];
    }

    nextPlayerIndexByPlayer(player) {
        let indexNow = this.players.indexOf(player);
        return this.nextPlayerIndex(indexNow);
    }

    nextPlayerByPlayer(player) {
        return this.players[this.nextPlayerIndexByPlayer(player)];
    }

    getPlayersFromStorage() {
        let store = new Store("players");
        let players = [];
        for(let player of store.restoreAll()) {
            let playerInstance = new Player(player.name);
            playerInstance.id = player.id;
            playerInstance.scoreRangHistory = player.scoreRangHistory;
            players.push(playerInstance);
        }
        return players;
    }

    getPlayerByName(name) {
        let players = this.getPlayersFromStorage();
        for(let player of players) {
            if(player.name === name) {
                return player;
            }
        }
        return null;
    }

}

export default Players;