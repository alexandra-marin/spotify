import express from 'express';
import content from './content';

const router = express.Router();

router
  .route('/:id/:filename')

  // GET /api/v1/songs - Get list of songs
  .get(content);


export default router;
