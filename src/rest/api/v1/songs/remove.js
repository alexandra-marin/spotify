import rimraf from 'rimraf';
import Songs from '../../../../mongo/song-model';
import config from '../../../../config';

export default express => express.route('/api/v1/songs/:id').delete(async (req, res) => {
  try {
    const songs = await Songs.find({ _id: req.params.id });
    if (songs.length === 0) {
      res.sendStatus(404);
      return;
    }

    const song = songs[0];
    const folder = `${config.fileUpload.storage}/${song._id}`;
    rimraf.sync(folder);
    await Songs.remove({ _id: req.params.id });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
});
