import { Data, Effect, Schema } from "effect";
import {
  makeRequest,
  type MarketOnlyOptions,
  type PaginatedMarketOptions,
  type PaginationOptions,
} from "./EntityService";
import {
  PageSchema,
  SavedShowSchema,
  ShowSchema,
  SimplifiedEpisodeSchema,
  SimplifiedShowSchema,
} from "../schemas";
import type {
  Page,
  SavedShow,
  Show,
  SimplifiedEpisode,
  SimplifiedShow,
} from "../schemas";

export class ShowService extends Data.TaggedClass("ShowService") {
  /**
   * Get Spotify catalog information for a single show identified by its unique Spotify ID
   *
   * @param {Object} params - The params object
   * @param {string} params.id - The Spotify ID for the show
   * Example: `"38bS44xjbVVZ3No3ByF1dJ`
   * @param {MarketOnlyOptions} [params.options] - Optional filter parameters
   *
   * @returns {Promise<Show>} A show
   */
  get({
    id,
    options,
  }: {
    id: string;
    options?: MarketOnlyOptions;
  }): Promise<Show> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `shows/${encodeURIComponent(id)}`,
          ShowSchema,
          options,
        );
      }),
    );
  }

  /**
   * Get Spotify catalog information for several shows based on their Spotify IDs
   *
   * @param {Object} params - The params object
   * @param {string} params.ids - A comma-separated list of the Spotify IDs for the shows. Maximum: 50 IDs
   * Example: `"5CfCWKI5pZ28U0uOzXkDHe,5as3aKmN2k11yfDDDSrvaZ`
   * @param {MarketOnlyOptions} [params.options] - Optional filter parameters
   *
   * @returns {Promise<SimplifiedShow[]>} A set of shows
   */
  getMany({
    ids,
    options,
  }: {
    ids: string;
    options?: MarketOnlyOptions;
  }): Promise<SimplifiedShow[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        const encodedIds = ids
          .split(",")
          .map((id) => encodeURIComponent(id.trim()))
          .join(",");

        return yield* makeRequest(
          `shows?${encodedIds}`,
          Schema.Array(SimplifiedShowSchema),
          options,
        );
      }),
    );
  }

  /**
   * Get Spotify catalog information about an show's episodes.
   *
   * @param {Object} params - The params object
   * @param {string} params.id - The Spotify ID for the show
   * Example: `"38bS44xjbVVZ3No3ByF1dJ"`
   * @param {PaginatedMarketOptions} [params.options] - Optional filter parameters
   *
   * @returns {Promise<Page<SimplifiedEpisode>>} Pages of episodes
   */
  getEpisodes({
    id,
    options,
  }: {
    id: string;
    options?: PaginatedMarketOptions;
  }): Promise<Page<SimplifiedEpisode>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `shows/${encodeURIComponent(id)}/episodes`,
          PageSchema(SimplifiedEpisodeSchema),
          options,
        );
      }),
    );
  }

  /**
   * Get a list of shows saved in the current Spotify user's library.
   *
   * @param {Object} params - The params object
   * @param {PaginationOptions} [params.options] - Optional filter parameters
   *
   * @returns {Promise<Page<SavedShow>>} Pages of shows
   */
  getSaved({
    options,
  }: {
    options?: PaginationOptions;
  }): Promise<Page<SavedShow>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `me/shows`,
          PageSchema(SavedShowSchema),
          options,
        );
      }),
    );
  }

  /**
   * Check if one or more shows is already saved in the current Spotify user's library
   *
   * @param {Object} params - The params object
   * @param {string} params.ids - A comma-separated list of the Spotify IDs for the shows. Maximum: 50 IDs
   * Example: `"5CfCWKI5pZ28U0uOzXkDHe,5as3aKmN2k11yfDDDSrvaZ"`
   *
   * @returns {Promise<boolean[]>} Resolves to an array where each boolean indicates whether
   * the corresponding index in `ids` is saved (`true`) or not (`false`).
   */
  checkSaved({ ids }: { ids: string }): Promise<boolean[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        const encodedIds = ids
          .split(",")
          .map((id) => encodeURIComponent(id.trim()))
          .join(",");

        return yield* makeRequest(
          `me/shows/contains?${encodedIds}`,
          Schema.Array(Schema.Boolean),
        );
      }),
    );
  }
}
