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

  describe('GET /api/v1/favorites', () => {
    it('should return all favorites', done => {
      chai.request(server)
        .get('/api/v1/favorites')
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
          done();
        });
    });

  });
});
