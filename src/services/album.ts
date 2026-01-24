import { Context, Effect, Layer, Schema } from "effect";
import { makeRequest } from "@core/client";
import type {
	MarketOnlyOptions,
	PaginatedMarketOptions,
	PaginationOptions,
} from "@internal/options";
import type {
	Album,
	Page,
	SavedAlbum,
	SimplifiedAlbum,
	Track,
} from "@internal/index";
import {
	AlbumSchema,
	PageSchema,
	SavedAlbumSchema,
	SimplifiedAlbumSchema,
	TrackSchema,
} from "@internal/schemas";
import { IllegalArgumentException } from "effect/Cause";
import type {
	CheckSavedAlbumRequest,
	GetAlbumRequest,
	GetAlbumTracksRequest,
	GetSeveralAlbumRequest,
	RemoveAlbumRequest,
	SaveAlbumRequest,
} from "@internal/services/album";
import type { ApiError } from "@errors/index";
import type { AuthService } from "auth";

export class AlbumService extends Context.Tag("AlbumService")<
	AlbumService,
	{
		readonly get: (
			request: GetAlbumRequest,
			options?: MarketOnlyOptions,
		) => Effect.Effect<Album, ApiError, AuthService>;
		readonly getMany: (
			request: GetSeveralAlbumRequest,
			options?: MarketOnlyOptions,
		) => Effect.Effect<Album[], ApiError, AuthService>;
		readonly getTracks: (
			request: GetAlbumTracksRequest,
			options?: PaginatedMarketOptions,
		) => Effect.Effect<Page<Track>, ApiError, AuthService>;
		readonly getSaved: (
			options?: PaginatedMarketOptions,
		) => Effect.Effect<Page<SavedAlbum>, ApiError, AuthService>;
		readonly save: (
			request: SaveAlbumRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly remove: (
			request: RemoveAlbumRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly checkSaved: (
			request: CheckSavedAlbumRequest,
		) => Effect.Effect<boolean[], ApiError, AuthService>;
		readonly getNewReleases: (
			options?: PaginationOptions,
		) => Effect.Effect<Page<SimplifiedAlbum>, ApiError, AuthService>;
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
					schema: AlbumSchema,
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
					schema: Schema.Array(AlbumSchema),
					options,
				});
			},
			getTracks: (
				request: GetAlbumTracksRequest,
				options?: PaginatedMarketOptions,
			) => {
				const { id } = request;

				return makeRequest({
					route: `albums/${id.trim()}/tracks`,
					schema: PageSchema(TrackSchema),
					options,
				});
			},
			getSaved: (options?: PaginatedMarketOptions) => {
				return makeRequest({
					route: "me/albums",
					schema: PageSchema(SavedAlbumSchema),
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
				return makeRequest({
					route: `browse/new-releases`,
					schema: PageSchema(SimplifiedAlbumSchema),
					options,
				});
			},
		});
	}),
);
