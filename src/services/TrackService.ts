import { Data, Effect, Schema } from "effect";
import {
  makeRequest,
  type IEntity,
  type MarketOnlyOptions,
  type PaginatedMarketOptions,
} from "./EntityService";
import { PageSchema, SavedTrackSchema, TrackSchema } from "../schemas";
import type { Page, SavedTrack, Track } from "../schemas";

export class TrackService
  extends Data.TaggedClass("TrackService")
  implements IEntity<Track> {
  /**
   * Get Spotify catalog information for a single track identified by its unique Spotify ID
   *
   * @param {Object} params - The params object
   * @param {string} params.id - The Spotify ID for the track
   * Example: `"11dFghVXANMlKmJXsNCbNl"`
   * @param {MarketOnlyOptions} [params.options] - Optional filter parameters
   *
   * @returns {Promise<Track>} A track
   */
  get({
    id,
    options,
  }: {
    id: string;
    options?: MarketOnlyOptions;
  }): Promise<Track> {
    return Effect.runPromise(
      makeRequest(
        `tracks/${encodeURIComponent(id)}`,
        TrackSchema,
        options,
      )
    );
  }

  /**
   * Get Spotify catalog information for multiple tracks based on their Spotify IDs
   *
   * @param {Object} params - The params object
   * @param {string} params.ids - A comma-separated list of the Spotify IDs. Maximum: 50 IDs
   * Example: `"7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B"`
   * @param {MarketOnlyOptions} [params.options] - Optional filter parameters
   *
   * @returns {Promise<Track[]>} A set of tracks
   */
  getMany({
    ids,
    options,
  }: {
    ids: string;
    options?: MarketOnlyOptions;
  }): Promise<Track[]> {
    const encodedIds = ids
      .split(",")
      .map((id) => encodeURIComponent(id.trim()))
      .join(",");

    return Effect.runPromise(
      makeRequest(
        `tracks?ids=${encodedIds}`,
        Schema.Array(TrackSchema),
        options,
      )
    );
  }

  /**
   * Get a list of the songs saved in the current Spotify user's 'Your Music' library
   *
   * @param {Object} params - The params object
   * @param {PaginatedMarketOptions} [params.options] - Optional filter parameters
   *
   * @returns {Promise<Page<SavedTrack>>} Pages of tracks
   */
  getSaved({
    options,
  }: {
    options?: PaginatedMarketOptions;
  }): Promise<Page<SavedTrack>> {
    return Effect.runPromise(
      makeRequest(
        "me/tracks",
        PageSchema(SavedTrackSchema),
        options,
      )
    );
  }

  /**
   * Check if one or more tracks is already saved in the current Spotify user's 'Your Music' library
   *
   * @param {Object} params - The params object
   * @param {string} params.ids - A comma-separated list of the Spotify IDs. Maximum: 50 IDs
   * Example: `"7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B"`
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
        `me/tracks/contains?${encodedIds}`,
        Schema.Array(Schema.Boolean),
      )
    );
  }
}
