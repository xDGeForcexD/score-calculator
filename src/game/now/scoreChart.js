import React from "react";

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';



class ScoreChart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.game = props.game;
    }

    generateChartData() {
        this.chartData = [];
        if(this.game.round > 0) {
            for(let round = 0; round < this.game.round; round++) {
                let chartItem = {round: this.game.gameType.displayRound(round)};
                for(let player of this.game.players.players) {
                    let add = 0;
                    if(round > 0) {
                        add = this.chartData[round-1][player.name];
                    }
                    chartItem[player.name] = this.game.gameType.displayScoreNumber(player.score[round])+add;
                }
                this.chartData.push(chartItem);
            }
        }
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    renderChart() {
        let render = [];
        for(let player of this.game.players.players) {
            render.push(<Line type="monotone" dataKey={player.name} stroke={this.getRandomColor()} />);
        }

        return render;
    }

    render() {
        this.generateChartData();
        return (
            <LineChart width={window.innerWidth*90/100} height={window.innerHeight-250} data={this.chartData}
                        margin={{top: 5, right: 30, left: 20, bottom: 5}} style={{background: "#3e3e3f", marginTop: "10px"}}>
                <XAxis dataKey="round"/>
                <YAxis/>
                <CartesianGrid strokeDasharray="1 5"/>
                <Tooltip/>
                <Legend />
                {this.renderChart()}
            </LineChart>
        );
    }
}

export default ScoreChart;