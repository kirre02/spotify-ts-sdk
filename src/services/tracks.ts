import { Data, Effect, Schema } from "effect";
import { IllegalArgumentException } from "effect/Cause";
import { makeRequest } from "@core/client";
import type {
	MarketOnlyOptions,
	PaginatedMarketOptions,
} from "@internal/options";
import { PageSchema, SavedTrackSchema, TrackSchema } from "@internal/schemas";
import type { Page, SavedTrack, Track } from "@internal/index";
import type {
	CheckSavedTrackRequest,
	GetSeveralTrackRequest,
	GetTrackRequest,
	RemoveTrackRequest,
	SaveTrackRequest,
} from "@internal/services/tracks";

export class TrackService extends Data.TaggedClass("TrackService") {
	/**
	 * Get Track
	 *
	 * @remarks
	 * Get Spotify catalog information for a single track identified by its unique Spotify ID
	 */
	get(request: GetTrackRequest, options?: MarketOnlyOptions): Promise<Track> {
		const { id } = request;

		return Effect.runPromise(
			makeRequest({
				route: `tracks/${id.trim()}`,
				schema: TrackSchema,
				options,
			}),
		);
	}

	/**
	 * Get Several Tracks
	 *
	 * @remarks
	 * Get Spotify catalog information for multiple tracks based on their Spotify IDs
	 */
	getMany(
		request: GetSeveralTrackRequest,
		options?: MarketOnlyOptions,
	): Promise<Track[]> {
		const { ids } = request;

		if (ids.length > 50)
			throw new IllegalArgumentException("Maximum 50 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				route: `tracks?ids=${encodedIds}`,
				schema: Schema.Array(TrackSchema),
				options,
			}),
		);
	}

	/**
	 * Get User's Saved Tracks
	 *
	 * @remarks
	 * Get a list of the songs saved in the current Spotify user's 'Your Music' library
	 */
	getSaved(options?: PaginatedMarketOptions): Promise<Page<SavedTrack>> {
		return Effect.runPromise(
			makeRequest({
				route: "me/tracks",
				schema: PageSchema(SavedTrackSchema),
				options,
			}),
		);
	}

	/**
	 * Save Tracks for Current User
	 *
	 * @remarks
	 * Save one or more tracks to the current user's 'Your Music' library.
	 */
	save(request: SaveTrackRequest): Promise<void> {
		const { ids } = request;

		if (ids.length > 50)
			throw new IllegalArgumentException("Maximum 50 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				method: "PUT",
				route: `me/tracks?ids=${encodedIds}`,
				schema: Schema.Void,
			}),
		);
	}

	/**
	 * Remove User's Saved Tracks
	 *
	 * @remarks
	 * Remove one or more tracks from the current user's 'Your Music' library
	 */
	remove(request: RemoveTrackRequest): Promise<void> {
		const { ids } = request;

		if (ids.length > 50)
			throw new IllegalArgumentException("Maximum 50 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				method: "DELETE",
				route: `me/tracks?ids=${encodedIds}`,
				schema: Schema.Void,
			}),
		);
	}

	/**
	 * Check User's Saved Tracks
	 *
	 * @remarks
	 * Check if one or more tracks is already saved in the current Spotify user's 'Your Music' library
	 */
	checkSaved(request: CheckSavedTrackRequest): Promise<boolean[]> {
		const { ids } = request;

		if (ids.length > 50)
			throw new IllegalArgumentException("Maximum 50 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				route: `me/tracks/contains?${encodedIds}`,
				schema: Schema.Array(Schema.Boolean),
			}),
		);
	}
}
