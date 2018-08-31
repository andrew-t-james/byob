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

  describe('POST /api/v1/users', () => {
    it('should create a new user', done => {
      chai.request(server)
        .post('/api/v1/users')
        .send({
          first_name: 'Bob',
          last_name: 'Loblaw'
        })
        .end(function(err, res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.id.should.equal(31);
          done();
        });
    });
  });

  describe('GET /api/v1/saved_routes', () => {
    it('should return all saved routes', done => {
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

  describe('POST /api/v1/saved_routes/:user_id', () => {
    it('should save and return a new saved route', done => {
      chai.request(server)
        .post('/api/v1/saved_routes/1')
        .send({
          name: 'My new Route',
          start_location: 'Some train stop',
          end_location: 'Some other train stop'
        })
        .end((err, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(31);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('My new Route');
          response.body[0].should.have.property('start_location');
          response.body[0].start_location.should.equal('Some train stop');
          response.body[0].should.have.property('end_location');
          response.body[0].end_location.should.equal('Some other train stop');
          response.body[0].should.have.property('user_id');
          response.body[0].user_id.should.equal(1);
          done();
        });
    });

    it('should return a 404 if no user_id present in database', done => {
      chai.request(server)
        .get(`/api/v1/saved_routes/90`)
        .end((err, response) => {
          response.should.have.status(404);
          response.error.text.should.equal('{"error":"404: Resource not found"}');
          done();
        });
    });
  });

  describe('PATCH /api/v1/saved_routes/:saved_route_id', () => {
    it('should update a saved_route by id', done => {
      chai.request(server)
        .patch('/api/v1/saved_routes/1')
        .send({
          start_location: 'Some New Route'
        })
        .end((err, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.equal(1);
        });

      chai.request(server)
        .get('/api/v1/saved_routes/1')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Home');
          response.body[0].should.have.property('start_location');
          response.body[0].start_location.should.equal('Some New Route');
          done();
        });
    });

    it('should return an error if saved_route_id incorrect', done => {
      chai.request(server)
        .patch('/api/v1/saved_routes/10000')
        .send({
          start_location: 'My new Place'
        })
        .end((err, response) => {
          response.should.have.status(422);
          response.error.text.should.equal('{"error":"422: Please provide a valid route id."}');
          done();
        });
    });
  });
});
