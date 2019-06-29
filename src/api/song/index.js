import express from 'express';
import search from './search';
import create from './create';
import get from './get';
import remove from './remove';
import upload from './upload';

const router = express.Router();

router
  .route('/songs')

  // GET /api/v1/songs - Get list of songs
  .get(search)

  // POST /api/v1/songs - Create new song
  .post(create);

router
  .route('/songs/:id')

  // GET /api/v1/songs/:id - Get one song metadata
  .get(get)

  // DELETE /api/v1/songs/:id - Delete song
  .delete(remove);

router
  .route('/upload-song/:id')

  // POST /api/v1/upload-song/:id - Upload song
  .post(upload);

export default router;
