import chai from 'chai';
import {
  before,
  after,
  afterEach
} from 'mocha';
import mongoUnit from 'mongo-unit';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import config from '../src/config';
import connect from '../src/mongo/connect';
import Songs from '../src/mongo/song-model';
import app from './setup';

chai.should();
chai.use(chaiHttp);

before(async () => {
  if (config.realMongo) {
    await connect();
  } else {
    const url = await mongoUnit.start();
    await connect(url);
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

after(async () => {
  try {
    app.close();
    await mongoose.disconnect();
  } catch (error) {
    if (!config.realMongo) {
      await mongoUnit.drop();
    }
    throw error;
  }
});
