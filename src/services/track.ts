import { Context, Effect, Layer, Schema } from "effect";
import { IllegalArgumentException } from "effect/Cause";
import { makeRequest } from "@core/client";
import type {
	MarketOnlyOptions,
	PaginatedMarketOptions,
} from "@internal/options";
import {
	GetSavedTrackResponseSchema,
	GetSeveralTrackResponseSchema,
	GetTrackResponseSchema,
	type CheckSavedTrackRequest,
	type GetSavedTrackResponse,
	type GetSeveralTrackRequest,
	type GetSeveralTrackResponse,
	type GetTrackRequest,
	type GetTrackResponse,
	type RemoveTrackRequest,
	type SaveTrackRequest,
} from "@internal/services/track";
import type { ApiError } from "@errors/index";
import type { AuthService } from "auth";

export class TrackService extends Context.Tag("TrackService")<
	TrackService,
	{
		readonly get: (
			request: GetTrackRequest,
			options?: MarketOnlyOptions,
		) => Effect.Effect<GetTrackResponse, ApiError, AuthService>;
		readonly getMany: (
			request: GetSeveralTrackRequest,
			options?: MarketOnlyOptions,
		) => Effect.Effect<GetSeveralTrackResponse, ApiError, AuthService>;
		readonly getSaved: (
			options?: PaginatedMarketOptions,
		) => Effect.Effect<GetSavedTrackResponse, ApiError, AuthService>;
		readonly save: (
			request: SaveTrackRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly remove: (
			request: RemoveTrackRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly checkSaved: (
			request: CheckSavedTrackRequest,
		) => Effect.Effect<readonly boolean[], ApiError, AuthService>;
	}
>() {}

export const TrackServiceLive = Layer.effect(
	TrackService,
	Effect.gen(function* () {
		return TrackService.of({
			get: (request: GetTrackRequest, options?: MarketOnlyOptions) => {
				const { id } = request;

				return makeRequest({
					route: `tracks/${id.trim()}`,
					schema: GetTrackResponseSchema,
					options,
				});
			},
			getMany: (
				request: GetSeveralTrackRequest,
				options?: MarketOnlyOptions,
			) => {
				const { ids } = request;

				if (ids.length > 50)
					throw new IllegalArgumentException(
						"Maximum 50 IDs allowed per request",
					);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					route: `tracks?ids=${encodedIds}`,
					schema: GetSeveralTrackResponseSchema,
					options,
				});
			},
			getSaved: (options?: PaginatedMarketOptions) => {
				if (options?.limit !== undefined) {
					if (options.limit < 0 || options.limit > 50) {
						throw new IllegalArgumentException(
							"Limit must be between 0 and 50",
						);
					}
				}

				return makeRequest({
					route: "me/tracks",
					schema: GetSavedTrackResponseSchema,
					options,
				});
			},
			save: (request: SaveTrackRequest) => {
				const { ids } = request;

				if (ids.length > 50)
					throw new IllegalArgumentException(
						"Maximum 50 IDs allowed per request",
					);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					method: "PUT",
					route: `me/tracks?ids=${encodedIds}`,
					schema: Schema.Void,
				});
			},
			remove: (request: RemoveTrackRequest) => {
				const { ids } = request;

				if (ids.length > 50)
					throw new IllegalArgumentException(
						"Maximum 50 IDs allowed per request",
					);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					method: "DELETE",
					route: `me/tracks?ids=${encodedIds}`,
					schema: Schema.Void,
				});
			},
			checkSaved: (request: CheckSavedTrackRequest) => {
				const { ids } = request;

				if (ids.length > 50)
					throw new IllegalArgumentException(
						"Maximum 50 IDs allowed per request",
					);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					route: `me/tracks/contains?${encodedIds}`,
					schema: Schema.Array(Schema.Boolean),
				});
			},
		});
	}),
);
