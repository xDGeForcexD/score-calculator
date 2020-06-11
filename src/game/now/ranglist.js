import React from "react";





class Ranglist extends React.Component {
    fxProps = {
        count: 4,
        interval: 800,
        colors: ['#cc3333', '#4CAF50', '#81C784', '#fcba03', '#2607db'],
        calc: (props, i) => ({
          ...props,
          x: (i + 1) * (window.innerWidth / 3) - (i + 1) * 100,
          y: 200 + Math.random() * 100 - 50 + (i === 2 ? -80 : 0)
        })
    }

    constructor(props) {
        super(props);
        this.state = {};
        this.game = props.game;
    }



    renderList() {
        let width = window.innerWidth*0.9;
        let render = [];
        let i = 1;
        render.push(
            <thead>
                <tr>
                    <th className="ranglisteHead" style={{width: (width*0.2)+"px"}}>Platz</th>
                    <th className="ranglisteHead" style={{width: (width*0.6)+"px"}}>Name</th>
                    <th className="ranglisteHead" style={{width: (width*0.2)+"px"}}>Punkte</th>
                </tr>
            </thead>
        );
        let renderData = [];
        for(let rang of this.game.gameType.getRanglist(this.game.players.players)) {
            let classMedal = "";
            switch(i) {
                case 1:
                    classMedal = "medalFirst";
                    break;
                case 2:
                    classMedal = "medalSecond";
                    break;
                case 3:
                    classMedal = "medalThird";
                    break;
                default:
                    break;
            }
            renderData.push(
                <tr>
                    <td style={{width: (width*0.2)+"px"}}><div className={"rangMedal " + classMedal}>{i}.</div></td>
                    <td style={{width: (width*0.6)+"px"}}>{rang.player.name}</td>
                    <td style={{width: (width*0.2)+"px"}}>{rang.sum}</td>
                </tr>
            );
            i++;
        }
        render.push(<tbody style={{height: (window.innerHeight-200)+"px"}}>{renderData}</tbody>);
        return render;
    }

    render() {
        return (
            <>
                <table id="rangliste" className="rangliste">
                    {this.renderList()}
                </table>
            </>
        );
    }
}

export default Ranglist;