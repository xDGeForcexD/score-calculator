import React from 'react';
import Ranglist from './ranglist';
import ScoreChart from './scoreChart';
import { Icon } from 'react-onsenui';



class ScoreSummary extends React.Component {

    constructor(props) {
        super(props);
        this.game = props.game;
        this.state = {show: "RANGLIST"};
    }

    render() {
        let title = "";
        let show = null;
        switch(this.state.show) {
            default:
            case "RANGLIST":
                title = "Ranglist";
                show = (
                    <Ranglist game={this.game}></Ranglist>
                );
            break;
            case "CHART":
                title = "Punkteverlauf";
                show = (
                    <ScoreChart game={this.game}></ScoreChart>
                );
                break;
        }

        return (
            <div className="scoreSummary" ref={this.props.refVar}>
                <div className="scoreSummaryHead">
                    {title}
                </div>
                <div className="scoreSummaryContent">
                    {show}
                </div>
                <div className="scoreSummaryFooter">
                    <ul>
                        <li>
                            <Icon icon="md-view-list" size={32} onClick={() => this.setState({show: "RANGLIST"})}></Icon>
                        </li>
                        <li>
                            <Icon icon="md-equalizer" size={32} onClick={() => this.setState({show: "CHART"})}></Icon>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default ScoreSummary;