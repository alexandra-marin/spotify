import Songs from './mongo-model';

export default async function get(req, res) {
  try {
    const songs = await Songs.find({ _id: req.params.id });
    if (songs.length === 0) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(songs[0]);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
}
