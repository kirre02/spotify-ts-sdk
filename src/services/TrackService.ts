import { Data, Effect, Schema } from "effect";
import {
  makeRequest,
  type IEntity,
  type MarketOnlyOptions,
  type PaginatedMarketOptions,
} from "./EntityService";
import { PageSchema, SavedTrackSchema, TrackSchema } from "../schemas";
import type { Page, SavedTrack, Track } from "../schemas";

class TrackService
  extends Data.TaggedClass("TrackService")
  implements IEntity<Track>
{
  /**
   * Get Spotify catalog information for a single track identified by its unique Spotify ID
   *
   * @param {string} trackId - The Spotify ID for the track
   * Example: `"11dFghVXANMlKmJXsNCbNl"`
   * @param {MarketOnlyOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Track>} A track
   */
  get(trackId: string, options?: MarketOnlyOptions): Promise<Track> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `tracks/${encodeURIComponent(trackId)}`,
          TrackSchema,
          options,
        );
      }),
    );
  }

  /**
   * Get Spotify catalog information for multiple tracks based on their Spotify IDs
   *
   * @param {string} trackIds - A comma-separated list of the Spotify IDs. Maximum: 50 IDs
   * Example: `"7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B"`
   * @param {MarketOnlyOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Track[]>} A set of tracks
   */
  getMany(trackIds: string, options?: MarketOnlyOptions): Promise<Track[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        const encodedIds = trackIds
          .split(",")
          .map((id) => encodeURIComponent(id.trim()))
          .join(",");
        return yield* makeRequest(
          `tracks?ids=${encodedIds}`,
          Schema.Array(TrackSchema),
          options,
        );
      }),
    );
  }

  /**
   * Get a list of the songs saved in the current Spotify user's 'Your Music' library
   *
   * @param {PaginatedMarketOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Page<SavedTrack>>} Pages of tracks
   */
  getSaved(options?: PaginatedMarketOptions): Promise<Page<SavedTrack>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `me/tracks`,
          PageSchema(SavedTrackSchema),
          options,
        );
      }),
    );
  }
}
