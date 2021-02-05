const chai  = require('chai');
const chaiHttp  = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

it('GET connect API', (done) => {
    chai.request(server)
    .get('/api/connect')
    .end((err, res) => {
        res.should.have.status(200);
        done();
    });
});

describe('GET new game API', () => {
    it('GET new game difficulty \'Easy\'', (done) => {
        chai.request(server)
        .get('/api/newgame/easy')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('row').eql(5);
            res.body.should.have.property('col').eql(5);
            res.body.should.have.property('field');
            done();
        });
    });

    it('GET new game difficulty \'Medium\'', (done) => {
        chai.request(server)
        .get('/api/newgame/medium')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('row').eql(10);
            res.body.should.have.property('col').eql(10);
            res.body.should.have.property('field');
            done();
        });
    });

    it('GET new game difficulty \'Hard\'', (done) => {
        chai.request(server)
        .get('/api/newgame/hard')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('row').eql(15);
            res.body.should.have.property('col').eql(15);
            res.body.should.have.property('field');
            done();
        });
    });
});

describe('GET new game API', () => {
    it('GET leaderboard for difficulty \'Easy\'', (done) => {
        chai.request(server)
        .get('/api/leaderboard/easy')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('list');
            res.body.list.should.have.have.lengthOf(10);
            done();
        });
    });

    it('GET leaderboard for difficulty \'Medium\'', (done) => {
        chai.request(server)
        .get('/api/leaderboard/medium')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('list');
            res.body.list.should.have.have.lengthOf(10);
            done();
        });
    });

    it('GET leaderboard for difficulty \'Hard\'', (done) => {
        chai.request(server)
        .get('/api/leaderboard/hard')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('list');
            res.body.list.should.have.have.lengthOf(10);
            done();
        });
    });
});

describe('POST check score API', () => {
    it('POST check score \'Easy\'', (done) => {
        let score = {
            "difficulty" : "easy",
            "score" : 300
        };

        chai.request(server)
        .post('/api/score')
        .send(score)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('result');
            done();
        });
    });

    it('POST check score \'Medium\'', (done) => {
        let score = {
            "difficulty" : "medium",
            "score" : 400
        };

        chai.request(server)
        .post('/api/score')
        .send(score)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('result');
            done();
        });
    });

    it('POST check score \'Hard\'', (done) => {
        let score = {
            "difficulty" : "hard",
            "score" : 500
        };

        chai.request(server)
        .post('/api/score')
        .send(score)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('result');
            done();
        });
    });
});

describe('POST insert new score API', () => {
    it('POST insert score \'Easy\'', (done) => {
        let score = {
            "difficulty" : "easy",
            "score" : 15000,
            "username" : "testuser"
        };

        chai.request(server)
        .post('/api/score')
        .send(score)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('result');
            res.body.should.have.property('list');
            res.body.list.should.have.have.lengthOf(10);
            done();
        });
    });

    it('POST insert score \'Medium\'', (done) => {
        let score = {
            "difficulty" : "medium",
            "score" : 15000,
            "username" : "testuser"
        };

        chai.request(server)
        .post('/api/score')
        .send(score)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('result');
            res.body.should.have.property('list');
            res.body.list.should.have.have.lengthOf(10);
            done();
        });
    });

    it('POST insert score \'Hard\'', (done) => {
        let score = {
            "difficulty" : "hard",
            "score" : 15000,
            "username" : "testuser"
        };

        chai.request(server)
        .post('/api/score')
        .send(score)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('result');
            res.body.should.have.property('list');
            res.body.list.should.have.have.lengthOf(10);
            done();
        });
    });
});