import { makeRequest } from "@core/client";
import type {
	AlbumRetrievalOptions,
	MarketOnlyOptions,
} from "@internal/options";
import { Context, Effect, Layer } from "effect";
import { IllegalArgumentException } from "effect/Cause";
import {
	GetArtistAlbumResponseSchema,
	GetArtistResponseSchema,
	GetArtistTopTracksResponseSchema,
	GetSeveralArtistResponseSchema,
	type GetArtistAlbumRequest,
	type GetArtistAlbumResponse,
	type GetArtistRequest,
	type GetArtistResponse,
	type GetArtistTopTracksRequest,
	type GetArtistTopTracksResponse,
	type GetSeveralArtistRequest,
	type GetSeveralArtistResponse,
} from "@internal/services/artist";
import type { ApiError } from "@errors/index";
import type { AuthService } from "auth";
import {
	guardArrays,
	guardId,
	guardIds,
	guardLimit,
	guardMarket,
	guardOffset,
} from "guards";

export class ArtistService extends Context.Tag("ArtistService")<
	ArtistService,
	{
		readonly get: (
			request: GetArtistRequest,
		) => Effect.Effect<GetArtistResponse, ApiError, AuthService>;
		readonly getMany: (
			request: GetSeveralArtistRequest,
		) => Effect.Effect<GetSeveralArtistResponse, ApiError, AuthService>;
		readonly getAlbums: (
			request: GetArtistAlbumRequest,
			options?: AlbumRetrievalOptions,
		) => Effect.Effect<GetArtistAlbumResponse, ApiError, AuthService>;
		readonly getTopTracks: (
			request: GetArtistTopTracksRequest,
			options?: MarketOnlyOptions,
		) => Effect.Effect<GetArtistTopTracksResponse, ApiError, AuthService>;
	}
>() {}

export const ArtistServiceLive = Layer.effect(
	ArtistService,
	Effect.gen(function* () {
		return ArtistService.of({
			get: (request: GetArtistRequest) => {
				const { id } = request;

				guardId(id, "[ArtistService/Get] Artist id");

				return makeRequest({
					route: `artists/${id.trim()}`,
					schema: GetArtistResponseSchema,
				});
			},
			getMany: (request: GetSeveralArtistRequest) => {
				const { ids } = request;

				guardIds(ids, "[ArtistService/GetMany] Artist ids", 50);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					route: `artists?ids=${encodedIds}`,
					schema: GetSeveralArtistResponseSchema,
				});
			},
			getAlbums: (
				request: GetArtistAlbumRequest,
				options?: AlbumRetrievalOptions,
			) => {
				const { id } = request;

				guardId(id, "[ArtistService/GetAlbums] Artist id");

				if (options?.limit != null)
					guardLimit(options.limit, 10, "[ArtistService/GetAlbums]");
				if (options?.market != null)
					guardMarket(options.market, "[ArtistService/GetAlbums]");
				if (options?.offset != null)
					guardOffset(options.offset, "[ArtistService/GetAlbums]");
				if (options?.include_groups != null) {
					guardArrays(options.include_groups, "[ArtistService/GetAlbums]");
					if (
						options.include_groups.some(
							(group) =>
								group !== "album" &&
								group !== "single" &&
								group !== "appears_on" &&
								group !== "compilation",
						)
					) {
						throw new IllegalArgumentException(
							'[ArtistService/GetAlbums] Include groups can only contain "album", "single", "appears_on" or "compilation"',
						);
					}
				}

				return makeRequest({
					route: `artists/${id.trim()}/albums`,
					schema: GetArtistAlbumResponseSchema,
					options,
				});
			},
			getTopTracks: (
				request: GetArtistTopTracksRequest,
				options?: MarketOnlyOptions,
			) => {
				const { id } = request;

				guardId(id, "[ArtistService/GetTopTracks] Artist id");
				if (options?.market != null)
					guardMarket(options.market, "[ArtistService/GetTopTracks]");

				return makeRequest({
					route: `artists/${id.trim()}/top-tracks`,
					schema: GetArtistTopTracksResponseSchema,
					options,
				});
			},
		});
	}),
);
