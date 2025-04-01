import { Data, Effect } from "effect";
import { makeRequest, type MarketExternalOptions } from "./EntityService";
import { SearchResultsMapSchema, type SearchResults } from "../schemas";

export class SearchService extends Data.TaggedClass("SearchService") {
  /**
   * Get Spotify catalog information about albums, artists, playlists, tracks, shows, episodes or audiobooks that match a keyword string.
   * Audiobooks are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets
   *
   * @param {Object} params - The params object
   * @param {string} params.query - Your search query
   * @param {string[]} params.type - A comma-separated list of item types to search across. Search results include hits from all the specified item types.
   * @param {MarketExternalOptions} [params.options] - Optional filter parameters
   *
   * @returns {Promise<SearchResults>} Search response
   */
  search({
    query,
    type,
    options,
  }: {
    query: string;
    type: (
      | "album"
      | "artist"
      | "playlist"
      | "track"
      | "show"
      | "episode"
      | "audiobook"
    )[];
    options?: MarketExternalOptions;
  }): Promise<SearchResults> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `search?q=${encodeURIComponent(query)}&type=${encodeURIComponent(type.toString())}`,
          SearchResultsMapSchema,
          options,
        );
      }),
    );
  }
}
