import React from 'react';
import {Toolbar, ToolbarButton, Icon, List, ListHeader, ListItem, Button} from 'react-onsenui';
import Games from '../../lib/game/games';
import GameNowView from '../now/view';



class GameAllView extends React.Component {
    constructor(props) {
        super(props);
        this.games = new Games();
        this.state = {editGames: false, gamesCnt: this.games.games.length};
    }
    
    handleMenuClick() {
      document.querySelector('#menu').open();
    }

    handleViewGame(e, game) {
        this.props.navigator.pushPage({component: GameNowView, props: {game: game}});
        
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

    renderGames() {
        let render = [];
        let listItemsNew = [];
        let listItemsRun = [];
        let listItemsFinish = [];
        for(let game of this.games.games) {
            let entry = (

                <ListItem modifier={!this.state.editGames ? "chevron" : ""} tappable onClick={((e) => !this.state.editGames ? this.handleViewGame(e, game) : '')}>
                    <div className="center">
                        <span class="list-item__title">{game.name}</span>
                        <span class="list-item__subtitle">
                            {game.end === null ? "erstellt am: "+this.formateDate(game.start) : "gespielt am: "+this.formateDate(game.end)} 
                            <br />
                            Spieltype: {game.gameType.name}
                            &nbsp;|
                            Runde: {game.round}
                            <br /> 
                            Spieleranzahl: {game.players.players.length}
                        </span>
                    </div> 
                    <div className="right">
                    {this.state.editGames ? <Button style={{background: "#c20606"}} onClick={function() {this.games.deleteById(game.id); this.setState({gamesCnt: this.games.games.length-1})}.bind(this)}><Icon icon="md-delete" size={24}></Icon></Button> : ""}
                    </div>           
                </ListItem>
            );
            switch(game.status) {
                default:
                    listItemsNew.push(entry);
                    break;
                case "RUNNING":
                    listItemsRun.push(entry);
                    break;
                case "FINISH":
                    listItemsFinish.push(entry);
                    break;
            }
        }

        if(listItemsNew.length > 0) {
            render.push(<ListHeader>Neu erstellte Spiele</ListHeader>);
            render = render.concat(listItemsNew);
        }

        if(listItemsRun.length > 0) {
            render.push(<ListHeader>Laufende Spiele</ListHeader>);
            render = render.concat(listItemsRun);
        }
        
        if(listItemsFinish.length > 0) {
            render.push(<ListHeader>Abgeschlossene Spiele</ListHeader>);
            render = render.concat(listItemsFinish);
        }
        
        return (render);
    }

    render() {
        return (
            <ons-page>
                <Toolbar id="game-all-view-toolbar">
                    <div className="left">
                        <ToolbarButton onClick={() => this.setState({editGames: !this.state.editGames})}>
                            <Icon icon="md-edit"></Icon>
                        </ToolbarButton>
                    </div>
                    <div className="center">Alle Spiele</div>
                    <div className="right">
                        <ToolbarButton onClick={this.handleMenuClick}>
                            <Icon icon="md-menu"></Icon>
                        </ToolbarButton>
                    </div>
                </Toolbar>
                <List id="new-form-list">
                    {this.renderGames()}
                </List>
            </ons-page>
        );
    }
}

export default GameAllView;