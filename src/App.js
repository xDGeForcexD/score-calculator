import React from 'react';
import './App.css';

import {Splitter, SplitterSide, SplitterContent, Navigator, List, ListHeader, ListItem, Icon} from 'react-onsenui';

import packageJson from '../package.json';
import buildNumber from './buildnumber.json';

import MainView from './main/view';
import GameAllView from './game/all/view';
import GameNewView from './game/new/view';
import PlayerBestlistView from './player/bestlist/view';

const ons = require("onsenui");

class App extends React.Component{

  constructor(props) {
    super(props);
    this.navigator = {};
  }

  handleNewGame() {
    document.querySelector('#menu').close();
    this.navigator.pushPage({component: GameNewView});
  }

  handeNowGame() {
    
  }

  handleMenu(component) {
    document.querySelector('#menu').close();
    this.navigator.pushPage({component: component});
  }

  handleAllGame() {
    document.querySelector('#menu').close();
    this.navigator.pushPage({component: GameAllView});
  }


  renderPage(route, navigator) {
    const props = route.props || {};
    props.navigator = this.navigator = navigator;

    return React.createElement(route.component, props);
  }

  componentWillMount() {
    const html = document.documentElement;
    if (ons.platform.isIPhoneX()) {
      html.setAttribute('onsflag-iphonex-portrait', '');
      html.setAttribute('onsflag-iphonex-landscape', '');
    }
  }
  

  render() {
    return (
      <Splitter>
        <SplitterSide
          side="right"
          //width={window.innerWidth > 400 ? '300px' : '100%'}
          width='250px'
          id="menu" 
          collapse>
            <ons-page>
              <List>
                <ListHeader>
                  Hauptmenü
                </ListHeader>
                <ListItem modifier="chevron" tappable onClick={() => this.handleMenu(GameNewView)}>
                  <div className="left">
                    <Icon icon="md-file-plus"></Icon>
                  </div>
                  <div className="center">Neues Spiel starten</div>
                </ListItem>
                <ListItem modifier="chevron" tappable onClick={() => this.handleMenu(GameAllView)}>
                  <div className="left">
                    <Icon icon="md-view-list-alt"></Icon>
                  </div>
                  <div className="center">Alle Spiele anzeigen</div>
                </ListItem>
                <ListItem modifier="chevron" tappable onClick={() => this.handleMenu(PlayerBestlistView)}>
                  <div className="left">
                    <Icon icon="md-equalizer"></Icon>
                  </div>
                  <div className="center">Bestenliste</div>
                </ListItem>
              </List>
              <div className="menuVersion">
                Version: {packageJson.version} #{buildNumber.build}
              </div>
            </ons-page>
        </SplitterSide>
        <SplitterContent>
          <Navigator id="navigator"
            initialRoute={{component: MainView}} 
            renderPage={this.renderPage.bind(this)}
            />
        </SplitterContent>
      </Splitter>
    );
  }
}

export default App;
