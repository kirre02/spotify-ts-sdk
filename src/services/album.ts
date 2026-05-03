import { Context, Effect, Layer, Schema } from "effect";
import { makeRequest } from "@transporter";
import type {
	MarketOnlyOptions,
	PaginatedMarketOptions,
	PaginationOptions,
} from "@schemas/options";
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
} from "@schemas/services/album";
import type { ApiError } from "@errors";
import type { AuthService } from "@auth/index";
import {
	guardId,
	guardIds,
	guardLimit,
	guardMarket,
	guardOffset,
} from "@guards";

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

				guardId(id, "[AlbumService/Get] Album id");
				if (options?.market != null)
					guardMarket(options.market, "[AlbumService/Get]");

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

				guardIds(ids, "[AlbumService/GetMany] Album ids", 20);
				if (options?.market != null)
					guardMarket(options.market, "[AlbumService/GetMany]");

				const encodedIds = ids
					.map((id) => encodeURIComponent(id.trim()))
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

				guardId(id, "[AlbumService/GetTracks] Album id");
				if (options?.limit != null)
					guardLimit(options.limit, 50, "[AlbumService/GetTracks]");
				if (options?.market != null)
					guardMarket(options.market, "[AlbumService/GetTracks]");
				if (options?.offset != null)
					guardOffset(options.offset, "[AlbumService/GetTracks]");

				return makeRequest({
					route: `albums/${id.trim()}/tracks`,
					schema: GetAlbumTracksResponseSchema,
					options,
				});
			},
			getSaved: (options?: PaginatedMarketOptions) => {
				if (options?.limit != null)
					guardLimit(options.limit, 50, "[AlbumService/GetSaved]");
				if (options?.market != null)
					guardMarket(options.market, "[AlbumService/GetSaved]");
				if (options?.offset != null)
					guardOffset(options.offset, "[AlbumService/GetSaved]");

				return makeRequest({
					route: "me/albums",
					schema: GetSavedAlbumResponseSchema,
					options,
				});
			},
			save: (request: SaveAlbumRequest) => {
				const { ids } = request;

				guardIds(ids, "[AlbumService/Save] Album ids", 20);

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

				guardIds(ids, "[AlbumService/Remove] Album ids", 20);

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

				guardIds(ids, "[AlbumService/CheckSaved] Album ids", 20);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					route: `me/albums/contains?ids=${encodedIds}`,
					schema: Schema.Array(Schema.Boolean),
				});
			},
			getNewReleases: (options?: PaginationOptions) => {
				if (options?.limit != null)
					guardLimit(options.limit, 50, "[AlbumService/GetNewReleases]");
				if (options?.offset != null)
					guardOffset(options.offset, "[AlbumService/GetNewReleases]");

				return makeRequest({
					route: `browse/new-releases`,
					schema: GetNewReleasesResponseSchema,
					options,
				});
			},
		});
	}),
);
