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