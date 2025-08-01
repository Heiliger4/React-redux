const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cors());
// app.use(cors({ origin: 'https://addis-songs-frontend.onrender.com' }));

// connect to mongodb atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// real db model connection
const Song = require('./models/songs'); 

// fn for pagination
const paginate = (array, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  return {
    data: array.slice(startIndex, endIndex),
    total: array.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(array.length / limit)
  };
};

// get all songs 
app.get('/api/songs', async (req, res) => {
  try {
    const { page = 1, limit = 5, search = '' } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } },
        { album: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const songs = await Song.find(query).skip(skip).limit(Number(limit));
    const total = await Song.countDocuments(query);

    res.json({
      data: songs,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// get song by id
app.get('/api/songs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const song = await Song.findOne({ id });
    
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    
    res.json(song);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// create a new song
app.post('/api/songs', async (req, res) => {
  try {
    const { title, artist, album, year, genre, duration } = req.body;

    if (!title || !artist) {
      return res.status(400).json({ error: 'Title and artist are required' });
    }

    const newSong = new Song({
      title,
      artist,
      album: album || '',
      year: year || null,
      genre: genre || '',
      duration: duration || ''
    });

    const savedSong = await newSong.save();
    res.status(201).json(savedSong);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// update an existing song
app.put('/api/songs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, artist, album, year, genre, duration } = req.body;

    if (!title || !artist) {
      return res.status(400).json({ error: 'Title and artist are required' });
    }

    const updatedSong = await Song.findOneAndUpdate(
      { id },
      {
        title,
        artist,
        album: album || '',
        year: year || null,
        genre: genre || '',
        duration: duration || ''
      },
      { new: true }
    );

    if (!updatedSong) {
      return res.status(404).json({ error: 'Song not found' });
    }

    res.json(updatedSong);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// delete a song
app.delete('/api/songs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSong = await Song.findOneAndDelete({ id });

    if (!deletedSong) {
      return res.status(404).json({ error: 'Song not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
