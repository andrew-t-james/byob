const chai = require('chai');

const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex');

chai.use(chaiHttp);

describe('API routes', () => {
  beforeEach(done => {
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => knex.seed.run()
            .then(() => {
              done();
            }));
      });
  });

  describe('GET /api/v1/users', () => {
    it('should return all users', done => {
      chai.request(server)
        .get('/api/v1/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.equal(30);
          res.body[0].should.have.property('first_name');
          res.body[0].first_name.should.equal('Ty');
          res.body[0].should.have.property('last_name');
          res.body[0].last_name.should.equal('Tanic');
          res.body[0].should.have.property('id');
          res.body[0].id.should.equal(1);
          done();
        });
    });
  });

  describe('GET /api/v1/favorites', () => {
    it('should return all favorites', done => {
      chai.request(server)
        .get('/api/v1/saved_routes')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.length.should.equal(30);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Home');
          response.body[0].should.have.property('start_location');
          response.body[0].start_location.should.equal('Union Station T1');
          response.body[0].should.have.property('end_location');
          response.body[0].end_location.should.equal('40th & Colorado Station');
          response.body[0].should.have.property('user_id');
          response.body[0].user_id.should.equal(1);
          done();
        });
    });
  });

  describe('GET /api/v1/saved_routes/:user_id', () => {
    it('should return saved_routes based on a users id', done => {
      chai.request(server)
        .get(`/api/v1/saved_routes/3`)
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(3);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Hideout');
          response.body[0].should.have.property('start_location');
          response.body[0].start_location.should.equal('Central Park Station');
          response.body[0].should.have.property('end_location');
          response.body[0].end_location.should.equal('Union Station T1');
          response.body[0].should.have.property('user_id');
          response.body[0].user_id.should.equal(3);
          done();
        });
    });

    it('should return a 404 if no user-id present in database', done => {
      chai.request(server)
        .get(`/api/v1/saved_routes/90`)
        .end((err, response) => {
          response.should.have.status(404);
          response.error.text.should.equal('{"error":"404: Resource not found"}');
          done();
        });
    });
  });

});
