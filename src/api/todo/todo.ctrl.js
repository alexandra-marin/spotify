import TodoDa from './todo.da';
import Songs from './todo.model';

export default {
  search,
  get,
  update,
  create,
  remove
};

async function search(req, res) {
  try {
    const songs = await Songs.find({});
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

function update(req, res) {
  const { id } = req.params;
  const { name, completed } = req.body;

  TodoDa.update(id, name, completed)
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(400));
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

function remove(req, res) {
  const { id } = req.params;

  TodoDa.remove(id)
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(400));
}
