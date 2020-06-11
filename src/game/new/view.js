import React from 'react';
import GameTypes from '../../lib/gameTypes/gameTypes';
import {Toolbar, ToolbarButton, Icon, List, ListHeader, ListItem, Input, Select, Button, AlertDialog, Toast} from 'react-onsenui';
import { ReactSortable } from "react-sortablejs";
import GameNowView from '../now/view';
import Game from '../../lib/game/game';

class GameNewView extends React.Component {
    

    constructor(props) {
        super(props);
        this.state = {name: '', player: 0, gameType: '', dialogPlayer: false, newPlayerName: '', editPlayer: false, notificationShow: false, errors: {}};
        this.game = new Game();
        this.game.status = "CREATE";
        this.gameTypes = new GameTypes();
        this.sort = React.createRef();
        this.notification = (<div></div>);
    }
    
    handleMenuClick() {
      document.querySelector('#menu').open();
    }

    handlePlayersEdit() {
        this.setState({editPlayer: !this.state.editPlayer});
    }

    handlePlayerDialog(event) {
        this.setState({dialogPlayer: true});
        document.getElementById("inputNewPlayerName")._input.select();
        
    }

    handleGameTypeSelect(event) {
        this.game.gameType = this.gameTypes.getGameType(event.target.value);
        this.setState({gameType: event.target.value});
    }

    handlePlayerAdd(event) {
        if(this.state.newPlayerName !== "") {
            let playerSearch = this.game.players.getPlayerByName(this.state.newPlayerName);
            if(playerSearch === null) {
                this.game.players.addPlayer(this.state.newPlayerName);
                this.game.players.players[this.game.players.players.length-1].store();
            } else {
                this.game.players.players.push(playerSearch);
            }
            this.notification = (
                <div>Spieler hinzugefügt</div>
            );
            this.setState({notificationShow: true, player: this.game.players.players.length, playerList: this.game.players.players, newPlayerName: ""});
            this.timeout = setTimeout(function(context) {
                context.setState({notificationShow: false});
            }, 2000, this);
        }
    }

    handlePlayerAddFromDB(player) {
        this.game.players.players.push(player);
        this.notification = (
            <div>Spieler hinzugefügt</div>
        );
        this.setState({notificationShow: true, player: this.game.players.players.length, playerList: this.game.players.players, newPlayerName: ""});
        this.timeout = setTimeout(function(context) {
            context.setState({notificationShow: false});
        }, 2000, this);
    }

    handlePlayerDelete(player) {
        let index = this.game.players.players.indexOf(player);
        if(index !== -1) {
            this.game.players.players.splice(index, 1);
        }
        this.setState({player: this.game.players.players.length, playerList: this.game.players.players});
    }

    handleGameCreate() {
        let errors = {};
        if(this.state.name === "") {
            errors.name = "Kein Namen angeben";
        }
        if(this.state.gameType === "") {
            errors.gameType = "Kein Spieltyp angeben";
        }
        if(this.game.players.players.length === 0) {
            errors.players = "Keine Spieler angeben";
        }
        // CHECK GAME OPTIONALS
        this.game.gameType.storeSettings();
        let errorsOptional = this.game.gameType.checkSettings();
        errors = Object.assign({}, errors, errorsOptional);

        // SAVE
        if(Object.keys(errors).length === 0) {
            this.game.name = this.state.name;
            this.game.store();
            this.props.navigator.pushPage({component: GameNowView, props: {game: this.game}});
        } else {
            let htmlErros = [];
            for(let key in errors) {
                htmlErros.push(<li>{errors[key]}</li>);
            }
            this.notification = (
                <div>
                    Es sind folgende Fehler aufgetreten:
                    <ul>
                        {htmlErros}
                    </ul>
                </div>
            );
            this.setState({errors: errors, notificationShow: true});
            this.timeout = setTimeout(function(context) {
                context.setState({notificationShow: false});
            }, 5000, this);
        }
    }

    componentDidMount() {
        document.body._gestureDetector.dispose();
        //this.sortable = Sortable.create(this.sort.current);
    }

    renderGameTypes() {
        let gameTypes = this.gameTypes.availableGameTypes();
        let render = [];
        for(let gameTypeKey in gameTypes) {
            render.push(<option value={gameTypeKey}>{gameTypes[gameTypeKey]}</option>)
        }
        return render;
    }

    renderOptionals() {
        if(this.game) {
            return this.game.gameType.displayCreateOptions();
        }
    }




    renderPlayers() {
        return (
            <ReactSortable
                list={this.game.players.players}
                setList={newPlayers => {
                    this.game.players.players = newPlayers;
                    this.setState({player: this.game.players.players.length})
                }}
            >
                {this.game.players.players.map(player => (
                    <ListItem>
                        <div className="left"></div>
                        <div className="center">{player.name}</div>
                        <div className="right">{this.state.editPlayer ? <Icon icon="md-delete" onClick={() => this.handlePlayerDelete(player)}></Icon> : ''}</div>
                    </ListItem>
                ))}
            </ReactSortable>
        );
    }

    renderPlayerList() {
        let render = "";
        if(this.state.newPlayerName.length > 1) {
            let players = this.game.players.getPlayersFromStorage();
            if(players.length > 0) {
                let list = [];
                for(let player of players) {
                    let found = true;
                    for(let i = 0; i< this.state.newPlayerName.length; i++) {
                        if(this.state.newPlayerName.charAt(i) !== player.name.charAt(i)) {
                            found = false;
                            break;
                        }
                    
                    }
                    if(found) {
                        list.push(
                            <ListItem onClick={() => this.handlePlayerAddFromDB(player)}>
                                {player.name}
                            </ListItem>
                        );
                    }
                }

                if(list.length) {
                    render = (
                        <List>
                            <ListHeader>
                                gefundene Spieler
                            </ListHeader>
                            {list}
                        </List>
                    );
                }                
            }
        }
        return render;
    }

    render() {
        return (
            <ons-page>
                <Toast isOpen={this.state.notificationShow} animation="lift">
                    {this.notification}
                </Toast>
                <AlertDialog id="dialogAddPlayer" modifier="rowfooter" isOpen={this.state.dialogPlayer} onCancel={() => this.setState({dialogPlayer: false})}>
                    <div className="alert-dialog-title">Neuen Spieler erstellen</div>
                    <div className="alert-dialog-content">
                        <Input  id="inputNewPlayerName"
                                value={this.state.newPlayerName} string
                                onChange={(event) => { this.setState({newPlayerName: event.target.value})} }
                                placeholder='Spielername' />
                        <div className="playerList">
                            {this.renderPlayerList()}
                        </div>
                    </div>
                    <div class="alert-dialog-footer">
                        <button class="alert-dialog-button" onClick={() => this.setState({dialogPlayer: false})}>Abbrechen</button>
                        <button class="alert-dialog-button" onClick={this.handlePlayerAdd.bind(this)}>Hinzufügen</button>
                    </div>
                </AlertDialog>
                <Toolbar id="game-new-view-toolbar">
                    <div className="center">Neues Spiel erstellen</div>
                    <div className="right">
                        <ToolbarButton onClick={this.handleMenuClick}>
                            <Icon icon="md-menu"></Icon>
                        </ToolbarButton>
                    </div>
                </Toolbar>
                <List id="new-form-list">
                    <ListHeader style={{fontSize: 15}}>Allgemein</ListHeader>
                    <ListItem>
                        <div className="center">
                            <label style={{paddingRight: '10px', width: '35%', textAlign: 'left', fontWeight: 'bold'}}>Name: </label>
                            <Input 
                                className={(('name' in this.state.errors) ? 'inputError' : '')}
                                style={{width: '60%'}}
                                value={this.state.name} string
                                onChange={(event) => { this.setState({name: event.target.value})} } />
                        </div>
                    </ListItem>
                    <ListItem>
                        <div className="center" style={{width: '80%'}}>
                            <label style={{paddingRight: '10px', width: '35%', textAlign: 'left', fontWeight: 'bold'}}>Spiel: </label>
                            <Select
                                className={(('gameType' in this.state.errors) ? 'inputError' : '')}
                                style={{width: '60%'}}
                                value={this.state.gameType}
                                onChange={this.handleGameTypeSelect.bind(this)}>
                                {this.renderGameTypes()}
                            </Select>
                        </div>
                    </ListItem>
                    {this.renderOptionals()}
                    <ListHeader style={{fontSize: 15, height: "30px"}} className={(('players' in this.state.errors) ? 'inputError' : '')}>
                        <div style={{float: "left"}}>
                            Spieler
                        </div>
                        <div style={{float: "right", padding: "5px 10px 0 0"}}>
                            <Icon icon="md-edit" size={24} onClick={this.handlePlayersEdit.bind(this)}></Icon>
                        </div>
                    </ListHeader>
                    {this.renderPlayers()}
                    <ListItem>
                        <div className="center">
                            <Button modifier="quiet"
                                onClick={this.handlePlayerDialog.bind(this)}>
                                    Neuen Spieler hinzufügen
                            </Button>
                        </div>
                    </ListItem>
                </List>
                <div style={{textAlign: "center", paddingTop: "10px"}}>
                    <Button onClick={this.handleGameCreate.bind(this)}>Spiel starten</Button>
                </div>
            </ons-page>
        );
    }
}

export default GameNewView;
