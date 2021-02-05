import React from 'react';
import Cell from './Cell'; // import the cell component
import ServerApi from './ServerApi'; // import the Server Api

export default class Board extends React.Component {
    state = {
        boardData: this.boardDataInit(this.props.width, this.props.height, this.props.mines),
        gameWin: false,
        numMines: this.props.mines
    };

    render() {
        return (
            <div className="board">
                <div className="game-info">
                    <span className="info">mines: {this.state.numMines}</span><br />
                    <span className="info">{this.state.gameWin ? "You Win!" : ""}</span>
                </div>
                {
                    this.renderBoard(this.state.boardData)
                }
            </div>
        );
    }

    /* HELPER METHODS */

    // Get the flags array
    getFlagsArr(flagsData) {

    }

    // Get the mines array
    getMinesArr(minesData) {

    }

    // Get the initial board data
    boardDataInit(width, height, mines) {

    }

    // Place the mines on the board
    placeMines(arrData, width, height, mines) {

    }

    // Get the number of neighboring mines
    getNumNeighboring() {

    }

    /* EVENT HANDLING */
    
}