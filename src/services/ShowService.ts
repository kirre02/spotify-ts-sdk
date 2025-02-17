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

class ShowService extends Data.TaggedClass("ShowService") {
  /**
   * Get Spotify catalog information for a single show identified by its unique Spotify ID
   *
   * @param {string} showId - The Spotify ID for the show
   * Example: `"38bS44xjbVVZ3No3ByF1dJ`
   * @param {MarketOnlyOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Show>} A show
   */
  get(showId: string, options?: MarketOnlyOptions): Promise<Show> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `shows/${encodeURIComponent(showId)}`,
          ShowSchema,
          options,
        );
      }),
    );
  }

  /**
   * Get Spotify catalog information for several shows based on their Spotify IDs
   *
   * @param {string} showIds - A comma-separated list of the Spotify IDs for the shows. Maximum: 50 IDs
   * Example: `"5CfCWKI5pZ28U0uOzXkDHe,5as3aKmN2k11yfDDDSrvaZ`
   * @param {MarketOnlyOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<SimplifiedShow[]>} A set of shows
   */
  getMany(
    showIds: string,
    options?: MarketOnlyOptions,
  ): Promise<SimplifiedShow[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        const encodedIds = showIds
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
   * @param {string} showId - The Spotify ID for the show
   * Example: `"38bS44xjbVVZ3No3ByF1dJ"`
   * @param {PaginatedMarketOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Page<SimplifiedEpisode>>} Pages of episodes
   */
  getEpisodes(
    showId: string,
    options?: PaginatedMarketOptions,
  ): Promise<Page<SimplifiedEpisode>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `shows/${encodeURIComponent(showId)}/episodes`,
          PageSchema(SimplifiedEpisodeSchema),
          options,
        );
      }),
    );
  }

  /**
   * Get a list of shows saved in the current Spotify user's library.
   *
   * @param {PaginationOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Page<SavedShow>>} Pages of shows
   */
  getSaved(options?: PaginationOptions): Promise<Page<SavedShow>> {
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
}
