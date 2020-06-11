import Store from "../store/store";


class Player {
    constructor(name) {
        this.id = -1;
        this.name = name;
        this.score = [];
        this.scoreRangHistory = [];
    }

    store() {
        let store = new Store("players");
        let id = store.store({id: this.id, name: this.name, scoreRangHistory: this.scoreRangHistory});
        this.id = id;
    }

    restore() {
        let store = new Store("players");
        let data = store.restoreById(this.id);
        if(Object.keys(data) === 0) {
            return false;
        }
        this.name = data.name;
        this.scoreRangHistory = data.scoreRangHistory;
        return true;
    }

    getRangsByGameTypeKey(gameType) {
        let rangs = [];
        for(let history of this.scoreRangHistory) {
            if(history.gameType === gameType) {
                rangs.push(history.rang);
            }
        }
        return rangs;
    }

    getPlayedGameTypes() {
        let gameTypes = [];
        for(let history of this.scoreRangHistory) {
            if(!gameTypes.includes(history.gameType)) {
                gameTypes.push(history.gameType);
            }
        }
        return gameTypes;
    }

    displayName() {
        return (
            this.name
        );
    }
}

export default Player;