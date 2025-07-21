const request = require("supertest");
const app = require("./server");

describe("Songs API", () => {
  describe("GET /api/songs", () => {
    it("should return paginated songs", async () => {
      const response = await request(app).get("/api/songs").expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("total");
      expect(response.body).toHaveProperty("page");
      expect(response.body).toHaveProperty("limit");
      expect(response.body).toHaveProperty("totalPages");
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should return filtered songs when search query is provided", async () => {
      const response = await request(app)
        .get("/api/songs?search=Queen")
        .expect(200);

      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty("artist", "Queen");
    });

    it("should respect pagination parameters", async () => {
      const response = await request(app)
        .get("/api/songs?page=1&limit=3")
        .expect(200);

      expect(response.body.limit).toBe(3);
      expect(response.body.data.length).toBeLessThanOrEqual(3);
    });
  });

  describe("GET /api/songs/:id", () => {
    it("should return 404 for non-existent song", async () => {
      await request(app).get("/api/songs/non-existent-id").expect(404);
    });
  });

  describe("POST /api/songs", () => {
    it("should create a new song", async () => {
      const newSong = {
        title: "Test Song",
        artist: "Test Artist",
        album: "Test Album",
        year: 2023,
        genre: "Test Genre",
        duration: "3:30",
      };

      const response = await request(app)
        .post("/api/songs")
        .send(newSong)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe(newSong.title);
      expect(response.body.artist).toBe(newSong.artist);
    });

    it("should return 400 when required fields are missing", async () => {
      const invalidSong = {
        album: "Test Album",
      };

      await request(app).post("/api/songs").send(invalidSong).expect(400);
    });
  });

  describe("GET /api/health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/api/health").expect(200);

      expect(response.body).toHaveProperty("status", "OK");
      expect(response.body).toHaveProperty("timestamp");
    });
  });

  describe("PUT /api/songs/:id", () => {
    it("should update an existing song", async () => {
      const allSongs = await request(app).get("/api/songs").expect(200);
      const songId = allSongs.body.data[0].id;
      const updatedSong = {
        title: "Updated Title",
        artist: "Updated Artist",
        album: "Updated Album",
        year: 2024,
        genre: "Updated Genre",
        duration: "4:00",
      };
      const response = await request(app)
        .put(`/api/songs/${songId}`)
        .send(updatedSong)
        .expect(200);
      expect(response.body).toHaveProperty("id", songId);
      expect(response.body.title).toBe(updatedSong.title);
      expect(response.body.artist).toBe(updatedSong.artist);
    });

    it("should return 404 for updating non-existent song", async () => {
      const updatedSong = { title: "No Song", artist: "No Artist" };
      await request(app)
        .put("/api/songs/non-existent-id")
        .send(updatedSong)
        .expect(404);
    });

    it("should return 400 if title or artist missing", async () => {
      const allSongs = await request(app).get("/api/songs").expect(200);
      const songId = allSongs.body.data[0].id;
      const invalidUpdate = { album: "No Title or Artist" };
      await request(app)
        .put(`/api/songs/${songId}`)
        .send(invalidUpdate)
        .expect(400);
    });
  });

  describe("DELETE /api/songs/:id", () => {
    it("should delete an existing song", async () => {
      const newSong = { title: "Song To Delete", artist: "Artist" };
      const createdResponse = await request(app)
        .post("/api/songs")
        .send(newSong)
        .expect(201);
      const songId = createdResponse.body.id;
      await request(app).delete(`/api/songs/${songId}`).expect(204);
      await request(app).get(`/api/songs/${songId}`).expect(404);
    });

    it("should return 404 when deleting non-existent song", async () => {
      await request(app).delete("/api/songs/non-existent-id").expect(404);
    });
  });
});
