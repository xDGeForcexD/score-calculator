import React from 'react';
import {Button} from 'react-onsenui';
import PlayerBestlistView from './view';

class PlayerBestlistOpen extends React.Component {
    handleOnClick() {
        this.props.page.props.navigator.pushPage({component: PlayerBestlistView});

    }
    render() {
        return (
            <Button onClick={this.handleOnClick.bind(this)}>
                Bestenliste öffnen
            </Button>
        );
    }
}

export default PlayerBestlistOpen;