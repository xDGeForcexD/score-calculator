import React from 'react';

import {Toolbar, ToolbarButton, Icon, List, ListHeader, ListItem, Input, Select, Button} from 'react-onsenui';
import DatePicker from 'react-datepicker';

import Players from '../../lib/players/players';
import GameTypes from '../../lib/gameTypes/gameTypes';
import History from '../../lib/history/history';

class PlayerBestlistView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {filterGameType: '', filterStart: null, filterEnd: null};
        this.gameTypes = new GameTypes();
        this.history = new History();
        this.inputFilterStart = React.createRef();
        this.inputFilterEnd = React.createRef();
    }

    handleMenuClick() {
        document.querySelector('#menu').open();
    }

    handleGameTypeSelect(event) {
        console.log(this);
        console.log(event.target.value);
        this.setState({filterGameType: event.target.value});
        //this.setState({filterGameType: event.target.value});
    }

    arrangePlayer(players) {
        let arrangedPlayers = {};
        for(let player of players) {
            for(let gameType of player.getPlayedGameTypes()) {
                if(!(gameType in arrangedPlayers)) {
                    arrangedPlayers[gameType] = [];
                }
                let rangFirst = 0;
                for(let rang of player.getRangsByGameTypeKey(gameType)) {
                    if(rang === 1) {
                        rangFirst++;
                    }
                }
                let i = 0;
                for(let checkPlayer of arrangedPlayers[gameType]) {
                    if(checkPlayer.cnt < rangFirst) {
                        break;
                    }
                    i++;
                }
                arrangedPlayers[gameType].splice(i, 0, {player: player, cnt: rangFirst});
            }
        }
        return arrangedPlayers;
    }

    formateDate(date) {
        if(date === null) {
            return;
        }
        function addZero(number) {
            if(number < 10) {
                return "0"+number;
            }
            return number;
        }
        return addZero(date.getDate())+"."+addZero(date.getMonth()+1)+"."+date.getFullYear()+" - "+addZero(date.getHours())+":"+addZero(date.getMinutes());
    }

    renderPlayers() {
        let render = [];
        if(this.state.filterGameType !== '') {
            let data = this.history.ranglistByTimerangeAndGametype(this.state.filterStart, this.state.filterEnd, this.state.filterGameType);
            for(let rang = 0; rang<data.length; rang++) {
                render.push(
                    <ListItem>
                        <div className="left"></div>
                        <div className="center">{(rang+1)+". "+data[rang].player.name+" ("+data[rang].cnt+")"}</div>
                        <div className="right"></div>
                    </ListItem>
                );
            }
        } else {
            let players = new Players();
            let gameTypes = new GameTypes();
            let playersHistory = this.arrangePlayer(players.getPlayersFromStorage());
            for(let gameType in playersHistory) {
                render.push(<ListHeader>{gameTypes.getGameType(gameType).name}</ListHeader>);
                for(let rang = 0; rang<playersHistory[gameType].length; rang++) {
                    render.push(
                        <ListItem>
                            <div className="left"></div>
                            <div className="center">{(rang+1)+". "+playersHistory[gameType][rang].player.name+" ("+playersHistory[gameType][rang].cnt+")"}</div>
                            <div className="right"></div>
                        </ListItem>
                    );
                }
            }
        }
        
        if(render.length === 0) {
            render.push(
                <ListItem>
                     <div className="left"></div>
                    <div className="center">Keine Bestenliste gefunden!</div>
                    <div className="right"></div>
                </ListItem>
            );
        }
        return (
            <List modifier="inset">
                {render}
            </List>
        );
    }

    renderFilterSettings() {
        let gameTypes = this.gameTypes.availableGameTypes();
        let renderTypes = [];
        for(let gameTypeKey in gameTypes) {
            renderTypes.push(<option value={gameTypeKey}>{gameTypes[gameTypeKey]}</option>)
        }

        let DateButton = ({ value, onClick }) => (
            <Button onClick={onClick}>
                <Icon icon="md-calendar" size={24}></Icon>
            </Button>
          );

        return (
            <>
                <ListItem>
                    <div className="center">
                        <label>Gametype: </label>
                        <Select
                                value={this.state.filterGameType}
                                onChange={this.handleGameTypeSelect.bind(this)}>
                                {renderTypes}
                        </Select>
                    </div>
                </ListItem>
                <ListItem>
                    <label>Start: </label>
                    <Input readonly onClick={() => this.inputFilterStart.current.setOpen(true)} value={this.formateDate(this.state.filterStart)}></Input>
                    <DatePicker showTimeSelect 
                        ref={this.inputFilterStart}
                        selected={this.state.filterStart} 
                        maxDate={new Date()} 
                        onChange={date => {console.log(this); this.setState({filterStart: new Date(date)})}}
                        dateFormat="dd/MM/yyyy - hh:mm"
                        customInput={<DateButton />}
                        withPortal
                    />
                </ListItem>
                <ListItem>
                    <label>Ende: </label>
                    <Input readonly onClick={() => this.inputFilterEnd.current.setOpen(true)} value={this.formateDate(this.state.filterEnd)}></Input>
                    <DatePicker showTimeSelect 
                        ref={this.inputFilterEnd}
                        selected={this.state.filterEnd} 
                        maxDate={new Date()} 
                        onChange={date => this.setState({filterEnd: new Date(date)})}
                        dateFormat="dd/MM/yyyy - hh:mm"
                        customInput={<DateButton />}
                        withPortal
                    />
                </ListItem>
            </>
        );
    }

    render () {
        return (
            <ons-page>
                <Toolbar id="game-all-view-toolbar">
                    <div className="center">Bestenliste</div>
                    <div className="right">
                        <ToolbarButton onClick={this.handleMenuClick}>
                            <Icon icon="md-menu"></Icon>
                        </ToolbarButton>
                    </div>
                </Toolbar>
                <List>
                    <ListHeader>Filter</ListHeader>
                    {this.renderFilterSettings()}
                    <ListHeader>Ergebnis</ListHeader>
                </List>
                <br />
                {this.renderPlayers()}
            </ons-page>
        );
    }
}

export default PlayerBestlistView;



