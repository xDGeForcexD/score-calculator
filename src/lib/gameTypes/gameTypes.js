import GameType1 from './general/main.js';
import GameType2 from './rage/main.js';

class GameTypes {

    constructor() {
        this.games = [];
        this.games.push(new GameType1());
        this.games.push(new GameType2());
    }

    setForm(form) {
        this.games.forEach(function(game) {
            game.form = form;
        });
    }

    getGameType(key) {
        for(let game of this.games) {
            if (game.key === key) {
                return game;
            }
        }
    }

    availableGameTypes() {
        let gameNames = {};
        this.games.forEach(function(game) {
            gameNames[game.key] = game.name;
        });
        return gameNames;
    }
}

export default GameTypes;