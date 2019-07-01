import chai from 'chai';
import {
  describe,
  it
} from 'mocha';
import fs from 'fs';
import path from 'path';
import app from '../setup';

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
