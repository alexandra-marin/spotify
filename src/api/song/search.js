import Songs from './song.model';

export default async function search(req, res) {
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
