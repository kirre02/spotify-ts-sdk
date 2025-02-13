import { Data, Effect, Schema } from "effect";
import {
  makeRequest,
  type IEntity,
  type MarketOnlyOptions,
} from "./EntityService";
import type { Episode } from "../schemas";
import { EpisodeSchema } from "../schemas";

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
}
