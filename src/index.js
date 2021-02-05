import React from 'react';
import './index.css';
import ReactDOM from 'react-dom';
import Cell from './Cell';
import ServerApi from './ServerApi'; // import the server api class

let array = [0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1]
let x = 0; 
var squares;
var mineTime = 0;
let enteredUserName = "";
var leaderboard;

let startTime = new Date().getTime();
let endTime = 0;

let server = new ServerApi(); // server object

// prompt user for difficulty and store value as a variable
let difficulty = Number(prompt("Enter a difficulty (1-3)"));

// send the difficulty to the server so it can render the proper sized board
function setDifficulty(difficulty) {
  let difficultyString = ""; // The numbers converted to a string value
  switch (difficulty) {
    case 1:
      difficultyString = "easy";
      break;
    case 2:
      difficultyString = "medium";
      break;
    case 3:
      difficultyString = "hard";
      break;
    default:
      difficultyString = 'easy'; // a valid difficulty has not been entered
      break;
  }
  return difficultyString;
}

function test()
{
	alert("bleh");
}



export default class Board extends React.Component {
  state = {
    boardData: this.initBoardData(this.props.height, this.props.width, this.props.mines),
    gameStatus: "GalaxySweeper"
  };
  
  


  // Gets initial board data
  initBoardData(height, width, mines) {
    let data = this.createEmptyArray(height, width);
	data = this.plantMines(data, height, width, mines);
	let updatedData = data;
	for (let i = 0; i < height; i++) 
	{
      for (let j = 0; j < width; j++)
	  {
        if (data[i][j].isMine !== true) 
		{
          let mine = 0;
		  let adjSquares = this.traverseBoard(data[i][j].x, data[i][j].y, data);
		  adjSquares.map(value => {
            if (value.isMine) {
              mine++;
            }
          });
		  if (mine === 0) 
		  {
            updatedData[i][j].isEmpty = true;
          }
		  updatedData[i][j].neighbour = mine;
		}
	  }
	}
	data = updatedData;
    return data;
  }

  createEmptyArray(height, width) {
    let data = [];

    for (let i = 0; i < height; i++) {
      data.push([]);
      for (let j = 0; j < width; j++) {
        data[i][j] = {
          x: i,
          y: j,
          neighbour: 0,
        };
      }
    }
    return data;
  }
  
  plantMines(data, height, width, mines) {
    let randomx, randomy, minesPlanted = 0;

    while (minesPlanted < mines) {
      randomx = Math.floor(Math.random() * width);
      randomy = Math.floor(Math.random() * height);
      if (!(data[randomx][randomy].isMine)) {
        data[randomx][randomy].isMine = true;
        minesPlanted++;
      }
    }

    return (data);
  }

 
	
  renderBoard(data) {
    return data.map((datarow) => {
      return datarow.map((dataitem) => {
        return (
          <div key={dataitem.x * datarow.length + dataitem.y}>
            <div> <Cell onClick={() => this.handleCellClick(dataitem.x, dataitem.y)} value={dataitem}/></div>
            {(datarow[datarow.length - 1] === dataitem) ? <div className="clear" /> : ""}
          </div>);
      })
    });

  }
  
  traverseBoard(x, y, data) {
    const el = [];

    //up
    if (x > 0) {
      el.push(data[x - 1][y]);
    }

    //down
    if (x < this.props.height - 1) {
      el.push(data[x + 1][y]);
    }

    //left
    if (y > 0) {
      el.push(data[x][y - 1]);
    }

    //right
    if (y < this.props.width - 1) {
      el.push(data[x][y + 1]);
    }

    // top left
    if (x > 0 && y > 0) {
      el.push(data[x - 1][y - 1]);
    }

    // top right
    if (x > 0 && y < this.props.width - 1) {
      el.push(data[x - 1][y + 1]);
    }

    // bottom right
    if (x < this.props.height - 1 && y < this.props.width - 1) {
      el.push(data[x + 1][y + 1]);
    }

    // bottom left
    if (x < this.props.height - 1 && y > 0) {
      el.push(data[x + 1][y - 1]);
    }

    return el;
  }
  
  handleCellClick(x, y) {

    if (this.state.boardData[x][y].isRevealed || this.state.boardData[x][y].isFlagged) return null;
    let updatedData = this.state.boardData;
    updatedData[x][y].isRevealed = true;
	squares = squares - 1;
	console.log(squares);

	if(updatedData[x][y].isEmpty){
		updatedData = this.revealEmpty(x, y, updatedData);
	}
	
	if (this.state.boardData[x][y].isMine) {
      this.setState({ gameStatus: "You Lost." });
	  updatedData = this.revealAll(x, y, updatedData);
    }
	
//	if (updatedData[x][y].isEmpty) {
 //     updatedData = this.revealEmpty(x, y, updatedData);
//  }
	  
	else if (squares == this.props.mines)
	{
    this.setState({ gameStatus: "You Win." });
    endTime = new Date().getTime() - startTime;
    let gameScore = endTime / 1000;
    updatedData = this.revealAllWin(x, y, updatedData);
    enteredUserName = prompt("Congratulations on your win! Please enter your name. Score:" + gameScore); // prompt the user for their name
    server.insertNewScore(setDifficulty(difficulty), gameScore, enteredUserName); // TODO send the data to the server (score must be updated)
	}




    this.setState({
      boardData: updatedData,
    });
  }

	revealEmpty(x, y, data) {
	
    let area = this.traverseBoard(x, y, data);
    area.map(value => {
      if (!value.isRevealed && (value.isEmpty || !value.isMine)) {
        data[value.x][value.y].isRevealed = true;
		squares = squares - 1;
		console.log(squares);
        if (value.isEmpty) {
          this.revealEmpty(value.x, value.y, data);
		  
        }
      }
    });
    return data;
	

  }
  
  revealAll(x, y, data) {
    let area = this.state.boardData
    area.map((datarow) => {
		datarow.map((dataitem) => {
			dataitem.isRevealed = true;
		});
	});
	area.map((datarow) => {
		datarow.map((dataitem) => {
			dataitem.isRunning = false;
		});
	});
    return area;
}

  revealAllWin(x, y, data) {
    let area = this.state.boardData
    area.map((datarow) => {
		datarow.map((dataitem) => {
			dataitem.isRevealed = true;
		});
	});
	area.map((datarow) => {
		datarow.map((dataitem) => {
			dataitem.isWin = true;
		});
	});
    return area;
}
  
  render() {
	if (array[x] === 1)
	{
    return (
      <div className="board">
        <div className="game-info">
          <h1 className="info">{this.state.gameStatus}</h1>
        </div>
        {
          this.renderBoard(this.state.boardData)
		  
        }
      </div>
    );
	}
	if (array[x] === 0)
	{
    return (
      <div className="board">
        <div className="game-info">
          <h1 className="info">{this.state.gameStatus}</h1>
        </div>
        {
          this.renderBoard(this.state.boardData)
        }
      </div>
	  
    );
	}
  }
}

class Game extends React.Component {
	
  state = {
    className: "game"
  };
  
  componentDidMount() {
    // get new game from server and 
    //   initialize state values for the component
    let server = new ServerApi();
    server.getNewGame(setDifficulty(difficulty))
    .then(res => {
      this.setState({
        height: res.row,
        width : res.col,
        mines: res.mine,
        className: res.gameType,
      });

      array = [];
      for (let i = 0; i < res.field.length; i++) {
        array[i] = Number(res.field[i]);
      }
    squares = this.state.height * this.state.width;
    server.getLeaderboard(setDifficulty(difficulty))
	  .then(res => {
		  console.log(res);
		  document.getElementById("Leaderboard").innerHTML = res;
      });
      console.log(this.state.height);
      console.log(this.state.width);
      console.log(this.state.mines);
      console.log(this.state.className);
	  console.log(squares);
    });
  }
  
  render() {
    const {height, width, mines, gameStatus} = this.state
      return (
        <div className={this.state.className}>       
        {this.state && this.state.mines &&
          <Board height={this.state.height} width={this.state.width} mines ={this.state.mines} />
        }
        <p id = "Leaderboard"></p>
        </div>
      );
  }
 
}

ReactDOM.render(<Game />, document.getElementById("root"));


