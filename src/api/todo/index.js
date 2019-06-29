import express from 'express';
import ctrl from './todo.ctrl';

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
  .get(ctrl.get)

  // DELETE /api/v1/songs/:id - Delete song
  .delete(ctrl.remove)

  // PUT /api/v1/songs/:id - Update song
  .put(ctrl.update);

export default router;
