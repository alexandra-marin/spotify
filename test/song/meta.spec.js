import chai from 'chai';
import {
  describe,
  it
} from 'mocha';
import Songs from '../../src/mongo/song-model';
import app from '../setup';

async function addSongToStorage(name) {
  const song = await chai
    .request(app)
    .post('/api/v1/songs')
    .send({ name });

  return song;
}

describe('Songs', () => {
  it('should get a empty list of songs', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/songs');
    res.should.have.status(200);
    res.body.should.be.a('array').with.lengthOf(0);
  });

  it('should get a list of songs', async () => {
    const added = await addSongToStorage('Mock song');
    const songsResponse = await chai
      .request(app)
      .get('/api/v1/songs');
    songsResponse.should.have.status(200);
    songsResponse.body.should.be.a('array').with.lengthOf(1);
    songsResponse.body.should.be.deep.equal([JSON.parse(added.res.text)]);
  });

  it('should get one song', async () => {
    const added = await addSongToStorage('Mock song');
    const parsedSong = JSON.parse(added.res.text);

    const songsResponse = await chai
      .request(app)
      .get(`/api/v1/songs/${parsedSong._id}`);

    songsResponse.should.have.status(200);
    songsResponse.body.should.be.deep.equal(parsedSong);
  });

  it('should return 404 if song does not exist', async () => {
    const added = await addSongToStorage('Mock song');
    const parsedSong = JSON.parse(added.res.text);

    await Songs.remove({ _id: parsedSong._id });

    const songsResponse = await chai
      .request(app)
      .get(`/api/v1/songs/${parsedSong._id}`);

    songsResponse.should.have.status(404);
  });

  it('should allow pagination', async () => {
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
