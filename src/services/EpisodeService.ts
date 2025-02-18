import { Data, Effect, Schema } from "effect";
import {
  makeRequest,
  type IEntity,
  type MarketOnlyOptions,
  type PaginatedMarketOptions,
} from "./EntityService";
import type { Episode, Page, SavedEpisode } from "../schemas";
import { EpisodeSchema, PageSchema, SavedEpisodeSchema } from "../schemas";

class EpisodeService
  extends Data.TaggedClass("EpisodeService")
  implements IEntity<Episode>
{
  /**
   * Get Spotify catalog information for a single episode identified by its unique Spotify ID.
   *
   * @param {string} episodeId - The Spotify ID for the episode.
   * Example: `"512ojhOuo1ktJprKbVcKyQ"`
   * @param {MarketOnlyOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Episode>} An episode
   */
  get(episodeId: string, options?: MarketOnlyOptions): Promise<Episode> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `episodes/${encodeURIComponent(episodeId)}`,
          EpisodeSchema,
          options,
        );
      }),
    );
  }

  /**
   * Get Spotify catalog information for several episodes based on their Spotify IDs.
   *
   * @param {string} episodeIds - A comma-separated list of the Spotify IDs for the episodes. Maximum: 50 IDs.
   * Example: ids=77o6BIVlYM3msb4MMIL1jH,0Q86acNRm6V9GYx55SXKwf
   * @param {MarketOnlyOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Episode[]>} A set of episodes
   */
  getMany(episodeIds: string, options?: MarketOnlyOptions): Promise<Episode[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        const encodedIds = episodeIds
          .split(",")
          .map((id) => encodeURIComponent(id.trim()))
          .join(",");

        return yield* makeRequest(
          `episodes?ids=${encodedIds}`,
          Schema.Array(EpisodeSchema),
          options,
        );
      }),
    );
  }

  /**
   * Get a list of the episodes saved in the current Spotify user's library.
   * `NOTE: This endpoint is in BETA and might not work`
   *
   * @param {PaginatedMarketOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Page<SavedEpisode>>} Pages of episodes
   */
  getSaved(options?: PaginatedMarketOptions): Promise<Page<SavedEpisode>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          "me/episodes",
          PageSchema(SavedEpisodeSchema),
          options,
        );
      }),
    );
  }

  /**
   * Check if one or more episodes is already saved in the current Spotify user's 'Your Episodes' library.
   * `NOTE: This endpoint is in BETA and might not work`
   *
   * @param {string} episodeIds - A comma-separated list of the Spotify IDs for the episodes. Maximum: 50 IDs
   * Example: `"77o6BIVlYM3msb4MMIL1jH,0Q86acNRm6V9GYx55SXKwf"`
   *
   * @returns {Promise<boolean[]>} Array of booleans
   */
  checkSaved(episodeIds: string): Promise<boolean[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        const encodedIds = episodeIds
          .split(",")
          .map((id) => encodeURIComponent(id.trim()))
          .join(",");

        return yield* makeRequest(
          `me/episodes/contains?ids=${encodedIds}`,
          Schema.Array(Schema.Boolean),
        );
      }),
    );
  }
}
