import chai from 'chai';
import {
  describe,
  before,
  after,
  it,
  afterEach
} from 'mocha';
import fs from 'fs';
import path from 'path';
import mongoUnit from 'mongo-unit';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import config from '../src/config';
import express from '../src/express';
import connect from '../src/mongo/connect';
import Songs from '../src/mongo/song-model';

chai.should();
chai.use(chaiHttp);

let app;

const binaryParser = (res, cb) => {
  res.setEncoding('binary');
  res.data = '';
  res.on('data', (chunk) => {
    res.data += chunk;
  });
  res.on('end', () => {
    cb(null, Buffer.from(res.data, 'binary'));
  });
};

async function addSongToStorage(name) {
  const song = await chai
    .request(app)
    .post('/api/v1/songs')
    .send({ name });

  return song;
}

describe('Songs', () => {
  before(done => {
    app = express();
    if (config.realMongo) {
      connect();
      done();
    } else {
      mongoUnit.start()
        .then(url => connect(url))
        .then(() => done());
    }
  });

  afterEach(async () => {
    const songs = await Songs.find({});

    const removals = [];
    songs.forEach(({ _id }) => removals
      .push(chai.request(app)
        .delete(`/api/v1/songs/${_id}`)));

    await Promise.all(removals);
  });

  after((done) => {
    app.close();
    mongoose.disconnect().then(err => {
      if (!config.realMongo) {
        mongoUnit.drop().then(err1 => done(err1));
      } else {
        done(err);
      }
    });
  });

  describe('/GET songs', () => {
    it('it should get a empty list of songs', done => {
      chai
        .request(app)
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
        .request(app)
        .get('/api/v1/songs');
      songsResponse.should.have.status(200);
      songsResponse.body.should.be.a('array').with.lengthOf(1);
      songsResponse.body.should.be.deep.equal([JSON.parse(added.res.text)]);
    });

    it('it should get one song', async () => {
      const added = await addSongToStorage('Mock song');
      const parsedSong = JSON.parse(added.res.text);

      const songsResponse = await chai
        .request(app)
        .get(`/api/v1/songs/${parsedSong._id}`);

      songsResponse.should.have.status(200);
      songsResponse.body.should.be.deep.equal(parsedSong);
    });

    it('it should return 404 if song does not exist', async () => {
      const added = await addSongToStorage('Mock song');
      const parsedSong = JSON.parse(added.res.text);

      await Songs.remove({ _id: parsedSong._id });

      const songsResponse = await chai
        .request(app)
        .get(`/api/v1/songs/${parsedSong._id}`);

      songsResponse.should.have.status(404);
    });

    it('it should get the second page of songs', async () => {
      await addSongToStorage('Mock song');
      const added = await addSongToStorage('Mock song 2');

      const songsResponse = await chai
        .request(app)
        .get('/api/v1/songs')
        .query({ page: 1, pageSize: 1 });

      songsResponse.should.have.status(200);
      songsResponse.body.should.be.a('array').with.lengthOf(1);
      songsResponse.body.should.be.deep.equal([JSON.parse(added.res.text)]);
    });
  });

  describe('upload', () => {
    it('should post content for existing song', async () => {
      const added = await addSongToStorage('Mock song');
      const parsedSong = JSON.parse(added.res.text);

      const song = path.resolve(__dirname, './test.mp3');
      const songBytes = fs.readFileSync(song);

      const songsResponse = await chai
        .request(app)
        .post(`/api/v1/upload-song/${parsedSong._id}`)
        .attach('song', songBytes, 'test.mp3');

      songsResponse.should.have.status(200);
      songsResponse.body.should.have.property('uri');

      const { uri } = songsResponse.body;
      const contentResponse = await chai
        .request(app)
        .get(uri)
        .buffer()
        .parse(binaryParser);
      contentResponse.should.have.status(200);
      contentResponse.body.should.be.deep.equal(songBytes);
    });
  });
});
