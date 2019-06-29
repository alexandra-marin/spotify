import express from 'express';
import ctrl from './song.ctrl';

const router = express.Router();

router
  .route('/songs')

  // GET /api/v1/songs - Get list of songs
  .get(ctrl.search)

  // POST /api/v1/songs - Create new song
  .post(ctrl.create);

router
  .route('/songs/:id')

  // GET /api/v1/songs/:id - Get one song metadata
  .get(ctrl.get);

router
  .route('/upload-song/:id')

  // POST /api/v1/upload-song/:id - Upload song
  .post(ctrl.upload);

export default router;
