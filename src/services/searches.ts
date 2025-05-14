import { Data, Effect } from "effect";
import { makeRequest } from "@core/client";
import type { MarketExternalOptions } from "@internal/options";
import { SearchResultsMapSchema } from "@internal/schemas";
import type { SearchResults } from "@internal/index";
import type { SearchRequest } from "@internal/services/searches";

export class SearchService extends Data.TaggedClass("SearchService") {
	/**
	 * Search for Item
	 *
	 * @remarks
	 * Get Spotify catalog information about albums, artists, playlists, tracks, shows, episodes or audiobooks that match a keyword string.
	 * Audiobooks are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets
	 */
	search(
		request: SearchRequest,
		options?: MarketExternalOptions,
	): Promise<SearchResults> {
		const { query, types } = request;

		const encodedTypes = types
			.map((type) => type.trim())
			.join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				route: `search?q=${query.trim()}&type=${encodedTypes}`,
				schema: SearchResultsMapSchema,
				options,
			}),
		);
	}
}
