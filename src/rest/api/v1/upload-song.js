/* eslint-disable no-underscore-dangle */
import fs from 'fs';
import Songs from '../../../mongo/song-model';
import config from '../../../config';

export default express => express.route('/api/v1/upload-song/:id').post(async (req, res) => {
  try {
    const songs = await Songs.find({ _id: req.params.id });
    if (songs.length === 0) {
      res.sendStatus(404);
      return;
    }
    const song = songs[0];
    const folder = `${config.fileStorage}/${song._id}`;
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
    req.files.song.mv(`${folder}/${req.files.song.name}`, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      song.uri = `/content/${song._id}/${req.files.song.name}`;
      const savedSong = await song.save();
      return res.status(200).json(savedSong);
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
});
