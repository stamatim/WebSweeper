import React from 'react';

// The class for the cells on the board
export default class Cell extends React.Component {

    getValue() { // Gets the value of what is in the cell
        if (!this.props.value.isRevealed) { // If the cell value is hidden
            return this.props.value.isFlagged ? "🏴" : null;
        }
        if (this.props.value.isMine) { // If the Cell is a mine
            return "💣";
        }
        if (this.props.value.neighbor == 0) { // If a neighboring cell does not have a value
            return null;
        }
        return this.props.value.neighbor; // Return the neighboring cells by default
    }

    render() {
        let className = "cell" + (this.props.value.isRevealed ? "" : " hidden") + (this.props.value.isMine ? " is-mine" : "") + (this.props.value.isFlagged ? " is-flag" : "");

        return (
            <div ref = "cell" onClick = {this.props.onClick} className = {className} onContextMenu = {this.props.cMenu}>
                {this.getValue()}
            </div>
        );
    }
}