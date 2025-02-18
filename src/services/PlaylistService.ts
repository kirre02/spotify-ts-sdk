import { Data, Effect, Schema } from "effect";
import {
  makeRequest,
  type DetailedMarketPaginationOptions,
  type MarketFieldOptions,
  type PaginationOptions,
} from "./EntityService";
import {
  SimplifiedPlaylistSchema,
  PageSchema,
  PlaylistSchema,
  PlaylistTrackSchema,
  ImageSchema,
} from "../schemas";
import type {
  SimplifiedPlaylist,
  Page,
  Playlist,
  PlaylistTrack,
  Image,
} from "../schemas";

class PlaylistService extends Data.TaggedClass("PlaylistService") {
  /**
   * Get a playlist owned by a Spotify user
   *
   * @param {string} playlistId - The Spotify ID of the playlist
   * Example: `"3cEYpjA9oz9GiPac4AsH4n"`
   * @param {MarketFieldOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Playlist>} A playlist
   */
  get(playlistId: string, options?: MarketFieldOptions): Promise<Playlist> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `playlists/${encodeURIComponent(playlistId)}`,
          PlaylistSchema,
          options,
        );
      }),
    );
  }

  /**
   * Get full details of the items of a playlist owned by a Spotify user
   *
   * @param {string} playlistId - The Spotify ID of the playlist
   * Example: `"3cEYpjA9oz9GiPac4AsH4n"`
   * @param {DetailedMarketPaginationOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Page<PlaylistTrack>>} Pages of tracks
   */
  getItems(
    playlistId: string,
    options?: DetailedMarketPaginationOptions,
  ): Promise<Page<PlaylistTrack>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `playlists/${encodeURIComponent(playlistId)}/tracks`,
          PageSchema(PlaylistTrackSchema),
          options,
        );
      }),
    );
  }

  /**
   * Get a list of the playlists owned or followed by the current Spotify user
   *
   * @param {PaginationOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Page<SimplifiedPlaylist>>} A paged set of playlists
   */
  getPlaylists(options?: PaginationOptions): Promise<Page<SimplifiedPlaylist>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          "me/playlists",
          PageSchema(SimplifiedPlaylistSchema),
          options,
        );
      }),
    );
  }

  /**
   * Get a list of the playlists owned or followed by a Spotify user
   *
   * @param {string} userId - The user's Spotify user ID
   * Example: `"smedjan"`
   * @param {PaginationOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Page<SimplifiedPlaylist>>} A paged set of playlists
   */
  getUsersPlaylists(
    userId: string,
    options?: PaginationOptions,
  ): Promise<Page<SimplifiedPlaylist>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `users/${encodeURIComponent(userId)}/playlists`,
          PageSchema(SimplifiedPlaylistSchema),
          options,
        );
      }),
    );
  }

  /**
   * Get the current image associated with a specific playlist
   *
   * @param {string} playlistId - The Spotify ID of the playlist
   * Example: `"3cEYpjA9oz9GiPac4AsH4n"`
   *
   * @returns {Promise<Image[]>} A set of images
   */
  getCoverImage(playlistId: string): Promise<Image[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `playlists/${encodeURIComponent(playlistId)}/images`,
          Schema.Array(ImageSchema),
        );
      }),
    );
  }
}
