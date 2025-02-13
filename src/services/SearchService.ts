import { Data, Effect } from "effect";
import { makeRequest, type MarketExternalOptions } from "./EntityService";
import { SearchResultsMapSchema, type SearchResults } from "../schemas";

class SearchService extends Data.TaggedClass("SearchService") {
  /**
   * Get Spotify catalog information about albums, artists, playlists, tracks, shows, episodes or audiobooks that match a keyword string.
   * Audiobooks are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets
   *
   * @param {string} query - Your search query
   * @param {string[]} type - A comma-separated list of item types to search across. Search results include hits from all the specified item types.
   * @param {MarketExternalOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<SearchResults>} Search response
   */
  search(
    query: string,
    type: string[],
    options?: MarketExternalOptions,
  ): Promise<SearchResults> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `search?q=${encodeURIComponent(query)}&type=${encodeURIComponent(type.join(","))}`,
          SearchResultsMapSchema,
          options,
        );
      }),
    );
  }
}
