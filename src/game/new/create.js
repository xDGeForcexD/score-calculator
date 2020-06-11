import React from 'react';
import GameNewView from './view';
import {Button} from 'react-onsenui';

class GameNewCreate extends React.Component {
    handleOnClick() {
        this.props.page.props.navigator.pushPage({component: GameNewView});

    }
    render() {
        return (
            <Button onClick={this.handleOnClick.bind(this)}>
                Neues Spiel starten
            </Button>
        );
    }
}

export default GameNewCreate;
