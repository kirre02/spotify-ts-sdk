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

export class AlbumService
  extends Data.TaggedClass("AlbumService")
  implements IEntity<Album> {
  /**
   * Get Spotify catalog information for a single album
   *
   * @param {Object} params - The params object
   * @param {string} params.id - The Spotify ID of the album
   * Example: `"4aawyAB9vmqN3uQ7FjRGTy"`
   * @param {MarketOnlyOptions} [params.options] - Optional filter parameters
   *
   * @returns {Promise<Album>} An album
   */
  get({
    id,
    options,
  }: {
    id: string;
    options?: MarketOnlyOptions;
  }): Promise<Album> {
    return Effect.runPromise(
      makeRequest(
        `albums/${encodeURIComponent(id)}`,
        AlbumSchema,
        options,
      )
    );
  }

  /**
   * Get Spotify catalog information for multiple albums identified by their Spotify IDs
   *
   * @param {Object} params - The params object
   * @param {string} params.ids - A comma-separated list of the Spotify IDs for the albums. Maximum: 20 IDs
   * Example: `"382ObEPsp2rxGrnsizN5TX,1A2GTWGtFfWp7KSQTwWOyo,2noRn2Aes5aoNVsU6iWThc"`
   * @param {MarketOnlyOptions} [params.options] - Optional filter parameters
   *
   * @returns {Promise<Album[]>} A set of albums
   */
  getMany({
    ids,
    options,
  }: {
    ids: string;
    options?: MarketOnlyOptions;
  }): Promise<Album[]> {
    const encodedIds = ids
      .split(",")
      .map((id) => encodeURIComponent(id.trim()))
      .join(",");

    return Effect.runPromise(
      makeRequest(
        `albums?ids=${encodedIds}`,
        Schema.Array(AlbumSchema),
        options,
      )
    );
  }

  /**
   * Get Spotify catalog information about an album’s tracks.
   *
   * @param {Object} params - The params object
   * @param {string} params.id - The Spotify ID of the album.
   * Example: `"4aawyAB9vmqN3uQ7FjRGTy"`
   * @param {PaginatedMarketOptions} [params.options] - Optional filter parameters
   *
   * @returns {Promise<Page<Track>>} Pages of tracks
   */
  getTracks({
    id,
    options,
  }: {
    id: string;
    options?: PaginatedMarketOptions;
  }): Promise<Page<Track>> {
    return Effect.runPromise(
      makeRequest(
        `albums/${encodeURIComponent(id)}/tracks`,
        PageSchema(TrackSchema),
        options,
      )
    );
  }

  /**
   * Get a list of albums saved in the current Spotify user's 'Your Music' library
   *
   * @param {Object} params - The params object
   * @param {PaginatedMarketOptions} [params.options] - Optional filter parameters
   *
   * @returns {Promise<Page<SavedAlbum>>} Pages of albums
   */
  getSaved({
    options,
  }: {
    options?: PaginatedMarketOptions;
  }): Promise<Page<SavedAlbum>> {
    return Effect.runPromise(
      makeRequest(
        "me/albums",
        PageSchema(SavedAlbumSchema),
        options,
      )
    );
  }

  /**
   * Check if one or more albums is already saved in the current Spotify user's 'Your Music' library
   *
   * @param {Object} params - The params object
   * @param {string} params.ids - A comma-separated list of the Spotify IDs for the albums. Maximum: 20 IDs
   * Example: `"382ObEPsp2rxGrnsizN5TX,1A2GTWGtFfWp7KSQTwWOyo,2noRn2Aes5aoNVsU6iWThc"`
   *
   * @returns {Promise<boolean[]>} Resolves to an array where each boolean indicates whether
   * the corresponding index in `ids` is saved (`true`) or not (`false`).
   */
  checkSaved({ ids }: { ids: string }): Promise<boolean[]> {
    const encodedIds = ids
      .split(",")
      .map((id) => encodeURIComponent(id.trim()))
      .join(",");

    return Effect.runPromise(
      makeRequest(
        `me/albums/contains?ids=${encodedIds}`,
        Schema.Array(Schema.Boolean),
      )
    );
  }

  /**
   * Get a list of new album releases featured in Spotify (shown, for example, on a Spotify player’s “Browse” tab).
   *
   * @param {Object} params - The params object
   * @param {PaginationOptions} [params.options] - Optional filter parameters
   *
   * @returns {Promise<Page<SimplifiedAlbum>>} A paged set of albums
   */
  getNewReleases({
    options,
  }: {
    options?: PaginationOptions;
  }): Promise<Page<SimplifiedAlbum>> {
    return Effect.runPromise(
      makeRequest(
        `browse/new-releases`,
        PageSchema(SimplifiedAlbumSchema),
        options,
      )
    );
  }
}
