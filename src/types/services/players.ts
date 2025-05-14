import type { Range } from "@internal/index";

export type TransferPlaybackRequest = {
	/**
	 * The ID of the device on which playback should be started/transfered
	 */
	deviceId: string;
	/**
	 * The playback state
	 * `true`: ensure playback happens on new device
	 * `false`: or not provided: keep the current playback state
	 */
	playbackState?: boolean;
};

export type StartOrResumePlaybackRequest = {
	/**
	 * The id of the device this command is targeting. If not supplied, the user's currently active device is the target
	 */
	deviceId?: string;
	/**
	 * Spotify URI of the context to play. Valid contexts are albums, artists & playlists.
	 */
	contextUri?: string;
	/**
	 * Spotify track URIs to play.
	 */
	uris?: string[];
	/**
	 * Indicates from where in the context playback should start. Only available when contextUri corresponds to an album or playlist object "position" is zero based and can't be negative
	 *
	 * Supply either:
	 * - `{ position: number }`
	 * - `{ uri: string }`
	 */
	offset?:
		| {
				/**
				 * Zero based and non negative album or playlist index position
				 */
				position: number;
		  }
		| {
				/**
				 * A string representing the uri of the item to start at
				 */
				uri: string;
		  };
	/**
	 * Time in ms where the playback should start
	 */
	positionMs: number;
};

export type PausePlaybackRequest = {
	/**
	 * The id of the device this command is targeting. If not supplied, the user's currently active device is the target
	 */
	deviceId?: string;
};

export type SkipToNextRequest = {
	/**
	 * The id of the device this command is targeting. If not supplied, the user's currently active device is the target
	 */
	deviceId?: string;
};

export type SkipToPreviousRequest = {
	/**
	 * The id of the device this command is targeting. If not supplied, the user's currently active device is the target
	 */
	deviceId?: string;
};

export type SeekToPositionRequest = {
	/**
	 * The position in milliseconds to seek to. Must be a positive number. Passing in a position that is greater than the length of the track will cause the player to start playing the next song
	 */
	positionMs: number;
	/**
	 * The id of the device this command is targeting. If not supplied, the user's currently active device is the target
	 */
	deviceId?: string;
};

export type SetRepeatModeRequest = {
	/**
	 * The repeat state. Possible values:
	 * **track**: will repeat the current track
	 * **context**: will repeat the current context
	 * **off**: will turn repeat off
	 */
	state: "track" | "context" | "off";
	/**
	 * The id of the device this command is targeting. If not supplied, the user's currently active device is the target
	 */
	deviceId?: string;
};

export type SetPlaybackVolumeRequest = {
	/**
	 * The volume to set. Must be a value from 0 to 100 inclusive
	 */
	volumePercent: Range<0, 100>;
	/**
	 * The id of the device this command is targeting. If not supplied, the user's currently active device is the target
	 */
	deviceId?: string;
};

export type TogglePlaybackShuffleRequest = {
	/**
	 * The shuffle state. Possible values:
	 * **true**: Shuffle user's playback
	 * **false**: Do not shuffle user's playback
	 */
	state: boolean;
	/**
	 * The id of the device this command is targeting. If not supplied, the user's currently active device is the target
	 */
	deviceId?: string;
};

export type AddToPlaybackQueueRequest = {
	/**
	 * The uri of the item to add to the queue. Must be a track or an episode uri
	 */
	uri: string;
	/**
	 * The id of the device this command is targeting. If not supplied, the user's currently active device is the target
	 */
	deviceId?: string;
};
