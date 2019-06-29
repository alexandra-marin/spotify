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

export default router;
