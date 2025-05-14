import { Data, Effect, Schema } from "effect";
import { makeRequest } from "@core/client";
import type {
	DateRangeOptions,
	MarketAdditionalTypesOptions,
} from "@internal/options";
import {
	DeviceSchema,
	PageSchema,
	PlaybackStateSchema,
	PlayHistorySchema,
	QueueSchema,
} from "@internal/schemas";
import type {
	Device,
	Page,
	PlaybackState,
	PlayHistory,
	Queue,
} from "@internal/index";
import type {
	AddToPlaybackQueueRequest,
	PausePlaybackRequest,
	SeekToPositionRequest,
	SetPlaybackVolumeRequest,
	SetRepeatModeRequest,
	SkipToNextRequest,
	SkipToPreviousRequest,
	StartOrResumePlaybackRequest,
	TogglePlaybackShuffleRequest,
	TransferPlaybackRequest,
} from "@internal/services/players";

export class PlayerService extends Data.TaggedClass("PlayerService") {
	/**
	 * Get Playback State
	 *
	 * @remarks
	 * Get information about the user's current playback state, including track or episode, progress, and active device
	 */
	getPlaybackState(
		options?: MarketAdditionalTypesOptions,
	): Promise<PlaybackState> {
		return Effect.runPromise(
			makeRequest({ route: "me/player", schema: PlaybackStateSchema, options }),
		);
	}

	/**
	 * Transfer Playback
	 *
	 * @remarks
	 * Transfer playback to a new device and optionally begin playback. Only works for users who have Spotify Premium.
	 * The order of execution is not guaranteed when used with other Player endpoints
	 */
	transferPlayback(request: TransferPlaybackRequest): Promise<void> {
		const { deviceId, playbackState } = request;

		return Effect.runPromise(
			makeRequest({
				method: "PUT",
				route: "me/player",
				schema: Schema.Void,
				body: JSON.stringify({
					device_ids: [deviceId.trim()],
					play: playbackState,
				}),
			}),
		);
	}

	/**
	 * Get Available Devices
	 *
	 * @remarks
	 * Get information about a user's available Spotify Connnect devices.
	 * Some device models are not supported and will not be listed in the API response
	 */
	getDevices(): Promise<Device[]> {
		return Effect.runPromise(
			makeRequest({
				route: "me/player/devices",
				schema: Schema.Array(DeviceSchema),
			}),
		);
	}

	/**
	 * Get Currently Playing Track
	 *
	 * @remarks
	 * Get the object currently being played on the user's Spotify account
	 */
	getCurrentlyPlaying(
		options?: MarketAdditionalTypesOptions,
	): Promise<PlaybackState> {
		return Effect.runPromise(
			makeRequest({
				route: "me/player/currently-playing",
				schema: PlaybackStateSchema,
				options,
			}),
		);
	}

	/**
	 * Start/Resume Playback
	 *
	 * @remarks
	 * Start a new context or resume current playback on the user's active device. Only works for users who have Spotify Premium.
	 * The order of execution is not guaranteed when used with other Player endpoints
	 */
	startOrResumePlayback(request: StartOrResumePlaybackRequest): Promise<void> {
		const { deviceId, contextUri, uris, offset, positionMs } = request;

		return Effect.runPromise(
			makeRequest({
				method: "PUT",
				route: deviceId
					? `/me/player/play?device_id=${deviceId}`
					: "/me/player/play",
				schema: Schema.Void,
				body: JSON.stringify({
					position_ms: positionMs,
					context_uri: contextUri,
					uris,
					offset,
				}),
			}),
		);
	}

	/**
	 * Pause Playback
	 *
	 * @remarks
	 * Pause playback on the user's account. Only works for users who have Spotify Premium.
	 * The order of execution is not guaranteed when used with other Player endpoints
	 */
	pausePlayback(request: PausePlaybackRequest): Promise<void> {
		const { deviceId } = request;

		return Effect.runPromise(
			makeRequest({
				method: "PUT",
				route: deviceId
					? `me/player/pause?device_id=${deviceId}`
					: "me/player/pause",
				schema: Schema.Void,
			}),
		);
	}

	/**
	 * Skip To Next
	 *
	 * @remarks
	 * Skips to next track in the user's queue. Only works for users who have Spotify Premium.
	 * The order of execution is not guaranteed when used with other Player endpoints
	 */
	skipToNext(request: SkipToNextRequest): Promise<void> {
		const { deviceId } = request;

		return Effect.runPromise(
			makeRequest({
				method: "POST",
				route: deviceId
					? `me/player/next?device_id=${deviceId}`
					: "me/player/next",
				schema: Schema.Void,
			}),
		);
	}

	/**
	 * Skip To Previous
	 *
	 * @remarks
	 * Skips to previous track in the user's queue. Only works for users who have Spotify Premium.
	 * The order of execution is not guaranteed when used with other Player endpoints
	 */
	skipToPrevious(request: SkipToPreviousRequest): Promise<void> {
		const { deviceId } = request;

		return Effect.runPromise(
			makeRequest({
				method: "POST",
				route: deviceId
					? `me/player/previous?device_id=${deviceId}`
					: "me/player/previous",
				schema: Schema.Void,
			}),
		);
	}

	/**
	 * Seek to position
	 *
	 * @remarks
	 * Seeks to the given position in the user's currently playing track. Only works for users who have Spotify Premium.
	 * The order of execution is not guaranteed when used with other Player endpoints
	 */
	seekToPosition(request: SeekToPositionRequest): Promise<void> {
		const { positionMs, deviceId } = request;

		return Effect.runPromise(
			makeRequest({
				method: "PUT",
				route: deviceId
					? `me/player/seek?position_ms=${positionMs}&device_id=${deviceId}`
					: `me/player/seek?position_ms=${positionMs}`,
				schema: Schema.Void,
			}),
		);
	}

	/**
	 * Set Repeat Mode
	 *
	 * @remarks
	 * Set the repeat mode for the user's playback. Only works for users who have Spotify Premium.
	 * The order of execution is not guaranteed when used with other Player endpoints
	 */
	setRepeatMode(request: SetRepeatModeRequest): Promise<void> {
		const { state, deviceId } = request;

		return Effect.runPromise(
			makeRequest({
				method: "PUT",
				route: deviceId
					? `me/player/repeat?state=${state}&device_id=${deviceId}`
					: `me/player/repeat?state=${state}`,
				schema: Schema.Void,
			}),
		);
	}

	/**
	 * Set Playback Volume
	 *
	 * @remarks
	 * Set the volume for the user's current playback device. Only works for users who have Spotify Premium.
	 * The order of execution is not guaranteed when used with other Player endpoints
	 */
	setPlaybackVolume(request: SetPlaybackVolumeRequest): Promise<void> {
		const { volumePercent, deviceId } = request;

		return Effect.runPromise(
			makeRequest({
				method: "PUT",
				route: deviceId
					? `me/player/volume?volume_percent=${volumePercent}&device_id=${deviceId}`
					: `me/player/volume?volume_percent=${volumePercent}`,
				schema: Schema.Void,
			}),
		);
	}

	/**
	 * Toggle Playback Shuffle
	 *
	 * @remarks
	 * Toggle shuffle on or off for user's playback. Only works for users who have Spotify Premium.
	 * The order of execution is not guaranteed when used with other Player endpoints
	 */
	togglePlaybackShuffle(request: TogglePlaybackShuffleRequest): Promise<void> {
		const { state, deviceId } = request;

		return Effect.runPromise(
			makeRequest({
				method: "PUT",
				route: deviceId
					? `me/player/shuffle?state=${state}&device_id=${deviceId}`
					: `me/player/shuffle?state=${state}`,
				schema: Schema.Void,
			}),
		);
	}

	/**
	 * Get Recently Played Tracks
	 *
	 * @remarks
	 * Get tracks from the current user's recently played tracks.
	 * **Note:** Currently doesn't support podcast episodes
	 */
	getRecentlyPlayed(options?: DateRangeOptions): Promise<Page<PlayHistory>> {
		return Effect.runPromise(
			makeRequest({
				route: "me/player/recently-played",
				schema: PageSchema(PlayHistorySchema),
				options,
			}),
		);
	}

	/**
	 * Get the User's Queue
	 *
	 * @remarks
	 * Get the list of objects that make up the user's queue
	 */
	getQueue(): Promise<Queue> {
		return Effect.runPromise(
			makeRequest({ route: "me/player/queue", schema: QueueSchema }),
		);
	}

	/**
	 * Add Item to Playback Queue
	 *
	 * @remarks
	 * Add an item to the end of the user's current playback queue. Only works for users who have Spotify Premium.
	 * The order of execution is not guaranteed when used with other Player endpoints
	 */
	addToPlaybackQueue(request: AddToPlaybackQueueRequest): Promise<void> {
		const { uri, deviceId } = request;

		return Effect.runPromise(
			makeRequest({
				method: "POST",
				route: deviceId
					? `me/player/queue?uri=${uri}&device_id=${deviceId}`
					: `me/player/queue?uri=${uri}`,
				schema: Schema.Void,
			}),
		);
	}
}
