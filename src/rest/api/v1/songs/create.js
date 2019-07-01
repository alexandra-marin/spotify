import Songs from '../../../../mongo/song-model';

export default express => express.route('/api/v1/songs').post(async (req, res) => {
  try {
    const song = new Songs(req.body);
    const savedSong = await song.save();
    res.status(201).json(savedSong);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
});
