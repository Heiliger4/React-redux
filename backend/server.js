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

// In-memory storage for songs (in production, you'd use a database)
let songs = [
  {
    id: uuidv4(),
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    year: 1975,
    genre: "Rock",
    duration: "5:55"
  },
  {
    id: uuidv4(),
    title: "Hotel California",
    artist: "Eagles",
    album: "Hotel California",
    year: 1976,
    genre: "Rock",
    duration: "6:30"
  },
  {
    id: uuidv4(),
    title: "Imagine",
    artist: "John Lennon",
    album: "Imagine",
    year: 1971,
    genre: "Pop",
    duration: "3:01"
  },
  {
    id: uuidv4(),
    title: "Billie Jean",
    artist: "Michael Jackson",
    album: "Thriller",
    year: 1982,
    genre: "Pop",
    duration: "4:54"
  },
  {
    id: uuidv4(),
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    album: "Appetite for Destruction",
    year: 1987,
    genre: "Rock",
    duration: "5:03"
  },
  {
    id: uuidv4(),
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    album: "Nevermind",
    year: 1991,
    genre: "Grunge",
    duration: "5:01"
  },
  {
    id: uuidv4(),
    title: "Like a Rolling Stone",
    artist: "Bob Dylan",
    album: "Highway 61 Revisited",
    year: 1965,
    genre: "Folk Rock",
    duration: "6:13"
  },
  {
    id: uuidv4(),
    title: "Purple Haze",
    artist: "Jimi Hendrix",
    album: "Are You Experienced",
    year: 1967,
    genre: "Rock",
    duration: "2:51"
  }
];

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
app.get('/api/songs', (req, res) => {
  try {
    const { page = 1, limit = 5, search = '' } = req.query;
    
    let filteredSongs = songs;
    if (search) {
      filteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(search.toLowerCase()) ||
        song.artist.toLowerCase().includes(search.toLowerCase()) ||
        song.album.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const paginatedResult = paginate(filteredSongs, page, limit);
    res.json(paginatedResult);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// get song by id
app.get('/api/songs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const song = songs.find(s => s.id === id);
    
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    
    res.json(song);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// create a new song
app.post('/api/songs', (req, res) => {
  try {
    const { title, artist, album, year, genre, duration } = req.body;
    
    if (!title || !artist) {
      return res.status(400).json({ error: 'Title and artist are required' });
    }
    
    const newSong = {
      id: uuidv4(),
      title,
      artist,
      album: album || '',
      year: year || null,
      genre: genre || '',
      duration: duration || ''
    };
    
    songs.push(newSong);
    res.status(201).json(newSong);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// update an existing song
app.put('/api/songs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, artist, album, year, genre, duration } = req.body;
    
    const songIndex = songs.findIndex(s => s.id === id);
    
    if (songIndex === -1) {
      return res.status(404).json({ error: 'Song not found' });
    }
    
    if (!title || !artist) {
      return res.status(400).json({ error: 'Title and artist are required' });
    }
    
    songs[songIndex] = {
      ...songs[songIndex],
      title,
      artist,
      album: album || '',
      year: year || null,
      genre: genre || '',
      duration: duration || ''
    };
    
    res.json(songs[songIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// delete a song
app.delete('/api/songs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const songIndex = songs.findIndex(s => s.id === id);
    
    if (songIndex === -1) {
      return res.status(404).json({ error: 'Song not found' });
    }
    
    songs.splice(songIndex, 1);
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
