import React from 'react';
import {Button} from 'react-onsenui';
import GameAllView from './view';

class GameAllOpen extends React.Component {
    handleOnClick() {
        this.props.page.props.navigator.pushPage({component: GameAllView});

    }
    render() {
        return (
            <Button onClick={this.handleOnClick.bind(this)}>
                Alle Spiele anzeigen
            </Button>
        );
    }
}

export default GameAllOpen;