import React from 'react';

import GameNewCreate from '../game/new/create';
import GameAllOpen from '../game/all/open';
import PlayerBestlistOpen from '../player/bestlist/open';

import {Toolbar, ToolbarButton, Icon} from 'react-onsenui';

class MainView extends React.Component {
    handleMenuClick() {
        document.querySelector('#menu').open();
    }
    render() {
        return (
            <ons-page> 
                <Toolbar>
                    <div className="center">Willkommen</div>
                    <div className="right">
                        <ToolbarButton onClick={this.handleMenuClick}>
                            <Icon icon="md-menu"></Icon>
                        </ToolbarButton>
                    </div>
                </Toolbar>
                    <div style={{textAlign: 'center', marginTop: '150px'}}>
                    <GameNewCreate page={this} />
                    <div style={{marginTop: '30px'}}></div>
                    <GameAllOpen page={this} />
                    <div style={{marginTop: '30px'}}></div>
                    <PlayerBestlistOpen page={this} />
                </div>
            </ons-page>
        )
    }
}

export default MainView;