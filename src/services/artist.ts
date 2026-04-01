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

				return makeRequest({
					route: `artists/${id.trim()}`,
					schema: GetArtistResponseSchema,
				});
			},
			getMany: (request: GetSeveralArtistRequest) => {
				const { ids } = request;

				if (ids.length > 50)
					throw new IllegalArgumentException(
						"Maximum 50 IDs allowed per request",
					);

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

				if (options?.limit !== undefined) {
					if (options.limit < 0 || options.limit > 50) {
						throw new IllegalArgumentException(
							"Limit must be between 0 and 50",
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

				return makeRequest({
					route: `artists/${id.trim()}/top-tracks`,
					schema: GetArtistTopTracksResponseSchema,
					options,
				});
			},
		});
	}),
);
