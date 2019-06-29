import Songs from './song.model';

export default async function create(req, res) {
  try {
    const song = new Songs(req.body);
    const savedSong = await song.save();
    res.status(201).json(savedSong);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
}
