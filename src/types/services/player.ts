import { EpisodeSchema } from "@schemas/services/episode";
import { TrackSchema } from "@schemas/services/track";
import { externalUrlsSchema, PagedSetSchema } from "@schemas/shared";
import { Schema } from "effect";

export const DeviceSchema = Schema.Struct({
  id: Schema.NullOr(Schema.String),
  is_active: Schema.optional(Schema.Boolean),
  is_private_session: Schema.optional(Schema.Boolean),
  is_restricted: Schema.optional(Schema.Boolean),
  name: Schema.optional(Schema.String),
  type: Schema.optional(Schema.String),
  volume_percent: Schema.NullOr(Schema.Number),
  supports_volume: Schema.optional(Schema.Boolean),
});

export const ContextSchema = Schema.Struct({
  type: Schema.optional(Schema.String),
  href: Schema.optional(Schema.String),
  external_urls: Schema.optional(externalUrlsSchema),
  uri: Schema.optional(Schema.String),
});

export const ActionSchema = Schema.Struct({
  interrupting_playback: Schema.optional(Schema.Boolean),
  pausing: Schema.optional(Schema.Boolean),
  resuming: Schema.optional(Schema.Boolean),
  seeking: Schema.optional(Schema.Boolean),
  skipping_next: Schema.optional(Schema.Boolean),
  skipping_prev: Schema.optional(Schema.Boolean),
  toggling_repeat_context: Schema.optional(Schema.Boolean),
  toggling_shuffle: Schema.optional(Schema.Boolean),
  toggling_repeat_track: Schema.optional(Schema.Boolean),
  transferring_playback: Schema.optional(Schema.Boolean),
});

export const PlaybackSchema = Schema.Struct({
  device: Schema.optional(DeviceSchema),
  repeat_state: Schema.optional(Schema.String),
  shuffle_state: Schema.optional(Schema.Boolean),
  context: Schema.NullOr(ContextSchema),
  timestamp: Schema.optional(Schema.Number),
  progress_ms: Schema.optional(Schema.Number),
  is_playing: Schema.optional(Schema.Boolean),
  item: Schema.Union(TrackSchema, EpisodeSchema, Schema.Null),
  currently_playing_type: Schema.optional(Schema.String),
  actions: ActionSchema,
});

export const PlayHistorySchema = Schema.Struct({
  track: TrackSchema,
  played_at: Schema.optional(Schema.String),
  context: ContextSchema,
});

export const GetPlaybackStateResponseSchema = PlaybackSchema;
export type GetPlaybackStateResponse = Schema.Schema.Type<typeof GetPlaybackStateResponseSchema>;

export type TransferPlaybackRequest = {
  /** The ID of the device on which playback should be started/transfered */
  deviceId: string;
  /**
   * The playback state `true`: ensure playback happens on new device `false or not provided`: keep
   * the current playback state
   */
  playbackState?: boolean;
};

export const GetAvailableDevicesResponseSchema = Schema.Struct({
  devices: Schema.Array(DeviceSchema),
});
export type GetAvailableDevicesResponse = Schema.Schema.Type<
  typeof GetAvailableDevicesResponseSchema
>;

export const GetCurrentlyPlayingResponseSchema = PlaybackSchema;
export type GetCurrentlyPlayingResponse = Schema.Schema.Type<
  typeof GetCurrentlyPlayingResponseSchema
>;

export type StartOrResumePlaybackRequest = {
  /**
   * The id of the device this command is targeting. If not supplied, the user's currently active
   * device is the target
   */
  deviceId?: string;
  /** Spotify URI of the context to play. Valid contexts are albums, artists & playlists. */
  contextUri?: string;
  /** Spotify track URIs to play. */
  uris?: string[];
  /**
   * Indicates from where in the context playback should start. Only available when contextUri
   * corresponds to an album or playlist object "position" is zero based and can't be negative
   *
   * Supply either: - `{ position: number }` - `{ uri: string }`
   */
  offset?:
    | {
        /** Zero based and non negative album or playlist index position */
        position: number;
      }
    | {
        /** A string representing the uri of the item to start at */
        uri: string;
      };
  /** Time in ms where the playback should start */
  positionMs: number;
};

export type PausePlaybackRequest = {
  /**
   * The id of the device this command is targeting. If not supplied, the user's currently active
   * device is the target
   */
  deviceId?: string;
};

export type SkipToNextRequest = {
  /**
   * The id of the device this command is targeting. If not supplied, the user's currently active
   * device is the target
   */
  deviceId?: string;
};

export type SkipToPreviousRequest = {
  /**
   * The id of the device this command is targeting. If not supplied, the user's currently active
   * device is the target
   */
  deviceId?: string;
};

export type SeekToPositionRequest = {
  /**
   * The position in milliseconds to seek to. Must be a positive number. Passing in a position that
   * is greater than the length of the track will cause the player to start playing the next song
   */
  positionMs: number;
  /**
   * The id of the device this command is targeting. If not supplied, the user's currently active
   * device is the target
   */
  deviceId?: string;
};

export type SetRepeatModeRequest = {
  /**
   * The repeat state. Possible values: **track**: will repeat the current track **context**: will
   * repeat the current context **off**: will turn repeat off
   */
  state: "track" | "context" | "off";
  /**
   * The id of the device this command is targeting. If not supplied, the user's currently active
   * device is the target
   */
  deviceId?: string;
};

export type SetPlaybackVolumeRequest = {
  /** The volume to set. Must be a value from 0 to 100 inclusive */
  volumePercent: number;
  /**
   * The id of the device this command is targeting. If not supplied, the user's currently active
   * device is the target
   */
  deviceId?: string;
};

export type TogglePlaybackShuffleRequest = {
  /**
   * The shuffle state. Possible values: **true**: Shuffle user's playback **false**: Do not shuffle
   * user's playback
   */
  state: boolean;
  /**
   * The id of the device this command is targeting. If not supplied, the user's currently active
   * device is the target
   */
  deviceId?: string;
};

export const GetRecentlyPlayedResponseSchema = PagedSetSchema(PlayHistorySchema);
export type GetRecentlyPlayedResponse = Schema.Schema.Type<typeof GetRecentlyPlayedResponseSchema>;

export const GetQueueResponseSchema = Schema.Struct({
  currently_playing: Schema.Union(TrackSchema, EpisodeSchema, Schema.Null),
  queue: Schema.Array(Schema.Union(TrackSchema, EpisodeSchema)),
});
export type GetQueueResponse = Schema.Schema.Type<typeof GetQueueResponseSchema>;

export type AddToPlaybackQueueRequest = {
  /** The uri of the item to add to the queue. Must be a track or an episode uri */
  uri: string;
  /**
   * The id of the device this command is targeting. If not supplied, the user's currently active
   * device is the target
   */
  deviceId?: string;
};
