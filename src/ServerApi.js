class ServerApi {

  /** 
   * API to get new game with difficulty(Easy, Medium, Hard) from backend server.
   * Returns an object with row number, column number, and mine field as a plain string.
   * 
   * Usage:
   *    let server = new ServerApi();
        server.getNewGame('Easy')
          .then(res => {
            console.log('rows - ' + res.row);
            console.log('cols - ' + res.col);
            console.log(res.field);
        });
   * 
   * Example return value:
   * {  row: 5, 
   *    col: 5,
   *    mines: 10, 
   *    field: "0100000010000110110110101"
   *    GameID: 5  }
  */
  async getNewGame(difficulty) {
    var response = await fetch('/api/newgame/' + difficulty);
    var body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }

    return body;
  }

  /** 
   * API to get leaderboard from backend server.
   * Returns the list of highscore data.
   * 
   * Example return value:
   * [ { Lid: 1, 
   *     Score: 543,
   *     Username: "Bob", 
   *     Difficulty: "medium" },
   *   ...,
   *   { Lid: 10, 
   *     Score: 950,
   *     Username: "Jack", 
   *     Difficulty: "medium" } ]
  */
  async getLeaderboard(difficulty){
    var response = await fetch('/api/leaderboard/' + difficulty);
    var body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    var result = "";
    for (let i = 0; i < body.list.length; i++) {
      if (body.list[i].Score == null) continue;
      let row = "Name: " + body.list[i].Username + " / Score: " + body.list[i].Score + "<br>";
      result += row;
    }
    return result;
  }

  /*
  Example return value:

  Game: 5 data deleted
  */
  async deleteUserData(GID){
    var response = await fetch('/api/deleteuserdata' + GID);
    var body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }

    return body;
  }

  /** 
   * API to check if the new score is going to be in top 10.
   * Returns true if the new score is in top 10, returns false otherwise.
  */
  async checkScore(difficulty, score) {
    var requestBody = {
      difficulty: difficulty,
      score: score
    };

    var config = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    }

    var response = await fetch('/api/score', config);
    var body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }

    return body.result;
  }

  /** 
   * API to insert new high score.
   * Returns the updated list of highscore data.
   * 
   * Example return value:
   * [ { Lid: 1, 
   *     Score: 543,
   *     Username: "Bob", 
   *     Difficulty: "medium" },
   *   { Lid: 2, 
   *     Score: 555,
   *     Username: "Jill", 
   *     Difficulty: "medium" }, ... ]
  */
  async insertNewScore(difficulty, score, userName) {
    var requestBody = {
      difficulty: difficulty,
      score: score,
      username: userName
    };

    var config = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    }

    var response = await fetch('/api/score', config);
    var body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }

    return body.list;
  }

}

export default ServerApi;