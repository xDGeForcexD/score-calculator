import Store from "../store/store";
import Game from "./game";



class Games {

    constructor() {
        this.games = this.loadAllGames();
    }

    deleteById(id) {
        let store = new Store("games");
        if(store.deleteById(id)) {
            this.loadAllGames();
            return true;
        }
    }

    loadAllGames() {
        this.games = [];
        let store = new Store("games");
        for(let game of store.restoreAll().reverse()) {
            let gameInstance = new Game();
            gameInstance.id = game.id;
            gameInstance.mapper(game);
            this.games.push(gameInstance);
        }
        return this.games;
    }
}

export default Games;