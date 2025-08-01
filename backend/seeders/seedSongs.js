require("dotenv").config();
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Song = require("../models/songs");

const songs = [
  {
    title: "Tizita",
    artist: "Mulatu Astatke",
    album: "Ethio Jazz",
    year: 1974,
    genre: "Ethio Jazz",
    duration: "6:12",
  },
  {
    title: "Yekermo Sew",
    artist: "Mulatu Astatke",
    album: "Mulatu of Ethiopia",
    year: 1972,
    genre: "Ethio Jazz",
    duration: "4:50",
  },
  {
    title: "Endet Liyesh",
    artist: "Aster Aweke",
    album: "Aster",
    year: 1989,
    genre: "Ethiopian Pop",
    duration: "5:03",
  },
  {
    title: "Abet Abet",
    artist: "Teddy Afro",
    album: "Tikur Sew",
    year: 2012,
    genre: "Ethiopian Pop",
    duration: "4:45",
  },
  {
    title: "Lij Eyob",
    artist: "Eyob Mekonnen",
    album: "Ende Kal",
    year: 2010,
    genre: "Reggae",
    duration: "5:36",
  },
  {
    title: "Tikur Sew",
    artist: "Teddy Afro",
    album: "Tikur Sew",
    year: 2012,
    genre: "Ethiopian Pop",
    duration: "5:12",
  },
  {
    title: "Jerusalem",
    artist: "Mahmoud Ahmed",
    album: "Ere Mela Mela",
    year: 1975,
    genre: "Ethio Jazz",
    duration: "5:24",
  },
  {
    title: "Tiz Alegn",
    artist: "Gigi",
    album: "Gigi",
    year: 2001,
    genre: "Ethiopian Soul",
    duration: "4:39",
  },
  {
    title: "Shemunmunaye",
    artist: "Tilahun Gessesse",
    album: "Best of Tilahun",
    year: 1960,
    genre: "Traditional",
    duration: "3:55",
  },
  {
    title: "Gondergna",
    artist: "Mahmoud Ahmed",
    album: "Soul of Addis",
    year: 1977,
    genre: "Ethio Jazz",
    duration: "5:44",
  },
  {
    title: "Ewedishalehu",
    artist: "Aster Aweke",
    album: "Hagere",
    year: 1991,
    genre: "Ethiopian Pop",
    duration: "4:40",
  },
  {
    title: "Lanchi Biye",
    artist: "Teddy Afro",
    album: "Ethiopia",
    year: 2017,
    genre: "Ethiopian Pop",
    duration: "4:10",
  },
  {
    title: "Yegna Sew",
    artist: "Teddy Afro",
    album: "Yasteseryal",
    year: 2005,
    genre: "Ethiopian Pop",
    duration: "5:00",
  },
  {
    title: "Ambassel",
    artist: "Muluken Melesse",
    album: "Ambassel",
    year: 1973,
    genre: "Ethio Jazz",
    duration: "5:22",
  },
  {
    title: "Nanu Nanu Ney",
    artist: "Munit Mesfin",
    album: "Ethio Jazz Reimagined",
    year: 2014,
    genre: "Ethio Jazz",
    duration: "4:15",
  },
  {
    title: "Yefikir Engurguro",
    artist: "Tilahun Gessesse",
    album: "Tilahun Classics",
    year: 1970,
    genre: "Traditional",
    duration: "4:20",
  },
  {
    title: "Ye Ethiopia Lij",
    artist: "Teddy Afro",
    album: "Ethiopia",
    year: 2017,
    genre: "Ethiopian Pop",
    duration: "3:55",
  },
  {
    title: "Fikir Eskemekaber",
    artist: "Mahmoud Ahmed",
    album: "Classic Hits",
    year: 1978,
    genre: "Ethio Jazz",
    duration: "6:01",
  },
  {
    title: "Shegitu",
    artist: "Shegitu Kebede",
    album: "Shegitu",
    year: 2003,
    genre: "Ethiopian Pop",
    duration: "4:12",
  },
  {
    title: "Enkuan Yelesh",
    artist: "Betty G",
    album: "Wegegta",
    year: 2018,
    genre: "Ethiopian Soul",
    duration: "4:55",
  },
  {
    title: "Keras Yasew",
    artist: "Hachalu Hundessa",
    album: "Maalan Jira",
    year: 2015,
    genre: "Oromo Pop",
    duration: "4:33",
  },
  {
    title: "Maalan Jira",
    artist: "Hachalu Hundessa",
    album: "Maalan Jira",
    year: 2015,
    genre: "Oromo Pop",
    duration: "5:10",
  },
  {
    title: "Tizita",
    artist: "Tilahun Gessesse",
    album: "Greatest Hits",
    year: 1960,
    genre: "Traditional",
    duration: "4:00",
  },
  {
    title: "Zimita",
    artist: "Gossaye Tesfaye",
    album: "Zimita",
    year: 2010,
    genre: "Ethiopian Pop",
    duration: "4:28",
  },
  {
    title: "Konjo",
    artist: "Jano Band",
    album: "Ewedhalehu",
    year: 2012,
    genre: "Ethio Rock",
    duration: "5:05",
  },
  {
    title: "Ewedhalehu",
    artist: "Jano Band",
    album: "Ewedhalehu",
    year: 2012,
    genre: "Ethio Rock",
    duration: "4:57",
  },
  {
    title: "Mela Mela",
    artist: "Mahmoud Ahmed",
    album: "Ere Mela Mela",
    year: 1975,
    genre: "Ethio Jazz",
    duration: "5:49",
  },
  {
    title: "Eskista",
    artist: "Various Artists",
    album: "Traditional Dance",
    year: 2000,
    genre: "Traditional",
    duration: "3:45",
  },
  {
    title: "Shegaw",
    artist: "Hamere Berhane",
    album: "Shegaw",
    year: 2008,
    genre: "Ethiopian Pop",
    duration: "4:42",
  },
  {
    title: "Addis Ababa",
    artist: "Mulatu Astatke",
    album: "Ethio Jazz",
    year: 1972,
    genre: "Ethio Jazz",
    duration: "5:31",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding");

    await Song.deleteMany({});
    console.log("Cleared existing songs");

    await Song.insertMany(songs);
    console.log(`Inserted ${songs.length} songs into the database`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding songs:", err);
    process.exit(1);
  }
}

seed();
