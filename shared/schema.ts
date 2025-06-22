import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  bio: text("bio"),
});

export const albums = pgTable("albums", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artistId: integer("artist_id").references(() => artists.id),
  imageUrl: text("image_url"),
  releaseYear: integer("release_year"),
  genre: text("genre"),
});

export const songs = pgTable("songs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artistId: integer("artist_id").references(() => artists.id),
  albumId: integer("album_id").references(() => albums.id),
  duration: integer("duration"), // in seconds
  audioUrl: text("audio_url"),
  genre: text("genre"),
});

export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: integer("user_id").references(() => users.id),
  imageUrl: text("image_url"),
  isPublic: boolean("is_public").default(false),
});

export const playlistSongs = pgTable("playlist_songs", {
  id: serial("id").primaryKey(),
  playlistId: integer("playlist_id").references(() => playlists.id),
  songId: integer("song_id").references(() => songs.id),
  position: integer("position"),
});

export const recentlyPlayed = pgTable("recently_played", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  songId: integer("song_id").references(() => songs.id),
  playedAt: timestamp("played_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertArtistSchema = createInsertSchema(artists).omit({ id: true });
export const insertAlbumSchema = createInsertSchema(albums).omit({ id: true });
export const insertSongSchema = createInsertSchema(songs).omit({ id: true });
export const insertPlaylistSchema = createInsertSchema(playlists).omit({ id: true });
export const insertPlaylistSongSchema = createInsertSchema(playlistSongs).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Artist = typeof artists.$inferSelect;
export type InsertArtist = z.infer<typeof insertArtistSchema>;

export type Album = typeof albums.$inferSelect;
export type InsertAlbum = z.infer<typeof insertAlbumSchema>;

export type Song = typeof songs.$inferSelect;
export type InsertSong = z.infer<typeof insertSongSchema>;

export type Playlist = typeof playlists.$inferSelect;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;

export type PlaylistSong = typeof playlistSongs.$inferSelect;
export type InsertPlaylistSong = z.infer<typeof insertPlaylistSongSchema>;

export type RecentlyPlayed = typeof recentlyPlayed.$inferSelect;

// Extended types for API responses
export type SongWithDetails = Song & {
  artist: Artist;
  album: Album | null;
};

export type PlaylistWithSongs = Playlist & {
  songs: SongWithDetails[];
};

export type AlbumWithSongs = Album & {
  artist: Artist;
  songs: Song[];
};
