const chai = require('chai');

const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex');

chai.use(chaiHttp);


describe('Initial Test setup', () => {
  it('Should return 404', () =>
    chai.request(server)
      .get('/')
      .then(res => {
        res.should.have.status(404);
      })
      .catch(error => {
        throw error;
      }));
});
      
describe('GET /api/v1/users', () => {
    
  beforeEach(done => {
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            return knex.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });
    
  it('should return all users', done => {
    chai.request(server)
      .get('/api/v1/users')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(30);
        res.body[0].should.have.property('first_name');
        res.body[0].first_name.should.equal('Jeff');
        res.body[0].should.have.property('last_name');
        res.body[0].last_name.should.equal('Root');
        res.body[0].should.have.property('id');
        res.body[0].id.should.equal(1);
        done();
      });
  });
});