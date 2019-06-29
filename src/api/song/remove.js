/* eslint-disable no-underscore-dangle */
import rimraf from 'rimraf';
import Songs from './mongo-model';
import config from '../../config/config';

export default async function remove(req, res) {
  try {
    const songs = await Songs.find({ _id: req.params.id });
    if (songs.length === 0) {
      res.sendStatus(404);
      return;
    }
    const song = songs[0];
    const folder = `${config.fileStorage}/${song._id}`;
    rimraf.sync(folder);
    const deleted = await Songs.remove({ _id: req.params.id });
    console.log(deleted);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
}
