import { Context, Effect, Layer, Schema } from "effect";
import { makeRequest } from "@core/client";
import type {
	MarketOnlyOptions,
	PaginatedMarketOptions,
	PaginationOptions,
} from "@internal/options";
import { IllegalArgumentException } from "effect/Cause";
import {
	GetAlbumResponseSchema,
	GetAlbumTracksResponseSchema,
	GetNewReleasesResponseSchema,
	GetSavedAlbumResponseSchema,
	GetSeveralAlbumResponseSchema,
	type CheckSavedAlbumRequest,
	type GetAlbumRequest,
	type GetAlbumResponse,
	type GetAlbumTracksRequest,
	type GetAlbumTracksResponse,
	type GetNewReleasesResponse,
	type GetSavedAlbumResponse,
	type GetSeveralAlbumRequest,
	type GetSeveralAlbumResponse,
	type RemoveAlbumRequest,
	type SaveAlbumRequest,
} from "@internal/services/album";
import type { ApiError } from "@errors/index";
import type { AuthService } from "auth";

export class AlbumService extends Context.Tag("AlbumService")<
	AlbumService,
	{
		readonly get: (
			request: GetAlbumRequest,
			options?: MarketOnlyOptions,
		) => Effect.Effect<GetAlbumResponse, ApiError, AuthService>;
		readonly getMany: (
			request: GetSeveralAlbumRequest,
			options?: MarketOnlyOptions,
		) => Effect.Effect<GetSeveralAlbumResponse, ApiError, AuthService>;
		readonly getTracks: (
			request: GetAlbumTracksRequest,
			options?: PaginatedMarketOptions,
		) => Effect.Effect<GetAlbumTracksResponse, ApiError, AuthService>;
		readonly getSaved: (
			options?: PaginatedMarketOptions,
		) => Effect.Effect<GetSavedAlbumResponse, ApiError, AuthService>;
		readonly save: (
			request: SaveAlbumRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly remove: (
			request: RemoveAlbumRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly checkSaved: (
			request: CheckSavedAlbumRequest,
		) => Effect.Effect<readonly boolean[], ApiError, AuthService>;
		readonly getNewReleases: (
			options?: PaginationOptions,
		) => Effect.Effect<GetNewReleasesResponse, ApiError, AuthService>;
	}
>() {}

export const AlbumServiceLive = Layer.effect(
	AlbumService,
	Effect.gen(function* () {
		return AlbumService.of({
			get: (request: GetAlbumRequest, options?: MarketOnlyOptions) => {
				const { id } = request;

				return makeRequest({
					route: `albums/${id.trim()}`,
					schema: GetAlbumResponseSchema,
					options,
				});
			},
			getMany: (
				request: GetSeveralAlbumRequest,
				options?: MarketOnlyOptions,
			) => {
				const { ids } = request;

				if (ids.length > 20)
					throw new IllegalArgumentException(
						"Maximum 20 IDs allowed per request",
					);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					route: `albums?ids=${encodedIds}`,
					schema: GetSeveralAlbumResponseSchema,
					options,
				});
			},
			getTracks: (
				request: GetAlbumTracksRequest,
				options?: PaginatedMarketOptions,
			) => {
				const { id } = request;

				if (options?.limit !== undefined) {
					if (options.limit < 0 || options.limit > 50) {
						throw new IllegalArgumentException(
							"Limit must be between 0 and 50",
						);
					}
				}

				return makeRequest({
					route: `albums/${id.trim()}/tracks`,
					schema: GetAlbumTracksResponseSchema,
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
					route: "me/albums",
					schema: GetSavedAlbumResponseSchema,
					options,
				});
			},
			save: (request: SaveAlbumRequest) => {
				const { ids } = request;

				if (ids.length > 20)
					throw new IllegalArgumentException(
						"Maximum 20 IDs allowed per request",
					);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					method: "PUT",
					route: `me/albums?ids=${encodedIds}`,
					schema: Schema.Void,
				});
			},
			remove: (request: RemoveAlbumRequest) => {
				const { ids } = request;

				if (ids.length > 20)
					throw new IllegalArgumentException(
						"Maximum 20 IDs allowed per request",
					);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					method: "DELETE",
					route: `me/albums?ids=${encodedIds}`,
					schema: Schema.Void,
				});
			},
			checkSaved: (request: CheckSavedAlbumRequest) => {
				const { ids } = request;

				if (ids.length > 20)
					throw new IllegalArgumentException(
						"Maximum 20 IDs allowed per request",
					);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					route: `me/albums/contains?ids=${encodedIds}`,
					schema: Schema.Array(Schema.Boolean),
				});
			},
			getNewReleases: (options?: PaginationOptions) => {
				if (options?.limit !== undefined) {
					if (options.limit < 0 || options.limit > 50) {
						throw new IllegalArgumentException(
							"Limit must be between 0 and 50",
						);
					}
				}
				return makeRequest({
					route: `browse/new-releases`,
					schema: GetNewReleasesResponseSchema,
					options,
				});
			},
		});
	}),
);
