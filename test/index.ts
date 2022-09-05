import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/index';
chai.use(chaiHttp);

const expect = chai.expect;

before(function (done) {
  server.on('ok', () => {
    done();
  });
});

describe('Init test', function () {
  it('Initialize', async function () {
    const res = await chai.request(server).get('/');
    expect(res).to.have.status(200);
  });
});

after(function (done) {
  process.exit(0);
  done();
});
