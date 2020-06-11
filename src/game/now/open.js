import React from 'react';
import {Button} from 'react-onsenui';

class GameNowOpen extends React.Component {
    handleOnClick(event) {
        console.log("Aktuelles Spiel öffnen");
    }
    render() {
        return (
            <Button onClick={this.handleOnClick}>
                Aktuelles Spiel weiterspielen
            </Button>
        );
    }
}

export default GameNowOpen;