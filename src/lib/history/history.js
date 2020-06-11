import Games from "../game/games";

class History {

    constructor() {
        this.games = new Games();
        this.games.loadAllGames();
    }

    ranglistByTimerange(start, end) {
        return this.ranglistByTimerangeAndGametype(start, end, null);
    }

    ranglistByTimerangeAndGametype(start, end, gametype) {
        let ranglists = [];
        for(let game of this.games.games) {
            if(game.status === "FINISH") {
                if(gametype === null || game.gameType.key === gametype) {
                    if(game.end >= start && (game.end <= end || end == null)) {
                        ranglists.push(game.gameType.getRanglist(game.players.players));
                    }
                }
            }
        }
        return this._sortWinners(this._parseWinners(ranglists))
    }

    _parseWinners(ranglists) {
        let winners = [];
        for(let ranglist of ranglists) {
            let winnerFound = false;
            for(let i = 0; i<winners.length; i++) {
                if(winners[i].player.id === ranglist[0].player.id) {
                    winners[i].cnt++
                    winnerFound = true;
                    break;
                }
            }
            if(!winnerFound) {
                winners.push({player: ranglist[0].player, cnt: 1});
            }
        }
        return winners;
    }

    _sortWinners(winners) {
        let bestlist = [];
        for(let winner of winners) {
            let i = 0;
            while(i < bestlist.length) {
                if(bestlist[i].cnt < winner.cnt) {
                    break;
                }
                i++;
            }
            bestlist.splice(i, 0, winner);
        }

        return bestlist;
    }
}

export default History;