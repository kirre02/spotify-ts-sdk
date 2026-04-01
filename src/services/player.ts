import { Context, Effect, Layer, Schema } from "effect";
import { makeRequest } from "@core/client";
import type {
	DateRangeOptions,
	MarketAdditionalTypesOptions,
} from "@internal/options";
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
} from "@internal/services/player";
import type { ApiError } from "@errors/index";
import type { AuthService } from "auth";
import { IllegalArgumentException } from "effect/Cause";

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
				return makeRequest({
					route: "me/player",
					schema: GetPlaybackStateResponseSchema,
					options,
				});
			},
			transferPlayback: (request: TransferPlaybackRequest) => {
				const { deviceId, playbackState } = request;

				return makeRequest({
					method: "PUT",
					route: "me/player",
					schema: Schema.Void,
					body: JSON.stringify({
						device_ids: [deviceId.trim()],
						play: playbackState,
					}),
				});
			},
			getDevices: () => {
				return makeRequest({
					route: "me/player/devices",
					schema: GetAvailableDevicesResponseSchema,
				});
			},
			getCurrentlyPlaying: (options?: MarketAdditionalTypesOptions) => {
				return makeRequest({
					route: "me/player/currently-playing",
					schema: GetCurrentlyPlayingResponseSchema,
					options,
				});
			},
			startOrResumePlayback: (request: StartOrResumePlaybackRequest) => {
				const { deviceId, contextUri, uris, offset, positionMs } = request;

				return makeRequest({
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
				});
			},
			pausePlayback: (request: PausePlaybackRequest) => {
				const { deviceId } = request;

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
						"Volume percent must be between 0 and 100",
					);
				}

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

				return makeRequest({
					method: "PUT",
					route: deviceId
						? `me/player/shuffle?state=${state}&device_id=${deviceId}`
						: `me/player/shuffle?state=${state}`,
					schema: Schema.Void,
				});
			},
			getRecentlyPlayed: (options?: DateRangeOptions) => {
				if (options?.limit !== undefined) {
					if (options.limit < 0 || options.limit > 50) {
						throw new IllegalArgumentException(
							"Limit must be between 0 and 50",
						);
					}
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
