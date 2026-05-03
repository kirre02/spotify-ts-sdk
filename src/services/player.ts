import { Context, Effect, Layer, Schema } from "effect";
import { makeRequest } from "@transporter";
import type {
	DateRangeOptions,
	MarketAdditionalTypesOptions,
} from "@schemas/options";
import {
	GetAvailableDevicesResponseSchema,
	GetCurrentlyPlayingResponseSchema,
	GetPlaybackStateResponseSchema,
	GetQueueResponseSchema,
	GetRecentlyPlayedResponseSchema,
	type AddToPlaybackQueueRequest,
	type GetAvailableDevicesResponse,
	type GetCurrentlyPlayingResponse,
	type GetPlaybackStateResponse,
	type GetQueueResponse,
	type GetRecentlyPlayedResponse,
	type PausePlaybackRequest,
	type SeekToPositionRequest,
	type SetPlaybackVolumeRequest,
	type SetRepeatModeRequest,
	type SkipToNextRequest,
	type SkipToPreviousRequest,
	type StartOrResumePlaybackRequest,
	type TogglePlaybackShuffleRequest,
	type TransferPlaybackRequest,
} from "@schemas/services/player";
import type { ApiError } from "@errors";
import type { AuthService } from "@auth/index";
import { IllegalArgumentException } from "effect/Cause";
import {
	guardAdditionalTypes,
	guardContextUri,
	guardLimit,
	guardMarket,
	guardSpotifyUri,
	guardString,
	guardTimestamp,
	guardUris,
} from "@guards";

export class PlayerService extends Context.Tag("PlayerService")<
	PlayerService,
	{
		readonly getPlaybackState: (
			options?: MarketAdditionalTypesOptions,
		) => Effect.Effect<GetPlaybackStateResponse, ApiError, AuthService>;
		readonly transferPlayback: (
			request: TransferPlaybackRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly getDevices: () => Effect.Effect<
			GetAvailableDevicesResponse,
			ApiError,
			AuthService
		>;
		readonly getCurrentlyPlaying: (
			options?: MarketAdditionalTypesOptions,
		) => Effect.Effect<GetCurrentlyPlayingResponse, ApiError, AuthService>;
		readonly startOrResumePlayback: (
			request: StartOrResumePlaybackRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly pausePlayback: (
			request: PausePlaybackRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly skipToNext: (
			request: SkipToNextRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly skipToPrevious: (
			request: SkipToPreviousRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly seekToPosition: (
			request: SeekToPositionRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly setRepeatMode: (
			request: SetRepeatModeRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly setPlaybackVolume: (
			request: SetPlaybackVolumeRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly togglePlaybackShuffle: (
			request: TogglePlaybackShuffleRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly getRecentlyPlayed: (
			options?: DateRangeOptions,
		) => Effect.Effect<GetRecentlyPlayedResponse, ApiError, AuthService>;
		readonly getQueue: () => Effect.Effect<
			GetQueueResponse,
			ApiError,
			AuthService
		>;
		readonly addToPlaybackQueue: (
			request: AddToPlaybackQueueRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
	}
>() {}

export const PlayerServiceLive = Layer.effect(
	PlayerService,
	Effect.gen(function* () {
		return PlayerService.of({
			getPlaybackState: (options?: MarketAdditionalTypesOptions) => {
				if (options?.market != null)
					guardMarket(options.market, "[PlayerService/GetPlaybackState]");
				if (options?.additional_types != null)
					guardAdditionalTypes(
						options.additional_types,
						"[PlayerService/GetPlaybackState]",
					);

				return makeRequest({
					route: "me/player",
					schema: GetPlaybackStateResponseSchema,
					options,
				});
			},
			transferPlayback: (request: TransferPlaybackRequest) => {
				const { deviceId, playbackState } = request;

				guardString(deviceId, "[PlayerService/TransferPlayback] Device id");
				if (playbackState != null && typeof playbackState !== "boolean")
					throw new IllegalArgumentException(
						"[PlayerService/TransferPlayback] Playback state must be a boolean",
					);

				return makeRequest({
					method: "PUT",
					route: "me/player",
					schema: Schema.Void,
					body: {
						device_ids: [deviceId.trim()],
						play: playbackState,
					},
				});
			},
			getDevices: () => {
				return makeRequest({
					route: "me/player/devices",
					schema: GetAvailableDevicesResponseSchema,
				});
			},
			getCurrentlyPlaying: (options?: MarketAdditionalTypesOptions) => {
				if (options?.market != null)
					guardMarket(options.market, "[PlayerService/GetCurrentlyPlaying]");
				if (options?.additional_types != null)
					guardAdditionalTypes(
						options.additional_types,
						"[PlayerService/GetCurrentlyPlaying]",
					);

				return makeRequest({
					route: "me/player/currently-playing",
					schema: GetCurrentlyPlayingResponseSchema,
					options,
				});
			},
			startOrResumePlayback: (request: StartOrResumePlaybackRequest) => {
				const { deviceId, contextUri, uris, offset, positionMs } = request;

				if (deviceId != null)
					guardString(
						deviceId,
						"[PlayerService/StartOrResumePlayback] Device id",
					);
				if (contextUri != null && uris != null)
					throw new IllegalArgumentException(
						"[PlayerService/StartOrResumePlayback] Only one of contextUri & uris can be provided",
					);
				if (offset != null && contextUri == null)
					throw new IllegalArgumentException(
						"[PlayerService/StartOrResumePlayback] Offset can only be used with contextUri",
					);
				if (contextUri != null)
					guardContextUri(
						contextUri,
						"[PlayerService/StartOrResumePlayback] Context uri",
					);
				if (uris != null)
					guardUris(uris, "[PlayerService/StartOrResumePlayback] Uris");
				if (offset != null && "position" in offset) {
					if (offset.position < 0)
						throw new IllegalArgumentException(
							"[PlayerService/StartOrResumePlayback] Offset position can not be negative",
						);
				}
				if (offset != null && "uri" in offset)
					guardSpotifyUri(
						offset.uri,
						"[PlayerService/StartOrResumePlayback] Offset uri",
					);
				if (positionMs != null && positionMs < 0)
					throw new IllegalArgumentException(
						"[PlayerService/StartOrResumePlayback] Position ms can not be negative",
					);

				return makeRequest({
					method: "PUT",
					route: deviceId
						? `me/player/play?device_id=${deviceId}`
						: "/me/player/play",
					schema: Schema.Void,
					body: {
						position_ms: positionMs,
						context_uri: contextUri,
						uris,
						offset,
					},
				});
			},
			pausePlayback: (request: PausePlaybackRequest) => {
				const { deviceId } = request;

				if (deviceId != null)
					guardString(deviceId, "[PlayerService/PausePlayback] Device id");

				return makeRequest({
					method: "PUT",
					route: deviceId
						? `me/player/pause?device_id=${deviceId}`
						: "me/player/pause",
					schema: Schema.Void,
				});
			},
			skipToNext: (request: SkipToNextRequest) => {
				const { deviceId } = request;

				if (deviceId != null)
					guardString(deviceId, "[PlayerService/SkipToNext] Device id");

				return makeRequest({
					method: "POST",
					route: deviceId
						? `me/player/next?device_id=${deviceId}`
						: "me/player/next",
					schema: Schema.Void,
				});
			},
			skipToPrevious: (request: SkipToPreviousRequest) => {
				const { deviceId } = request;

				if (deviceId != null)
					guardString(deviceId, "[PlayerService/SkipToPrevious] Device id");

				return makeRequest({
					method: "POST",
					route: deviceId
						? `me/player/previous?device_id=${deviceId}`
						: "me/player/previous",
					schema: Schema.Void,
				});
			},
			seekToPosition: (request: SeekToPositionRequest) => {
				const { positionMs, deviceId } = request;

				if (positionMs == null)
					throw new IllegalArgumentException(
						"[PlayerService/SeekToPosition] Position ms must be provided",
					);
				if (positionMs < 0)
					throw new IllegalArgumentException(
						"[PlayerService/SeekToPosition] Position ms can not be negative",
					);
				if (deviceId != null)
					guardString(deviceId, "[PlayerService/SeekToPosition] Device id");

				return makeRequest({
					method: "PUT",
					route: deviceId
						? `me/player/seek?position_ms=${positionMs}&device_id=${deviceId}`
						: `me/player/seek?position_ms=${positionMs}`,
					schema: Schema.Void,
				});
			},
			setRepeatMode: (request: SetRepeatModeRequest) => {
				const { state, deviceId } = request;

				if (state !== "track" && state !== "context" && state !== "off")
					throw new IllegalArgumentException(
						"[PlayerService/SetRepeatMode] State must be either track, context or off",
					);
				if (deviceId != null)
					guardString(deviceId, "[PlayerService/SetRepeatMode] Device id");

				return makeRequest({
					method: "PUT",
					route: deviceId
						? `me/player/repeat?state=${state}&device_id=${deviceId}`
						: `me/player/repeat?state=${state}`,
					schema: Schema.Void,
				});
			},
			setPlaybackVolume: (request: SetPlaybackVolumeRequest) => {
				const { volumePercent, deviceId } = request;

				if (volumePercent < 0 || volumePercent > 100) {
					throw new IllegalArgumentException(
						"[PlayerService/SetPlaybackVolume] Volume percent must be between 0 and 100",
					);
				}
				if (deviceId != null)
					guardString(deviceId, "[PlayerService/SetPlaybackVolume] Device id");

				return makeRequest({
					method: "PUT",
					route: deviceId
						? `me/player/volume?volume_percent=${volumePercent}&device_id=${deviceId}`
						: `me/player/volume?volume_percent=${volumePercent}`,
					schema: Schema.Void,
				});
			},
			togglePlaybackShuffle: (request: TogglePlaybackShuffleRequest) => {
				const { state, deviceId } = request;

				if (typeof state !== "boolean")
					throw new IllegalArgumentException(
						"[PlayerService/TogglePlaybackShuffle] State must be a boolean",
					);

				if (deviceId != null)
					guardString(
						deviceId,
						"[PlayerService/TogglePlaybackShuffle] Device id",
					);

				return makeRequest({
					method: "PUT",
					route: deviceId
						? `me/player/shuffle?state=${state}&device_id=${deviceId}`
						: `me/player/shuffle?state=${state}`,
					schema: Schema.Void,
				});
			},
			getRecentlyPlayed: (options?: DateRangeOptions) => {
				if (options?.limit != null)
					guardLimit(options.limit, 50, "[PlayerService/GetRecentlyPlayed]");
				if (options != null && "before" in options && "after" in options) {
					throw new IllegalArgumentException(
						"[PlayerService/GetRecentlyPlayed] Can not specify both before and after",
					);
				} else if (
					options != null &&
					"before" in options &&
					options.before != null
				) {
					guardTimestamp(options.before, "[PlayerService/GetRecentlyPlayed]");
				} else if (
					options != null &&
					"after" in options &&
					options.after != null
				) {
					guardTimestamp(options.after, "[PlayerService/GetRecentlyPlayed]");
				}

				return makeRequest({
					route: "me/player/recently-played",
					schema: GetRecentlyPlayedResponseSchema,
					options,
				});
			},
			getQueue: () => {
				return makeRequest({
					route: "me/player/queue",
					schema: GetQueueResponseSchema,
				});
			},
			addToPlaybackQueue: (request: AddToPlaybackQueueRequest) => {
				const { uri, deviceId } = request;

				guardSpotifyUri(uri, "[PlayerService/AddToPlaybackQueue] uri");
				if (
					!uri.startsWith("spotify:track") &&
					!uri.startsWith("spotify:episode")
				)
					throw new IllegalArgumentException(
						"[PlayerService/AddToPlaybackQueue] Provided uri must be a track or an episode uri",
					);

				if (deviceId != null)
					guardString(deviceId, "[PlayerService/AddToPlaybackQueue] Device id");

				return makeRequest({
					method: "POST",
					route: deviceId
						? `me/player/queue?uri=${uri}&device_id=${deviceId}`
						: `me/player/queue?uri=${uri}`,
					schema: Schema.Void,
				});
			},
		});
	}),
);
