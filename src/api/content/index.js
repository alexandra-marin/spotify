import express from 'express';
import fs from 'fs';
import config from '../../config/config';

const router = express.Router();

router
  .route('/:id/:filename')

  // GET /api/v1/songs - Get list of songs
  .get(async (req, res) => {
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


export default router;
