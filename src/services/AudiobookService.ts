import { Data, Effect, Schema } from "effect";
import {
  makeRequest,
  type IEntity,
  type MarketOnlyOptions,
  type PaginatedMarketOptions,
  type PaginationOptions,
} from "./EntityService";
import type {
  Audiobook,
  Page,
  SimplifiedAudiobook,
  SimplifiedChapter,
} from "../schemas";
import {
  AudiobookSchema,
  PageSchema,
  SimplifiedAudiobookSchema,
  SimplifiedChapterSchema,
} from "../schemas";

class AudiobookService
  extends Data.TaggedClass("AudiobookService")
  implements IEntity<Audiobook>
{
  /**
   * Get Spotify catalog information for a single audiobook. Audiobooks are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets
   *
   * @param {string} audiobookId - The Spotify ID for the audiobook
   * Example: `"7iHfbu1YPACw6oZPAFJtqe"`
   * @param {MarketOnlyOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Audiobook>}
   */
  get(audiobookId: string, options?: MarketOnlyOptions): Promise<Audiobook> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `audiobooks/${encodeURIComponent(audiobookId)}`,
          AudiobookSchema,
          options,
        );
      }),
    );
  }

  /**
   * Get Spotify catalog information for several audiobooks identified by their Spotify IDs. Audiobooks are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets.
   *
   * @param {string} audiobookIds - A comma-separated list of the Spotify IDs. Maximum: 50 IDs.
   * Example: `"18yVqkdbdRvS24c0Ilj2ci,1HGw3J3NxZO1TP1BTtVhpZ,7iHfbu1YPACw6oZPAFJtqe"`
   * @param {MarketOnlyOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Audiobook[]>} A set of audiobooks.
   * If one of the requested audiobooks is unavailable then you'll find a `null` item in the `audiobooks` array where the audiobook object would otherwise be
   */
  getMany(
    audiobookIds: string,
    options?: MarketOnlyOptions,
  ): Promise<Audiobook[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        const encodedIds = audiobookIds
          .split(",")
          .map((id) => encodeURIComponent(id.trim()))
          .join(",");

        return yield* makeRequest(
          `audiobooks?ids=${encodedIds}`,
          Schema.Array(AudiobookSchema),
          options,
        );
      }),
    );
  }

  /**
   * Get Spotify catalog information about an audiobook's chapters. Audiobooks are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets.
   *
   * @param {string} audiobookId - The Spotify ID for the audiobook
   * Example: `"7iHfbu1YPACw6oZPAFJtqe"`
   * @param {PaginatedMarketOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Page<SimplifiedChapter>>} Pages of chapters
   */
  getChapters(
    audiobookId: string,
    options?: PaginatedMarketOptions,
  ): Promise<Page<SimplifiedChapter>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `audiobooks/${encodeURIComponent(audiobookId)}/chapters`,
          PageSchema(SimplifiedChapterSchema),
          options,
        );
      }),
    );
  }

  /**
   * Get a list of the audiobooks saved in the current Spotify user's 'Your Music' library
   *
   * @param {PaginationOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Page<SimplifiedAudiobook>>} Pages of audiobooks
   */
  getSaved(options?: PaginationOptions): Promise<Page<SimplifiedAudiobook>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          "me/audiobooks",
          PageSchema(SimplifiedAudiobookSchema),
          options,
        );
      }),
    );
  }

  /**
   * Check if one or more audiobooks are already saved in the current Spotify user's library
   *
   * @param {string} audiobookIds - A comma-separated list of the Spotify IDs. Maximum: 50 IDs
   * Example: `"18yVqkdbdRvS24c0Ilj2ci,1HGw3J3NxZO1TP1BTtVhpZ,7iHfbu1YPACw6oZPAFJtqe"`
   *
   * @returns {Promise<boolean[]>} Array of booleans
   */
  checkSaved(audiobookIds: string): Promise<boolean[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        const encodedIds = audiobookIds
          .split(",")
          .map((id) => encodeURIComponent(id.trim()))
          .join(",");

        return yield* makeRequest(
          `me/audiobooks/contains?ids=${encodedIds}`,
          Schema.Array(Schema.Boolean),
        );
      }),
    );
  }
}
