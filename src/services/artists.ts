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
import { Effect, Data, Schema } from "effect";
import { IllegalArgumentException } from "effect/Cause";
import type {
	GetArtistAlbumRequest,
	GetArtistRequest,
	GetArtistTopTracksRequest,
	GetSeveralArtistRequest,
} from "@internal/services/artists";

export class ArtistService extends Data.TaggedClass("ArtistService") {
	/**
	 * Get Artist
	 *
	 * @remarks
	 * Get Spotify catalog information for a single artist identified by their unique Spotify ID.
	 */
	get(request: GetArtistRequest): Promise<Artist> {
		const { id } = request;

		return Effect.runPromise(
			makeRequest({
				route: `artists/${id.trim()}`,
				schema: ArtistSchema,
			}),
		);
	}

	/**
	 * Get Several Artists
	 *
	 * @remarks
	 * Get Spotify catalog information for several artists based on their Spotify IDs.
	 */
	getMany(request: GetSeveralArtistRequest): Promise<Artist[]> {
		const { ids } = request;

		if (ids.length > 50)
			throw new IllegalArgumentException("Maximum 50 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				route: `artists?ids=${encodedIds}`,
				schema: Schema.Array(ArtistSchema),
			}),
		);
	}

	/**
	 * Get Artist's Albums
	 *
	 * @remarks
	 * Get Spotify catalog information about an artist's albums.
	 */
	getAlbums(
		request: GetArtistAlbumRequest,
		options?: AlbumRetrievalOptions,
	): Promise<Page<SimplifiedAlbum>> {
		const { id } = request;

		return Effect.runPromise(
			makeRequest({
				route: `artists/${id.trim()}/albums`,
				schema: PageSchema(SimplifiedAlbumSchema),
				options,
			}),
		);
	}

	/**
	 * Get Artist's Top Tracks
	 *
	 * @remarks
	 * Get Spotify catalog information about an artist's top tracks by country.
	 */
	getTopTracks(
		request: GetArtistTopTracksRequest,
		options?: MarketOnlyOptions,
	): Promise<Track[]> {
		const { id } = request;

		return Effect.runPromise(
			makeRequest({
				route: `artists/${id.trim()}/top-tracks`,
				schema: Schema.Array(TrackSchema),
				options,
			}),
		);
	}
}
