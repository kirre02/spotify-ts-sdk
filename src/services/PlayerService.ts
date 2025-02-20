import { Data, Effect, Schema } from "effect";
import {
  makeRequest,
  type DateRangeOptions,
  type MarketAdditionalTypesOptions,
} from "./EntityService";
import {
  DeviceSchema,
  PageSchema,
  PlaybackStateSchema,
  PlayHistorySchema,
  QueueSchema,
} from "../schemas";
import type {
  Device,
  Page,
  PlaybackState,
  PlayHistory,
  Queue,
} from "../schemas";

class PlayerService extends Data.TaggedClass("PlayerService") {
  /**
   * Get information about the user's current playback state, including track or episode, progress, and active device
   *
   * @param {Object} params - The params object
   * @param {MarketAdditionalTypesOptions} [params.options] - Optional filter parameters
   *
   * @returns {Promise<PlaybackState>} Information about playback
   */
  getPlaybackState({
    options,
  }: {
    options?: MarketAdditionalTypesOptions;
  }): Promise<PlaybackState> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest("me/player", PlaybackStateSchema, options);
      }),
    );
  }

  /**
   * Get information about a user's available Spotify Connnect devices. Some device models are not supported and will not be listed in the API response
   *
   * @returns {Promise<Device[]>} A set of devices
   */
  getDevices(): Promise<Device[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          "me/player/devices",
          Schema.Array(DeviceSchema),
        );
      }),
    );
  }

  /**
   * Get the object currently being played on the user's Spotify account
   *
   * @param {Object} params - The params object
   * @param {MarketAdditionalTypesOptions} [params.options] - Optional filter parameters
   *
   * @returns {Promise<PlaybackState>} Information about the currently playing track
   */
  getCurrentlyPlaying({
    options,
  }: {
    options?: MarketAdditionalTypesOptions;
  }): Promise<PlaybackState> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          "me/player/currently-playing",
          PlaybackStateSchema,
          options,
        );
      }),
    );
  }

  /**
   * Get tracks from the current user's recently played tracks. **Note:** Currently doesn't support podcast episodes
   *
   * @param {Object} params - The params object
   * @param {DateRangeOptions} [params.options] - Optional filter parameters
   *
   * @returns {Promise<Page<PlayHistory>>} A paged set of tracks
   */
  getRecentlyPlayed({
    options,
  }: {
    options?: DateRangeOptions;
  }): Promise<Page<PlayHistory>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          "me/player/recently-played",
          PageSchema(PlayHistorySchema),
          options,
        );
      }),
    );
  }

  /**
   * Get the list of objects that make up the user's queue
   *
   * @returns {Promise<Queue>} Information about the queue
   */
  getQueue(): Promise<Queue> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest("me/player/queue", QueueSchema);
      }),
    );
  }
}
