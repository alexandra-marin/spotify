import mongoose from 'mongoose';
import config from '../config';

export default url => {
  mongoose.connect(
    url || config.db,
    err => {
      if (err) {
        console.log(`[MongoDB] Failed to connect. ${err}`);
      } else {
        console.log(`[MongoDB] connected: ${config.db}`);
      }
    }
  );
};
