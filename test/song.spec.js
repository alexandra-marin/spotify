/* eslint-disable no-underscore-dangle */

import chai from 'chai';
import {
  describe,
  before,
  after,
  it,
  beforeEach
} from 'mocha';
import fs from 'fs';
// import rimraf from 'rimraf';
import path from 'path';
import mongoUnit from 'mongo-unit';
import chaiHttp from 'chai-http';
import server from '../src/server';
import Songs from '../src/api/song/song.model';

chai.should();
chai.use(chaiHttp);


const binaryParser = (res, cb) => {
  res.setEncoding('binary');
  res.data = '';
  res.on('data', (chunk) => {
    res.data += chunk;
  });
  res.on('end', () => {
    cb(null, new Buffer(res.data, "binary"));
  });
};

async function addSongToStorage(name) {
  const song = await chai
    .request(server.app)
    .post('/api/v1/songs')
    .send({ name });

  return song;
}

describe('Songs', () => {
  before(done => {
    mongoUnit.start()
      .then(url => server.init(url))
      .then(() => done());
  });

  after(() => {
    mongoUnit.drop();
  });

  beforeEach(async () => {
    await Songs.collection.remove({});
  });

  describe('/GET songs', () => {
    it('it should get a empty list of songs', done => {
      chai
        .request(server.app)
        .get('/api/v1/songs')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array').with.lengthOf(0);
          done();
        });
    });

    it('it should get a list of songs', async () => {
      const added = await addSongToStorage('Mock song');
      const songsResponse = await chai
        .request(server.app)
        .get('/api/v1/songs');
      songsResponse.should.have.status(200);
      songsResponse.body.should.be.a('array').with.lengthOf(1);
      songsResponse.body.should.be.deep.equal([JSON.parse(added.res.text)]);
    });

    it('it should get one song', async () => {
      const added = await addSongToStorage('Mock song');
      const parsedSong = JSON.parse(added.res.text);

      const songsResponse = await chai
        .request(server.app)
        .get(`/api/v1/songs/${parsedSong._id}`);

      songsResponse.should.have.status(200);
      songsResponse.body.should.be.deep.equal(parsedSong);
    });

    it('it should return 404 if song does not exist', async () => {
      const added = await addSongToStorage('Mock song');
      const parsedSong = JSON.parse(added.res.text);

      await Songs.remove({ _id: parsedSong._id });

      const songsResponse = await chai
        .request(server.app)
        .get(`/api/v1/songs/${parsedSong._id}`);

      songsResponse.should.have.status(404);
    });

    it('it should get the second page of songs', async () => {
      await addSongToStorage('Mock song');
      const added = await addSongToStorage('Mock song 2');

      const songsResponse = await chai
        .request(server.app)
        .get('/api/v1/songs')
        .query({ page: 1, pageSize: 1 });

      songsResponse.should.have.status(200);
      songsResponse.body.should.be.a('array').with.lengthOf(1);
      songsResponse.body.should.be.deep.equal([JSON.parse(added.res.text)]);
    });
  });

  describe('upload', () => {
    it('should upload content for existing song', async () => {
      const added = await addSongToStorage('Mock song');
      const parsedSong = JSON.parse(added.res.text);

      const song = path.resolve(__dirname, './test.mp3');
      const songBytes = fs.readFileSync(song);

      const songsResponse = await chai
        .request(server.app)
        .post(`/api/v1/upload-song/${parsedSong._id}`)
        .attach('song', songBytes, 'test.mp3');

      songsResponse.should.have.status(200);
      songsResponse.body.should.have.property('uri');

      const { uri } = songsResponse.body;
      const contentResponse = await chai
        .request(server.app)
        .get(uri)
        .buffer()
        .parse(binaryParser);
      contentResponse.should.have.status(200);
      contentResponse.body.should.be.deep.equal(songBytes);
      // console.log(contentResponse);
    });
  });
});
