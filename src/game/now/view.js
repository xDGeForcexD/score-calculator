import React from 'react';

import {Toolbar, ToolbarButton, BottomToolbar, Icon, AlertDialog, Modal} from 'react-onsenui';
import Player from '../../lib/players/player';
import ScoreSummary from './scoreSummary';

const ons = require("onsenui");

class GameNowView extends React.Component {
    constructor(props) {
        super(props);
        this.game = props.game;
        this.state = {round: this.game.round, scoreUpdate: false, status: this.game.status, ranglistShow: false, dialogScoreEdit: false, windowChange: false};
        this.dialogScoreEdit = {title: '', player: new Player(), round: 0};
        this.dialogRepeat = {beginner: -1, playerNext: -1, roundNow: -1, repeat: false};
        this.scoreTBody = React.createRef();
        this.divSummary = React.createRef();
        this.windowHeight = React.createRef();
    }

    handleMenuClick() {
      document.querySelector('#menu').open();
    }

    handleNewScore() {
        let score = this.game.gameType.storeScoreForm();
        this.dialogScoreEdit.player.score[this.dialogScoreEdit.round] = score;
        if(!this.game.gameType.isGameFinish(this.game.players.players)) {
            this.game.status = "RUNNING";
        }
        this.game.store();
        this.setState({status: this.game.status, scoreUpdate: true, dialogScoreEdit: false});
        if(this.dialogRepeat.repeat) {
            this.handleChangeScore(this.game.players.players[this.dialogRepeat.playerNext],this.dialogRepeat.roundNow);
        }
    }

    handleChangeScore(player, round) {
        this.dialogScoreEdit.title = player.name;
        this.game.gameType.loadScoreForm(player, round);
        this.dialogScoreEdit.player = player;
        this.dialogScoreEdit.round = round;
        let playerIndex = this.game.players.players.indexOf(player);
        if(this.dialogRepeat.repeat) {
            this.dialogRepeat.playerNext = this.game.players.nextPlayerIndexByIndex(playerIndex);
            if(this.dialogRepeat.playerNext === this.dialogRepeat.beginner) {
                this.dialogRepeat.repeat = false;
            }
        } else if(playerIndex === this.game.gameType.getBeginner(this.game.players.players, round)) {
            this.dialogRepeat.repeat = true;
            this.dialogRepeat.roundNow = round;
            this.dialogRepeat.beginner = playerIndex;
            this.dialogRepeat.playerNext = this.game.players.nextPlayerIndexByIndex(playerIndex);
        }
        this.setState({dialogScoreEdit: true});
        this.game.gameType.focusScoreForm();
    }

    handleCloseScore() {
        this.dialogRepeat.repeat = false;
        this.setState({dialogScoreEdit: false});
    }

    handleRangList() {
        this.setState({ranglistShow: true});
    }

    handleAddRound() {
        if(this.game.gameType.isGameFinish(this.game.players.players)) {
            this.game.finishing();
            this.setState({status: this.game.status, ranglistShow: true});
        } else {
            this.game.status = "RUNNING";
            for(let player of this.game.players.players) {
                player.score.push(this.game.gameType.defaultScore());
            }
            this.game.round++;
            this.game.store();
            this.dialogRepeat.dealer = this.game.gameType.getDealer(this.game.players.players, this.game.round);
            this.setState({round: this.game.round});
        }
    }

    handleNewGame() {
        this.game = this.game.gameType.repeatGame(this.game);
        this.setState({round: this.game.round, scoreUpdate: false, status: this.game.status});
    }

    handleRanglistClose(event) {
        if (!this.divSummary.current.contains(event.target)){
            this.setState({ranglistShow: false});
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions.bind(this));
        this.updateDimensions();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions.bind(this));
    }

    updateDimensions () {
        this.setState({windowChange: true});
        let height = this.windowHeight.current.scrollHeight;
        let width = this.windowHeight.current.scrollWidth;
        this.scoreTBody.current.style.height = (height-200)+"px";
        if(ons.platform.isIPhoneX() && height > width) {
            this.scoreTBody.current.style.height = (height-265)+"px";
        }
    }

    renderScore() {
        let render = [];
        let renderLoop = [];
        renderLoop.push(<th></th>)
        for(let player of this.game.players.players) {
            renderLoop.push(<th>{player.displayName()}</th>)
        }
        render.push(<thead><tr>{renderLoop}</tr></thead>);
        let renderBody = [];
        for(let i=0; i<this.game.round; i++) {
            let j = 0;
            renderLoop = [];
            renderLoop.push(<td class="scoreTableHead">{this.game.gameType.displayRound(i)}</td>);
            for(let player of this.game.players.players) {
                let styleClass = "";
                if(this.game.gameType.isDealer(this.game.players.players, i, j)) {
                    styleClass = "dealer";
                }
                renderLoop.push(<td class={styleClass} verticalAlign="center" onClick={((e) => this.handleChangeScore(player, i))} >{this.game.gameType.displayScore(player.score[i])}</td>);
                j++;
            }
            renderBody.push(<tr>{renderLoop}</tr>);
        }
        renderLoop = [];
        renderLoop.push(<td class="scoreTableHead" verticalAlign="center">Gesamt</td>)
        for(let player of this.game.players.players) {
            renderLoop.push(<td class="scoreTableSum" verticalAlign="center">{this.game.gameType.displaySum(player)}</td>)
        }
        render.push(<tbody ref={this.scoreTBody}>{renderBody}<tr>{renderLoop}</tr></tbody>);
        return render;
    }

    render() {
        let roundButton = {};
        if(this.game.status === "FINISH") {
            roundButton = (
                            <>
                                <ToolbarButton onClick={this.handleNewGame.bind(this)}>
                                    <Icon icon="md-replay" size={32}></Icon>
                                </ToolbarButton>
                            </>
                            );
            
        } else {
            roundButton = (
                            <>
                                <ToolbarButton onClick={this.handleAddRound.bind(this)}>
                                    <Icon icon="md-plus" size={32}></Icon>
                                </ToolbarButton>
                            </>
                            );
        }
        return (
            <ons-page ref={this.windowHeight}>
                <AlertDialog id="dialogNewScore" modifier="rowfooter" isOpen={this.state.dialogScoreEdit} onCancel={this.handleCloseScore.bind(this)}>
                    <div className="alert-dialog-title">Score: {this.dialogScoreEdit.title}</div>
                    <div className="alert-dialog-content">
                        {this.game.gameType.displayScoreForm()}
                    </div>
                    <div class="alert-dialog-footer">
                        <button class="alert-dialog-button" onClick={this.handleCloseScore.bind(this)}>Abbrechen</button>
                        <button class="alert-dialog-button" onClick={this.handleNewScore.bind(this)}>Ändern</button>
                    </div>
                </AlertDialog>
                <Modal isOpen={this.state.ranglistShow} animation="fade" onClick={this.handleRanglistClose.bind(this)}>
                    <ScoreSummary game={this.game} refVar={this.divSummary}></ScoreSummary>
                </Modal>
                <Toolbar id="game-new-view-toolbar">
                    <div className="center">Spiel: {this.game.name}</div>
                    <div className="right">
                        <ToolbarButton onClick={this.handleMenuClick}>
                            <Icon icon="md-menu"></Icon>
                        </ToolbarButton>
                    </div>
                </Toolbar>
                <table className="scoreTable">
                    {this.renderScore()}
                </table>
                <BottomToolbar style={{textAlign: "center", paddingTop: "5px"}}>
                    <div className="left">
                    </div>
                    <div className="center">
                        <ToolbarButton onClick={this.handleRangList.bind(this)}>
                            <Icon icon="fa-award" size={25}></Icon>
                        </ToolbarButton>
                        {roundButton}
                    </div>
                    
                </BottomToolbar>
            </ons-page>
        );
    }
}

export default GameNowView;