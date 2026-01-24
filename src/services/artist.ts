import {
	ArtistSchema,
	PageSchema,
	SimplifiedAlbumSchema,
	TrackSchema,
} from "@internal/schemas";
import type { Artist, Page, SimplifiedAlbum, Track } from "@internal/index";
import { makeRequest } from "@core/client";
import type {
	AlbumRetrievalOptions,
	MarketOnlyOptions,
} from "@internal/options";
import { Context, Effect, Layer, Schema } from "effect";
import { IllegalArgumentException } from "effect/Cause";
import type {
	GetArtistAlbumRequest,
	GetArtistRequest,
	GetArtistTopTracksRequest,
	GetSeveralArtistRequest,
} from "@internal/services/artist";
import type { ApiError } from "@errors/index";
import type { AuthService } from "auth";

export class ArtistService extends Context.Tag("ArtistService")<
	ArtistService,
	{
		readonly get: (
			request: GetArtistRequest,
		) => Effect.Effect<Artist, ApiError, AuthService>;
		readonly getMany: (
			request: GetSeveralArtistRequest,
		) => Effect.Effect<Artist[], ApiError, AuthService>;
		readonly getAlbums: (
			request: GetArtistAlbumRequest,
			options?: AlbumRetrievalOptions,
		) => Effect.Effect<Page<SimplifiedAlbum>, ApiError, AuthService>;
		readonly getTopTracks: (
			request: GetArtistTopTracksRequest,
			options?: MarketOnlyOptions,
		) => Effect.Effect<Track[], ApiError, AuthService>;
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
					schema: ArtistSchema,
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
					schema: Schema.Array(ArtistSchema),
				});
			},
			getAlbums: (
				request: GetArtistAlbumRequest,
				options?: AlbumRetrievalOptions,
			) => {
				const { id } = request;

				return makeRequest({
					route: `artists/${id.trim()}/albums`,
					schema: PageSchema(SimplifiedAlbumSchema),
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
					schema: Schema.Array(TrackSchema),
					options,
				});
			},
		});
	}),
);
