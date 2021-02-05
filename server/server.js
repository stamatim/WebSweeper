const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

const PORT = 5000;

var rows;
var cols;
var mines;
var diff;
var gameType;
var GID;

// mySQL connection info
const con = mysql.createConnection({
    host: "cs319-121.misc.iastate.edu",
    user: "admin",
    password: "WebSweeper2019!",
    database: "WebSweeper"
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.redirect('/api/connect');
});

/*
* GET /api/connect
*/
app.get('/api/connect', (req, res) => {
    res.status(200).send({ message: 'Hello from backend server' });
});

/*
* GET /api/newgame/[DIFFICULTY]
*    - example request: GET /api/newgame/Easy
*/
app.get('/api/newgame/:difficulty', (req, res) => {
    var status = 400;
    var message = {};
 
    console.log('difficulty: ' + req.params.difficulty);

    diff = req.params.difficulty;

    if(diff == "easy"){
        rows = 5;
        cols = 5;
        mines = 5;
        gameType = 'gameEasy';
    }else if(diff == "medium"){
        rows = 8;
        cols = 8;
        mines = 10;
        gameType = 'game';
    }else if(diff == "hard"){
        rows = 15;
        cols = 15;
        mines = 50;
        gameType = 'gameHard';
    }else if(diff == "extreme"){
        rows = 15;
        cols = 15;
        mines = 150;
    }else if(diff == "psycho"){
        rows = 15;
        cols = 15;
        mines = 200;
    }
    
    var field = createField();
    var stringField = fieldStringify(field);
    var viewField = viewFieldGen();

    var sql = "insert into Game (Field, roe, col, mines, Difficulty, viewField) " 
    sql += "Values(\'" + stringField +"\', "+ rows +", " + cols + ", "+ mines+", \'" + diff +"\', \'"+ viewField + "\')";

    con.query(sql, function (err, result){
        if(err) throw err;
        status = 200;
        GID = result.insertId;
        message = {gameType: gameType, mine: mines, row: rows, col: cols, field: stringField, GameID: GID};
        res.status(status).send(message);
        console.log("New Game Inserted. Game ID: " + GID);
    })

    
});

/*
* GET /api/leaderboard/[DIFFICULTY]
*    - example request: GET /api/leaderboard/easy
*/
app.get('/api/leaderboard/:difficulty', (req, res) => {
    var sql = "SELECT * FROM Leaderboard " +
        "WHERE Difficulty = \'" + req.params.difficulty + "\' ORDER BY Score LIMIT 10"; 

    con.query(sql, function (err, result){
        if(err) throw err;
        res.status(200).send({ list: result });
    });
});

/*
* GET /api/leaderboard
*/
app.get('/api/viewfield/:gameID', (req, res) => {

    gameID = req.params.gameID;

    var sql = "select viewField from Game where GID = " + gameID;
    
    con.query(sql, function (err, result){
        if(err) throw err;
        status = 200;
        res.status(status).send(result);
        console.log("ViewField for GID: " + gameID + " is: " + result[0].viewField);
    })

});

app.get('/api/deletedata', (req, res) =>{

    var sql = "DELETE FROM Game;"
    con.query(sql, function (err, result){
        if(err) throw err;
        console.log("Game Table Data Deleted");
    })
    sql = "DELETE FROM Leaderboard;"
    con.query(sql, function (err, result){
        if(err) throw err;
        console.log("Leaderboard Table Data Deleted");
    })

    status = 200;
    res.status(status).send("Data Deleted");
})

app.get('/api/deleteuserdata/:gameID', (req, res) => {

    gameID = req.params.gameID;

    var sql = "DELETE FROM Game WHERE GID = " + gameID;

    con.query(sql, function (err, result){
        if(err) throw err;
        console.log("Game: " + gameID + " Data Deleted");
    })

    status = 200;
    res.status(status).send("Game: " + gameID + " Data Deleted");
})

/*
* POST /api/score
*      {  "difficulty" : [DIFFICULTY],
*         "score" : [SCORE],
*         "username" : [USERNAME (OPTIONAL)]  }
*
*    - example request payload (usecase 1 - check if the new score is in top10): 
*          {  "difficulty" : "easy",
*             "score" : 433  }
*    - example request payload (usecase 2 - insert new score): 
*          {  "difficulty" : "easy",
*             "score" : 433,
*             "username" : "Bob"  }
*/
app.post('/api/score', (req, res) => {
    var payload = req.body;
    console.log(payload);

    var sqlSelect = "SELECT * FROM Leaderboard " +
        "WHERE Difficulty = \'" + payload.difficulty + "\' ORDER BY Score LIMIT 10"; 

    con.query(sqlSelect, function (err, result){
        if(err) throw err;

        // check if the new score is in top 10
        var response = false;
        var lId = -1;
        for (var i = 0; i < result.length; i++) {
            if (result[i].Score == null || result[i].Score > payload.score) {
                response = true;
                lId = result[i].LID;
                break;
            }
        }

        if (payload.username == null || payload.username == undefined || payload.username === '' || lId == -1) {
            res.status(200).send({ result: response, lId: lId });
            return;
        }
        
        // update leaderboard (if the payload contains username)
        var sqlUpdate = "insert into Leaderboard (score, Username, Difficulty) values (" + payload.score + 
                 ", \'" + payload.username + "\', \'" + payload.difficulty + "\')";
        con.query(sqlUpdate, function (err, result) {
            if(err) throw err;

            // get updated leaderboard data
            con.query(sqlSelect, function (err, result){
                if(err) throw err;
                res.status(200).send({ result: response, lId: lId, list: result });
            });
        });

    });
});

app.listen(PORT, () => console.log('Server listening on port ' + PORT));

// connect database
con.connect((err) => {
    if (err) {
        throw err;
    }

    console.log('Database connected');
    con.query('SHOW TABLES', (err, result) => {
        if (err) throw err;
        console.log(result);
    });
})

function createField(){
    var mineSpot = [];
    var field = [];
    var i, j;

    for(i = 0; i < rows; i++){
        field[i] = new Array(cols);
    }

    mineSpot = genMines();

    for(i = 0; i < rows; i++){
        for(j = 0; j < cols; j++){
            field[i][j] = 0;
        }
    }

    for(i = 0; i < mines; i++){
        var row = Math.floor((mineSpot[i] / cols));
        var col = Math.floor((mineSpot[i] % cols));
        field[row][col] = 1;
    }

    return field;
}

function genMines(){
    var mineSpot = [];
    var i, j, temp;

    for(i = 0; i < mines; i++){
        mineSpot[i] = -1;
    }

    for(i = 0; i < mines; i++){
        temp = Math.floor(Math.random() * rows * cols);

        for(j = i; j >= 0; j--){
            if(temp == mineSpot[j]){
                temp = -2;
                break;
            }
        }

        if(temp == -2){
            i--;
            continue;
        }

        mineSpot[i] = temp;
    }
    return mineSpot;
}

function fieldStringify(field){
    var i, j;
    var stringField = "";

    for(i = 0; i < rows; i++){
        for(j = 0; j < cols; j++){
            stringField += "" + field[i][j];
        }
    }

    return stringField;
}

function viewFieldGen(){
    var i, j;
    var vField = "";

    for(i = 0; i < rows; i++){
        for(j = 0; j < cols; j++){
            vField += "0";
        }
    }

    return vField;
}

module.exports = app;   // for unittest