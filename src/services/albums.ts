import { Data, Effect, Schema } from "effect";
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
} from "@internal/services/albums";

export class AlbumService extends Data.TaggedClass("AlbumService") {
	/**
	 * Get Album
	 *
	 * @remarks
	 * Get Spotify catalog information for a single album
	 */
	get(request: GetAlbumRequest, options?: MarketOnlyOptions): Promise<Album> {
		const { id } = request;

		return Effect.runPromise(
			makeRequest({
				route: `albums/${id.trim()}`,
				schema: AlbumSchema,
				options,
			}),
		);
	}

	/**
	 * Get Several Albums
	 *
	 * @remarks
	 * Get Spotify catalog information for multiple albums identified by their Spotify IDs.
	 */
	getMany(
		request: GetSeveralAlbumRequest,
		options?: MarketOnlyOptions,
	): Promise<Album[]> {
		const { ids } = request;

		if (ids.length > 20)
			throw new IllegalArgumentException("Maximum 20 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				route: `albums?ids=${encodedIds}`,
				schema: Schema.Array(AlbumSchema),
				options,
			}),
		);
	}

	/**
	 * Get Album Tracks
	 *
	 * @remarks
	 * Get Spotify catalog information about an album's tracks.
	 */
	getTracks(
		request: GetAlbumTracksRequest,
		options?: PaginatedMarketOptions,
	): Promise<Page<Track>> {
		const { id } = request;

		return Effect.runPromise(
			makeRequest({
				route: `albums/${id.trim()}/tracks`,
				schema: PageSchema(TrackSchema),
				options,
			}),
		);
	}

	/**
	 * Get User's Saved Albums
	 *
	 * @remarks
	 * Get a list of the albums saved in the current Spotify user's 'Your Music' library.
	 */
	getSaved(options?: PaginatedMarketOptions): Promise<Page<SavedAlbum>> {
		return Effect.runPromise(
			makeRequest({
				route: "me/albums",
				schema: PageSchema(SavedAlbumSchema),
				options,
			}),
		);
	}

	/**
	 * Save Albums for Current User
	 *
	 * @remarks
	 * Save one or more albums to the current user's 'Your Music' library.
	 */
	save(request: SaveAlbumRequest): Promise<void> {
		const { ids } = request;

		if (ids.length > 20)
			throw new IllegalArgumentException("Maximum 20 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				method: "PUT",
				route: `me/albums?ids=${encodedIds}`,
				schema: Schema.Void,
			}),
		);
	}

	/**
	 * Remove Users' Saved Albums
	 *
	 * @remarks
	 * Remove one or more albums from the current user's 'Your Music' library.
	 */
	remove(request: RemoveAlbumRequest): Promise<void> {
		const { ids } = request;

		if (ids.length > 20)
			throw new IllegalArgumentException("Maximum 20 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				method: "DELETE",
				route: `me/albums?ids=${encodedIds}`,
				schema: Schema.Void,
			}),
		);
	}

	/**
	 * Check User's Saved Albums
	 *
	 * @remarks
	 * Check if one or more albums is already saved in the current Spotify user's 'Your Music' library.
	 */
	checkSaved(request: CheckSavedAlbumRequest): Promise<boolean[]> {
		const { ids } = request;

		if (ids.length > 20)
			throw new IllegalArgumentException("Maximum 20 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				route: `me/albums/contains?ids=${encodedIds}`,
				schema: Schema.Array(Schema.Boolean),
			}),
		);
	}

	/**
	 * Get New Releases
	 *
	 * @remarks
	 * Get a list of new album releases featured in Spotify (shown, for example, on a Spotify player's "Browse" tab).
	 */
	getNewReleases(options?: PaginationOptions): Promise<Page<SimplifiedAlbum>> {
		return Effect.runPromise(
			makeRequest({
				route: `browse/new-releases`,
				schema: PageSchema(SimplifiedAlbumSchema),
				options,
			}),
		);
	}
}
