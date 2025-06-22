import { 
  users, artists, albums, songs, playlists, playlistSongs, recentlyPlayed,
  type User, type InsertUser,
  type Artist, type InsertArtist,
  type Album, type InsertAlbum,
  type Song, type InsertSong, type SongWithDetails,
  type Playlist, type InsertPlaylist, type PlaylistWithSongs,
  type AlbumWithSongs, type PlaylistSong, type InsertPlaylistSong,
  type RecentlyPlayed
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Artists
  getAllArtists(): Promise<Artist[]>;
  getArtist(id: number): Promise<Artist | undefined>;
  createArtist(artist: InsertArtist): Promise<Artist>;

  // Albums
  getAllAlbums(): Promise<Album[]>;
  getAlbum(id: number): Promise<Album | undefined>;
  getAlbumWithSongs(id: number): Promise<AlbumWithSongs | undefined>;
  getAlbumsByArtist(artistId: number): Promise<Album[]>;
  createAlbum(album: InsertAlbum): Promise<Album>;

  // Songs
  getAllSongs(): Promise<Song[]>;
  getSong(id: number): Promise<Song | undefined>;
  getSongWithDetails(id: number): Promise<SongWithDetails | undefined>;
  getSongsByAlbum(albumId: number): Promise<Song[]>;
  getSongsByArtist(artistId: number): Promise<Song[]>;
  searchSongs(query: string): Promise<SongWithDetails[]>;
  createSong(song: InsertSong): Promise<Song>;

  // Playlists
  getPlaylistsByUser(userId: number): Promise<Playlist[]>;
  getPlaylist(id: number): Promise<Playlist | undefined>;
  getPlaylistWithSongs(id: number): Promise<PlaylistWithSongs | undefined>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  addSongToPlaylist(playlistSong: InsertPlaylistSong): Promise<PlaylistSong>;
  removeSongFromPlaylist(playlistId: number, songId: number): Promise<void>;

  // Recently Played
  getRecentlyPlayed(userId: number): Promise<SongWithDetails[]>;
  addToRecentlyPlayed(userId: number, songId: number): Promise<void>;

  // Search
  searchAll(query: string): Promise<{
    songs: SongWithDetails[];
    artists: Artist[];
    albums: Album[];
    playlists: Playlist[];
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private artists: Map<number, Artist>;
  private albums: Map<number, Album>;
  private songs: Map<number, Song>;
  private playlists: Map<number, Playlist>;
  private playlistSongs: Map<number, PlaylistSong>;
  private recentlyPlayedMap: Map<number, RecentlyPlayed>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.artists = new Map();
    this.albums = new Map();
    this.songs = new Map();
    this.playlists = new Map();
    this.playlistSongs = new Map();
    this.recentlyPlayedMap = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    // Seed artists
    const artistsData = [
      { name: "Taylor Swift", imageUrl: "https://images.unsplash.com/photo-1494790108755-2616c9cf0f93?w=200&h=200&fit=crop", bio: "Pop superstar" },
      { name: "Drake", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop", bio: "Hip-hop artist" },
      { name: "The Weeknd", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop", bio: "R&B artist" },
      { name: "Billie Eilish", imageUrl: "https://images.unsplash.com/photo-1494790108755-2616c9cf0f93?w=200&h=200&fit=crop", bio: "Alternative pop" },
      { name: "Calvin Harris", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop", bio: "Electronic music producer" },
      { name: "Imagine Dragons", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop", bio: "Rock band" },
    ];

    artistsData.forEach(artist => {
      const id = this.currentId++;
      this.artists.set(id, { ...artist, id });
    });

    // Seed albums
    const albumsData = [
      { title: "Midnight City", artistId: 1, imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop", releaseYear: 2023, genre: "Pop" },
      { title: "Electronic Hits", artistId: 5, imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop", releaseYear: 2023, genre: "Electronic" },
      { title: "Hip-Hop Classics", artistId: 2, imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop", releaseYear: 2023, genre: "Hip-Hop" },
      { title: "Classical Essentials", artistId: 3, imageUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=200&h=200&fit=crop", releaseYear: 2023, genre: "Classical" },
      { title: "Pop Hits 2024", artistId: 1, imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop", releaseYear: 2024, genre: "Pop" },
      { title: "Jazz Legends", artistId: 4, imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop", releaseYear: 2023, genre: "Jazz" },
      { title: "Rock Anthems", artistId: 6, imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop", releaseYear: 2023, genre: "Rock" },
    ];

    albumsData.forEach(album => {
      const id = this.currentId++;
      this.albums.set(id, { ...album, id });
    });

    // Seed songs
    const songsData = [
      { title: "Blinding Lights", artistId: 3, albumId: 1, duration: 222, audioUrl: "", genre: "Pop" },
      { title: "Watermelon Sugar", artistId: 1, albumId: 1, duration: 174, audioUrl: "", genre: "Pop" },
      { title: "Good 4 U", artistId: 4, albumId: 5, duration: 178, audioUrl: "", genre: "Pop" },
      { title: "Stay", artistId: 2, albumId: 3, duration: 141, audioUrl: "", genre: "Hip-Hop" },
      { title: "Industry Baby", artistId: 2, albumId: 3, duration: 212, audioUrl: "", genre: "Hip-Hop" },
      { title: "Heat Waves", artistId: 6, albumId: 7, duration: 238, audioUrl: "", genre: "Rock" },
      { title: "Levitating", artistId: 1, albumId: 5, duration: 203, audioUrl: "", genre: "Pop" },
      { title: "Peaches", artistId: 2, albumId: 3, duration: 197, audioUrl: "", genre: "Hip-Hop" },
      { title: "Save Your Tears", artistId: 3, albumId: 1, duration: 215, audioUrl: "", genre: "Pop" },
      { title: "Positions", artistId: 4, albumId: 6, duration: 172, audioUrl: "", genre: "Pop" },
    ];

    songsData.forEach(song => {
      const id = this.currentId++;
      this.songs.set(id, { ...song, id });
    });

    // Seed playlists
    const playlistsData = [
      { name: "Liked Songs", description: "Your favorite tracks", userId: 1, imageUrl: "", isPublic: false },
      { name: "Discover Weekly", description: "Your weekly mixtape of fresh music", userId: 1, imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop", isPublic: true },
      { name: "Release Radar", description: "Catch all the latest music", userId: 1, imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop", isPublic: true },
      { name: "Daily Mix 1", description: "The Weeknd, Drake, Travis Scott and more", userId: 1, imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop", isPublic: true },
      { name: "My Playlist #1", description: "Personal collection", userId: 1, imageUrl: "", isPublic: false },
      { name: "Chill Vibes", description: "Relaxing music", userId: 1, imageUrl: "", isPublic: false },
      { name: "Workout Mix", description: "High energy tracks", userId: 1, imageUrl: "", isPublic: false },
    ];

    playlistsData.forEach(playlist => {
      const id = this.currentId++;
      this.playlists.set(id, { ...playlist, id });
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Artists
  async getAllArtists(): Promise<Artist[]> {
    return Array.from(this.artists.values());
  }

  async getArtist(id: number): Promise<Artist | undefined> {
    return this.artists.get(id);
  }

  async createArtist(insertArtist: InsertArtist): Promise<Artist> {
    const id = this.currentId++;
    const artist: Artist = { ...insertArtist, id };
    this.artists.set(id, artist);
    return artist;
  }

  // Albums
  async getAllAlbums(): Promise<Album[]> {
    return Array.from(this.albums.values());
  }

  async getAlbum(id: number): Promise<Album | undefined> {
    return this.albums.get(id);
  }

  async getAlbumWithSongs(id: number): Promise<AlbumWithSongs | undefined> {
    const album = this.albums.get(id);
    if (!album) return undefined;

    const artist = this.artists.get(album.artistId!);
    const albumSongs = Array.from(this.songs.values()).filter(song => song.albumId === id);

    return {
      ...album,
      artist: artist!,
      songs: albumSongs,
    };
  }

  async getAlbumsByArtist(artistId: number): Promise<Album[]> {
    return Array.from(this.albums.values()).filter(album => album.artistId === artistId);
  }

  async createAlbum(insertAlbum: InsertAlbum): Promise<Album> {
    const id = this.currentId++;
    const album: Album = { ...insertAlbum, id };
    this.albums.set(id, album);
    return album;
  }

  // Songs
  async getAllSongs(): Promise<Song[]> {
    return Array.from(this.songs.values());
  }

  async getSong(id: number): Promise<Song | undefined> {
    return this.songs.get(id);
  }

  async getSongWithDetails(id: number): Promise<SongWithDetails | undefined> {
    const song = this.songs.get(id);
    if (!song) return undefined;

    const artist = this.artists.get(song.artistId!);
    const album = song.albumId ? this.albums.get(song.albumId) : null;

    return {
      ...song,
      artist: artist!,
      album,
    };
  }

  async getSongsByAlbum(albumId: number): Promise<Song[]> {
    return Array.from(this.songs.values()).filter(song => song.albumId === albumId);
  }

  async getSongsByArtist(artistId: number): Promise<Song[]> {
    return Array.from(this.songs.values()).filter(song => song.artistId === artistId);
  }

  async searchSongs(query: string): Promise<SongWithDetails[]> {
    const matchingSongs = Array.from(this.songs.values()).filter(song =>
      song.title.toLowerCase().includes(query.toLowerCase())
    );

    const songsWithDetails = await Promise.all(
      matchingSongs.map(song => this.getSongWithDetails(song.id))
    );

    return songsWithDetails.filter(Boolean) as SongWithDetails[];
  }

  async createSong(insertSong: InsertSong): Promise<Song> {
    const id = this.currentId++;
    const song: Song = { ...insertSong, id };
    this.songs.set(id, song);
    return song;
  }

  // Playlists
  async getPlaylistsByUser(userId: number): Promise<Playlist[]> {
    return Array.from(this.playlists.values()).filter(playlist => playlist.userId === userId);
  }

  async getPlaylist(id: number): Promise<Playlist | undefined> {
    return this.playlists.get(id);
  }

  async getPlaylistWithSongs(id: number): Promise<PlaylistWithSongs | undefined> {
    const playlist = this.playlists.get(id);
    if (!playlist) return undefined;

    const playlistSongEntries = Array.from(this.playlistSongs.values())
      .filter(ps => ps.playlistId === id)
      .sort((a, b) => (a.position || 0) - (b.position || 0));

    const songsWithDetails = await Promise.all(
      playlistSongEntries.map(ps => this.getSongWithDetails(ps.songId!))
    );

    return {
      ...playlist,
      songs: songsWithDetails.filter(Boolean) as SongWithDetails[],
    };
  }

  async createPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const id = this.currentId++;
    const playlist: Playlist = { ...insertPlaylist, id };
    this.playlists.set(id, playlist);
    return playlist;
  }

  async addSongToPlaylist(insertPlaylistSong: InsertPlaylistSong): Promise<PlaylistSong> {
    const id = this.currentId++;
    const playlistSong: PlaylistSong = { ...insertPlaylistSong, id };
    this.playlistSongs.set(id, playlistSong);
    return playlistSong;
  }

  async removeSongFromPlaylist(playlistId: number, songId: number): Promise<void> {
    for (const [id, playlistSong] of this.playlistSongs.entries()) {
      if (playlistSong.playlistId === playlistId && playlistSong.songId === songId) {
        this.playlistSongs.delete(id);
        break;
      }
    }
  }

  // Recently Played
  async getRecentlyPlayed(userId: number): Promise<SongWithDetails[]> {
    const recentEntries = Array.from(this.recentlyPlayedMap.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.playedAt!).getTime() - new Date(a.playedAt!).getTime())
      .slice(0, 10);

    const songsWithDetails = await Promise.all(
      recentEntries.map(entry => this.getSongWithDetails(entry.songId!))
    );

    return songsWithDetails.filter(Boolean) as SongWithDetails[];
  }

  async addToRecentlyPlayed(userId: number, songId: number): Promise<void> {
    const id = this.currentId++;
    const entry: RecentlyPlayed = {
      id,
      userId,
      songId,
      playedAt: new Date(),
    };
    this.recentlyPlayedMap.set(id, entry);
  }

  // Search
  async searchAll(query: string): Promise<{
    songs: SongWithDetails[];
    artists: Artist[];
    albums: Album[];
    playlists: Playlist[];
  }> {
    const lowerQuery = query.toLowerCase();

    const songs = await this.searchSongs(query);
    const artists = Array.from(this.artists.values()).filter(artist =>
      artist.name.toLowerCase().includes(lowerQuery)
    );
    const albums = Array.from(this.albums.values()).filter(album =>
      album.title.toLowerCase().includes(lowerQuery)
    );
    const playlists = Array.from(this.playlists.values()).filter(playlist =>
      playlist.name.toLowerCase().includes(lowerQuery) && playlist.isPublic
    );

    return { songs, artists, albums, playlists };
  }
}

export const storage = new MemStorage();
