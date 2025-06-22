import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPlaylistSchema, insertSongSchema, insertArtistSchema, insertAlbumSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Artists
  app.get("/api/artists", async (req, res) => {
    try {
      const artists = await storage.getAllArtists();
      res.json(artists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artists" });
    }
  });

  app.get("/api/artists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const artist = await storage.getArtist(id);
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }
      res.json(artist);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artist" });
    }
  });

  app.post("/api/artists", async (req, res) => {
    try {
      const result = insertArtistSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid artist data", errors: result.error.errors });
      }
      const artist = await storage.createArtist(result.data);
      res.status(201).json(artist);
    } catch (error) {
      res.status(500).json({ message: "Failed to create artist" });
    }
  });

  // Albums
  app.get("/api/albums", async (req, res) => {
    try {
      const albums = await storage.getAllAlbums();
      res.json(albums);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch albums" });
    }
  });

  app.get("/api/albums/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const album = await storage.getAlbumWithSongs(id);
      if (!album) {
        return res.status(404).json({ message: "Album not found" });
      }
      res.json(album);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch album" });
    }
  });

  app.post("/api/albums", async (req, res) => {
    try {
      const result = insertAlbumSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid album data", errors: result.error.errors });
      }
      const album = await storage.createAlbum(result.data);
      res.status(201).json(album);
    } catch (error) {
      res.status(500).json({ message: "Failed to create album" });
    }
  });

  // Songs
  app.get("/api/songs", async (req, res) => {
    try {
      const songs = await storage.getAllSongs();
      res.json(songs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch songs" });
    }
  });

  app.get("/api/songs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const song = await storage.getSongWithDetails(id);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }
      res.json(song);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch song" });
    }
  });

  app.post("/api/songs", async (req, res) => {
    try {
      const result = insertSongSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid song data", errors: result.error.errors });
      }
      const song = await storage.createSong(result.data);
      res.status(201).json(song);
    } catch (error) {
      res.status(500).json({ message: "Failed to create song" });
    }
  });

  // Playlists
  app.get("/api/playlists/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const playlists = await storage.getPlaylistsByUser(userId);
      res.json(playlists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch playlists" });
    }
  });

  app.get("/api/playlists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const playlist = await storage.getPlaylistWithSongs(id);
      if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      res.json(playlist);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch playlist" });
    }
  });

  app.post("/api/playlists", async (req, res) => {
    try {
      const result = insertPlaylistSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid playlist data", errors: result.error.errors });
      }
      const playlist = await storage.createPlaylist(result.data);
      res.status(201).json(playlist);
    } catch (error) {
      res.status(500).json({ message: "Failed to create playlist" });
    }
  });

  app.post("/api/playlists/:id/songs", async (req, res) => {
    try {
      const playlistId = parseInt(req.params.id);
      const { songId, position } = req.body;
      
      if (!songId) {
        return res.status(400).json({ message: "songId is required" });
      }

      const playlistSong = await storage.addSongToPlaylist({
        playlistId,
        songId,
        position: position || 0,
      });
      
      res.status(201).json(playlistSong);
    } catch (error) {
      res.status(500).json({ message: "Failed to add song to playlist" });
    }
  });

  app.delete("/api/playlists/:id/songs/:songId", async (req, res) => {
    try {
      const playlistId = parseInt(req.params.id);
      const songId = parseInt(req.params.songId);
      
      await storage.removeSongFromPlaylist(playlistId, songId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove song from playlist" });
    }
  });

  // Recently Played
  app.get("/api/recently-played/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const recentlyPlayed = await storage.getRecentlyPlayed(userId);
      res.json(recentlyPlayed);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recently played" });
    }
  });

  app.post("/api/recently-played", async (req, res) => {
    try {
      const { userId, songId } = req.body;
      
      if (!userId || !songId) {
        return res.status(400).json({ message: "userId and songId are required" });
      }

      await storage.addToRecentlyPlayed(userId, songId);
      res.status(201).json({ message: "Added to recently played" });
    } catch (error) {
      res.status(500).json({ message: "Failed to add to recently played" });
    }
  });

  // Search
  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }

      const results = await storage.searchAll(q);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
