import React from 'react';
import {Icon} from 'react-onsenui';

import GameGeneralMain from "../general/main";
import './style.css';

class GameRageMain extends GameGeneralMain {
    name = "Rage";
    key = "rage";
    inputScore = {stichSay: null, stichIs: null, bonus: null, round: 0};

    constructor() {
        super();
        this.inputStichSay = React.createRef();
        this.inputStichIs = React.createRef();
        this.inputBonus = React.createRef();
        this.partStichIs = React.createRef();
        this.partBonus = React.createRef();
    }
    
    defaultScore() {
        return {stichSay: null, stichIs: null, bonus: null, score: null};
    }

    storeSettings() {
    }

    checkSettings() {
        return {};
    }

    setSettings(settings) {
    }

    getSettings() {
        return {};
    }

    isGameFinish(players) {
        if(players[0].score.length === 10) {
            return true
        }
        return false;
    }

    displayCreateOptions() {
        return "";
    }

    loadScoreForm(player, round) {
        this.partStichIs.current.style.display = "none";
        this.partBonus.current.style.display = "none";
        this.inputScore.stichSay = player.score[round].stichSay;
        if(isNaN(this.inputScore.stichSay) || this.inputScore.stichSay === null) {
            this.inputScore.stichSay = 0;
        } else {
            this.partStichIs.current.style.display = "block";
        }
        this.inputStichSay.current.value = this.inputScore.stichSay;

        this.inputScore.stichIs = player.score[round].stichIs;
        if(isNaN(this.inputScore.stichIs) || this.inputScore.stichIs === null) {
            this.inputStichIs.current.value = 0;
            if(!isNaN(player.score[round].stichSay) && player.score[round].stichSay !== null) {
                this.inputScore.stichIs = 0;
            }
        } else {
            this.inputStichIs.current.value = this.inputScore.stichIs;
            if(this.inputScore.stichIs > 0) {
                this.partBonus.current.style.display = "block";
            }
        }

        this.inputScore.bonus = player.score[round].bonus;
        if(isNaN(this.inputScore.bonus) || this.inputScore.bonus === null) {
            this.inputBonus.current.value = 0;
        } else {
            this.inputBonus.current.value = this.inputScore.bonus;
        }
        
        this.inputScore.round = (10-round);
    }
    
    storeScoreForm() {
        let score = null;
        if(!isNaN(this.inputScore.stichIs) && this.inputScore.stichIs !== null) {
            if(this.inputScore.stichSay === this.inputScore.stichIs) {
                score = score + 10;
            } else {
                score = score - 5;
            }
            score = score + this.inputScore.stichIs;
            if(!isNaN(this.inputScore.bonus) && this.inputScore.bonus !== null) {
                score = score + this.inputScore.bonus;
            }
        }

        return {score: score, stichSay: this.inputScore.stichSay, stichIs: this.inputScore.stichIs, bonus: this.inputScore.bonus};
    }

    focusScoreForm() {
    }

    handleStiche(type, calc) {
        let value = 0;
        switch(type) {
            case "SAY":
                if(!isNaN(this.inputScore.stichSay)) {
                    value = this.inputScore.stichSay;
                }
                break;
            case "IS":
                if(!isNaN(this.inputScore.stichIs)) {
                    value = this.inputScore.stichIs;
                }
                break;
            default:
                return;
        }

        if(calc === "DEC") {
            value--;
        } else {
            value++;
        }
        if(value < 0) {
            value = 0;
        } else if(value > this.inputScore.round) {
            value = this.inputScore.round;
        }

        switch(type) {
            case "SAY":
                this.inputScore.stichSay = value;
                this.inputStichSay.current.value = value;
                break;
            case "IS":
                this.inputScore.stichIs = value;
                this.inputStichIs.current.value = value;
                break;
            default:
                return;
        }

        if(!isNaN(this.inputScore.stichSay) && this.inputScore.stichSay !== null) {
            this.partStichIs.current.style.display = "block";
        }

        if(this.inputScore.stichIs > 0) {
            this.partBonus.current.style.display = "block";
        } else {
            this.partBonus.current.style.display = "none";
        }
    }

    handleBonus(calc) {
        let value = this.inputScore.bonus;
        if(calc === "DEC") {
            value = value - 5;
        } else {
            value = value + 5;
        }
        this.inputScore.bonus = value;
        this.inputBonus.current.value = value;
    }

    displayScoreForm() {
        return (
            <>
                <label style={{textAlign: 'right', fontWeight: 'bold'}}>Stiche soll</label>
                <div className="formRageDecInc">
                    <button className="formRageDec" onClick={() => this.handleStiche("SAY","DEC")}>
                        <Icon icon="md-minus"></Icon>
                    </button>
                    <input className="formRageView" ref={this.inputStichSay} readOnly></input>
                    <button className="formRageInc" onClick={() => this.handleStiche("SAY","INC")}>
                        <Icon icon="md-plus"></Icon>
                    </button>
                    <div style={{clear: "both"}}></div>
                </div>
                <div ref={this.partStichIs}>
                    <label style={{textAlign: 'right', fontWeight: 'bold'}}>Stiche ist</label>
                    <div className="formRageDecInc">
                        <button className="formRageDec" onClick={() => this.handleStiche("IS","DEC")}>
                            <Icon icon="md-minus"></Icon>
                        </button>
                        <input className="formRageView" ref={this.inputStichIs}readOnly></input>
                        <button className="formRageInc" onClick={() => this.handleStiche("IS","INC")}>
                            <Icon icon="md-plus"></Icon>
                        </button>
                        <div style={{clear: "both"}}></div>
                    </div>
                </div>
                <div ref={this.partBonus}>
                    <label style={{textAlign: 'right', fontWeight: 'bold'}}>Bonus</label>
                    <div className="formRageDecInc">
                        <button className="formRageDec" onClick={() => this.handleBonus("DEC")}>
                            <Icon icon="md-minus"></Icon>
                        </button>
                        <input className="formRageView" ref={this.inputBonus} readOnly></input>
                        <button className="formRageInc" onClick={() => this.handleBonus("INC")}>
                            <Icon icon="md-plus"></Icon>
                        </button>
                        <div style={{clear: "both"}}></div>
                    </div>
                </div>
            </>
        );
    }

    displayScore(score) {
        return (
            <table className="gameRageTable">
                <tr>
                    <td rowSpan="2">{isNaN(score.stichIs) ? "-" : score.score}</td>
                    <td>{isNaN(score.stichSay) || score.stichSay == null ? "-" : score.stichSay}</td>
                    <td></td>
                </tr>
                <tr>
                    <td>{isNaN(score.stichIs) || score.stichIs == null ? "-" : score.stichIs}</td>
                    <td>{isNaN(score.bonus) || score.bonus == null ? "-" : score.bonus}</td>
                </tr>
            </table>
        );
    }

    displayScoreNumber(score) {
        return score.score;
    }

    displayRound(round) {
        return (10-round);
    }

    calculateSum(player) {
        let sum = 0;
        for(let score of player.score) {
            if(!isNaN(score.score)) {
                sum = sum + score.score;
            }
        }
        return sum;
    }
    
}

export default GameRageMain;