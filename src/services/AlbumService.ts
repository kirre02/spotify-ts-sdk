import { Data, Effect, Schema } from "effect";
import {
  type IEntity,
  makeRequest,
  type MarketOnlyOptions,
  type PaginatedMarketOptions,
  type PaginationOptions,
} from "./EntityService";
import type {
  Album,
  Page,
  SavedAlbum,
  SimplifiedAlbum,
  Track,
} from "../schemas";
import {
  AlbumSchema,
  PageSchema,
  SavedAlbumSchema,
  SimplifiedAlbumSchema,
  TrackSchema,
} from "../schemas";

class AlbumService
  extends Data.TaggedClass("AlbumService")
  implements IEntity<Album>
{
  /**
   * Get Spotify catalog information for a single album
   *
   * @param {string} albumId - The Spotify ID of the album
   * Example: `"4aawyAB9vmqN3uQ7FjRGTy"`
   * @param {MarketOnlyOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Album>} An album
   */
  get(albumId: string, options?: MarketOnlyOptions): Promise<Album> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `albums/${encodeURIComponent(albumId)}`,
          AlbumSchema,
          options,
        );
      }),
    );
  }

  /**
   * Get Spotify catalog information for multiple albums identified by their Spotify IDs
   *
   * @param {string} albumIds - A comma-separated list of the Spotify IDs for the albums. Maximum: 20 IDs
   * Example: `"382ObEPsp2rxGrnsizN5TX,1A2GTWGtFfWp7KSQTwWOyo,2noRn2Aes5aoNVsU6iWThc"`
   * @param {MarketOnlyOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Album[]>} A set of albums
   */
  getMany(albumIds: string, options?: MarketOnlyOptions): Promise<Album[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        const encodedIds = albumIds
          .split(",")
          .map((id) => encodeURIComponent(id.trim()))
          .join(",");

        return yield* makeRequest(
          `albums?ids=${encodedIds}`,
          Schema.Array(AlbumSchema),
          options,
        );
      }),
    );
  }

  /**
   * Get Spotify catalog information about an album’s tracks.
   *
   * @param {string} albumId - The Spotify ID of the album.
   * Example: `"4aawyAB9vmqN3uQ7FjRGTy"`
   * @param {PaginatedMarketOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Page<Track>>} Pages of tracks
   */
  getTracks(
    albumId: string,
    options?: PaginatedMarketOptions,
  ): Promise<Page<Track>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `albums/${encodeURIComponent(albumId)}/tracks`,
          PageSchema(TrackSchema),
          options,
        );
      }),
    );
  }

  /**
   * Get a list of albums saved in the current Spotify user's 'Your Music' library
   *
   * @param {PaginatedMarketOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Page<SavedAlbum>>} Pages of albums
   */
  getSaved(options?: PaginatedMarketOptions): Promise<Page<SavedAlbum>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          "me/albums",
          PageSchema(SavedAlbumSchema),
          options,
        );
      }),
    );
  }

  /**
   * Check if one or more albums is already saved in the current Spotify user's 'Your Music' library
   *
   * @param {string} albumIds - A comma-separated list of the Spotify IDs for the albums. Maximum: 20 IDs
   * Example: `"382ObEPsp2rxGrnsizN5TX,1A2GTWGtFfWp7KSQTwWOyo,2noRn2Aes5aoNVsU6iWThc"`
   *
   * @returns {Promise<boolean[]>} Array of booleans
   */
  checkSaved(albumIds: string): Promise<boolean[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        const encodedIds = albumIds
          .split(",")
          .map((id) => encodeURIComponent(id.trim()))
          .join(",");

        return yield* makeRequest(
          `me/albums/contains?ids=${encodedIds}`,
          Schema.Array(Schema.Boolean),
        );
      }),
    );
  }

  /**
   * Get a list of new album releases featured in Spotify (shown, for example, on a Spotify player’s “Browse” tab).
   *
   * @param {PaginationOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Page<SimplifiedAlbum>>}
   */
  getNewReleases(options?: PaginationOptions): Promise<Page<SimplifiedAlbum>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `browse/new-releases`,
          PageSchema(SimplifiedAlbumSchema),
          options,
        );
      }),
    );
  }
}
