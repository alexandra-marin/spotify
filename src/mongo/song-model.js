import mongoose from 'mongoose';

const SongsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  uri: {
    type: String
  }
});

delete mongoose.connection.models.Song;
export default mongoose.model('Song', SongsSchema);
