import { Data, Effect, Schema } from "effect";
import { IllegalArgumentException } from "effect/Cause";
import { makeRequest } from "@core/client";
import type {
	MarketOnlyOptions,
	PaginatedMarketOptions,
	PaginationOptions,
} from "@internal/options";
import {
	PageSchema,
	SavedShowSchema,
	ShowSchema,
	SimplifiedEpisodeSchema,
	SimplifiedShowSchema,
} from "@internal/schemas";
import type {
	Page,
	SavedShow,
	Show,
	SimplifiedEpisode,
	SimplifiedShow,
} from "@internal/index";
import type {
	CheckSavedShowRequest,
	GetSeveralShowRequest,
	GetShowEpisodeRequest,
	GetShowRequest,
	RemoveShowRequest,
	SaveShowRequest,
} from "@internal/services/shows";

export class ShowService extends Data.TaggedClass("ShowService") {
	/**
	 * Get Show
	 *
	 * @remarks
	 * Get Spotify catalog information for a single show identified by its unique Spotify ID
	 */
	get(request: GetShowRequest, options?: MarketOnlyOptions): Promise<Show> {
		const { id } = request;

		return Effect.runPromise(
			makeRequest({
				route: `shows/${id.trim()}`,
				schema: ShowSchema,
				options,
			}),
		);
	}

	/**
	 * Get Several Shows
	 *
	 * @remarks
	 * Get Spotify catalog information for several shows based on their Spotify IDs
	 */
	getMany(
		request: GetSeveralShowRequest,
		options?: MarketOnlyOptions,
	): Promise<SimplifiedShow[]> {
		const { ids } = request;

		if (ids.length > 50)
			throw new IllegalArgumentException("Maximum 50 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				route: `shows?${encodedIds}`,
				schema: Schema.Array(SimplifiedShowSchema),
				options,
			}),
		);
	}

	/**
	 * Get Show Episodes
	 *
	 * @remarks
	 * Get Spotify catalog information about an show's episodes.
	 */
	getEpisodes(
		request: GetShowEpisodeRequest,
		options?: PaginatedMarketOptions,
	): Promise<Page<SimplifiedEpisode>> {
		const { id } = request;

		return Effect.runPromise(
			makeRequest({
				route: `shows/${id.trim()}/episodes`,
				schema: PageSchema(SimplifiedEpisodeSchema),
				options,
			}),
		);
	}

	/**
	 * Get User's Saved Shows
	 *
	 * @remarks
	 * Get a list of shows saved in the current Spotify user's library.
	 */
	getSaved(options?: PaginationOptions): Promise<Page<SavedShow>> {
		return Effect.runPromise(
			makeRequest({
				route: "me/shows",
				schema: PageSchema(SavedShowSchema),
				options,
			}),
		);
	}

	/**
	 * Save Shows for Current User
	 *
	 * @remarks
	 * Save one or more shows to current Spotify user's library
	 */
	save(request: SaveShowRequest): Promise<void> {
		const { ids } = request;

		if (ids.length > 50)
			throw new IllegalArgumentException("Maximum 50 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				method: "PUT",
				route: `me/shows?ids=${encodedIds}`,
				schema: Schema.Void,
			}),
		);
	}

	/**
	 * Remove User's Saved Shows
	 *
	 * @remarks
	 * Delete one or more shows from current Spotify user's library
	 */
	remove(request: RemoveShowRequest): Promise<void> {
		const { ids } = request;

		if (ids.length > 50)
			throw new IllegalArgumentException("Maximum 50 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				method: "DELETE",
				route: `me/shows?ids=${encodedIds}`,
				schema: Schema.Void,
			}),
		);
	}

	/**
	 * Check User's Saved Shows
	 *
	 * @remarks
	 * Check if one or more shows is already saved in the current Spotify user's library
	 */
	checkSaved(request: CheckSavedShowRequest): Promise<boolean[]> {
		const { ids } = request;

		if (ids.length > 50)
			throw new IllegalArgumentException("Maximum 50 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				route: `me/shows/contains?${encodedIds}`,
				schema: Schema.Array(Schema.Boolean),
			}),
		);
	}
}
