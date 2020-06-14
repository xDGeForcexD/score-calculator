import GameGeneralMain from "../gameTypes/general/main";
import Players from "../players/players";
import GameTypes from "../gameTypes/gameTypes";
import Store from "../store/store";

class Game {
    constructor() {
        this.stored = false;
        this.id = -1;
        this.name = '';
        this.round = 0;
        this.start = new Date();
        this.end = null;
        this.status = "UNKNOW";
        this.gameType = new GameGeneralMain();
        this.players = new Players();
    }

    store() {
        let storeObj = {};
        storeObj.id = this.id;
        storeObj.name = this.name;
        storeObj.status = this.status;
        storeObj.start = this.start;
        storeObj.end = this.end;
        storeObj.round = this.round;
        storeObj.gameType = this.gameType.key;
        storeObj.gameTypeSettings = this.gameType.getSettings();
        storeObj.players = [];
        for(let player of this.players.players) {
            storeObj.players.push({id: player.id, score: player.score})
        }
        let store = new Store("games");
        this.id = store.store(storeObj);
        this.stored = true;
    }   
    
    restore() {
        let store =  new Store("games");
        let game = store.restoreById(this.id);
        if(Object.keys(game).length === 0) {
            this.stored = false;
            return false;
        }
        this.mapper(game);
        return true;
    }

    mapper(game) {
        this.name = game.name;
        this.round = game.round;
        this.status = game.status;
        this.start = new Date(game.start);
        this.end = (game.end === null ? null : new Date(game.end));
        let gameTypes = new GameTypes();
        this.gameType = gameTypes.getGameType(game.gameType);
        this.gameType.setSettings(game.gameTypeSettings);
        let players = new Players();
        let i = 0;
        for(let player of game.players) {
            players.addPlayer("");
            players.players[i].id = player.id;
            players.players[i].restore();
            players.players[i].score = player.score;
            i++;
        }
        this.players = players;
    }
    
    finishing() {
        if(this.end === null) {
            this.status = "FINISH";
            this.end = new Date();
            let ranglist = this.gameType.getRanglist(this.players.players);
            let i = 1;
            for(let rang of ranglist) {
                rang.player.scoreRangHistory.push({gameType: this.gameType.key, rang: i, ts: this.end});
                rang.player.store();
                i++;
            }
            this.store();
        }
    }

    isGameEditAvailable() {
        if(this.status === "FINISH" && this.end.getTime() < (new Date()).getTime()-(10*60*1000)) {
            return false;
        }
        return true;
    }

}

export default Game;