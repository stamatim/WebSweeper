import React from 'react';
import PropTypes from 'prop-types';

export default class Cell extends React.Component {
  getValue() {
    const { value } = this.props;

	if (value.isMine && value.isRevealed) {
      return "💣";
    }

    if (value.neighbour === 0) {
      return null;
    }
    if (value.isRevealed)
	{
		return value.neighbour;
	}
  }

  render() {
    const { value, onClick} = this.props;
    let className = (value.isRevealed ? "cell" : "hidden")
	if (value.isWin === true)
    className = "win"
	if (value.isRunning === false)
		className = "fine"
    return (
      <div
        onClick={onClick}
        className={className}
      >
        {this.getValue()}
      </div>
    );
  }
}

const cellItemShape = {
    isRevealed: PropTypes.bool,
    isMine: PropTypes.bool,
    isFlagged: PropTypes.bool,
	isRunning: PropTypes.bool,
	isWin: PropTypes.bool
}

Cell.propTypes = {
  value: PropTypes.objectOf(PropTypes.shape(cellItemShape)),
  onClick: PropTypes.func,
}
