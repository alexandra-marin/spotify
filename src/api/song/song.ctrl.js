import Songs from './song.model';

export default {
  search,
  get,
  create
};

async function search(req, res) {
  try {
    const page = parseInt(req.query.page, 10);
    const pageSize = parseInt(req.query.pageSize, 10) || 100;

    const songs = await Songs.find({})
      .sort({ _id: 1 })
      .skip(page * pageSize)
      .limit(pageSize);

    res.status(200).json(songs);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
}

async function get(req, res) {
  try {
    const songs = await Songs.find({ _id: req.params.id });
    if (songs.length === 0) res.sendStatus(404);
    res.status(200).json(songs[0]);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
}

async function create(req, res) {
  try {
    const song = new Songs(req.body);
    const savedSong = await song.save();
    res.status(201).json(savedSong);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
}
