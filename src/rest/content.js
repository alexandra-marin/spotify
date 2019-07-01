import fs from 'fs';
import config from '../config';

export default express => express.route('/content/:id/:filename').get(async (req, res) => {
  try {
    const file = `${config.fileStorage}/${req.params.id}/${req.params.filename}`;
    if (!fs.existsSync(file)) {
      res.sendStatus(404);
      return;
    }
    res.status(200).sendFile(file);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
});
