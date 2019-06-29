/* eslint-disable no-underscore-dangle */

import chai from 'chai';
import {
  describe,
  before,
  after,
  it,
  beforeEach
} from 'mocha';
import mongoUnit from 'mongo-unit';
import chaiHttp from 'chai-http';
import server from '../src/server';
import Songs from '../src/api/todo/todo.model';
import { Mongoose } from 'mongoose';

chai.should();
chai.use(chaiHttp);

/**
 * Add mockTodo into storage
 */
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
  // });

  // describe('/POST todo', () => {
  //   it('should create a todo with a name property', done => {
  //     const payload = { name: 'Just another todo' };
  //     chai
  //       .request(server.app)
  //       .post('/api/v1/todo')
  //       .send(payload)
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('name').eql(payload.name);
  //         res.body.should.have.property('completed').eql(false);
  //         done();
  //       });
  //   });

  //   it('should not create a todo with a missing name property', done => {
  //     chai
  //       .request(server.app)
  //       .post('/api/v1/todo')
  //       .end((err, res) => {
  //         res.should.have.status(422);
  //         done();
  //       });
  //   });
  // });

  // describe('/PUT todo/:id', () => {
  //   let todoMock;

  //   before(done => {
  //     addTodoToStorage('Mock Todo Name for Modification', (err, res) => {
  //       todoMock = res.body;
  //       done();
  //     });
  //   });

  //   it('should update a todo', done => {
  //     const update = {
  //       name: 'Renamed Todo',
  //       completed: true
  //     };

  //     chai
  //       .request(server.app)
  //       .put(`/api/v1/todo/${todoMock._id}`)
  //       .send(update)
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         done();
  //       });
  //   });

  //   it('should return a 422 status if body is missing', done => {
  //     chai
  //       .request(server.app)
  //       .put(`/api/v1/todo/${todoMock._id}`)
  //       .end((err, res) => {
  //         res.should.have.status(422);
  //         done();
  //       });
  //   });

  //   it('should return a 422 status if id is wrong', done => {
  //     chai
  //       .request(server.app)
  //       .put('/api/v1/todo/A-WRONG-ID')
  //       .send({ name: 'Test' })
  //       .end((err, res) => {
  //         res.should.have.status(422);
  //         done();
  //       });
  //   });
  // });

  // describe('/DELETE todo/:id', () => {
  //   let todoMock;

  //   before(done => {
  //     addTodoToStorage('Mock Todo Name to delete', (err, res) => {
  //       todoMock = res.body;
  //       done();
  //     });
  //   });

  //   it('should delete a todo', done => {
  //     chai
  //       .request(server.app)
  //       .delete(`/api/v1/todo/${todoMock._id}`)
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         done();
  //       });
  //   });

  //   it('should return a 422 status if id is wrong', done => {
  //     chai
  //       .request(server.app)
  //       .put('/api/v1/todo/A-WRONG-ID')
  //       .end((err, res) => {
  //         res.should.have.status(422);
  //         done();
  //       });
  //   });
  // });
});
