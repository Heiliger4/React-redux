const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const songSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  artist: {
    type: String,
    required: true,
    trim: true,
  },
  album: {
    type: String,
    default: '',
    trim: true,
  },
  year: {
    type: Number,
    default: null,
  },
  genre: {
    type: String,
    default: '',
    trim: true,
  },
  duration: {
    type: String,
    default: '',
  },
  ownerId: {
    type: String,
    required: true,
    index: true,
  },
  ownerName: {
    type: String,
    default: '',
    trim: true,
  },
  isSeeded: {
    type: Boolean,
    default: false,
    index: true,
  },
}, { timestamps: true });

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
