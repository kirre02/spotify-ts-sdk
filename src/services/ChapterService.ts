import { Data, Effect, Schema } from "effect";
import {
  makeRequest,
  type IEntity,
  type MarketOnlyOptions,
} from "./EntityService";
import { ChapterSchema, type Chapter } from "../schemas";

class ChapterService
  extends Data.TaggedClass("ChapterService")
  implements IEntity<Chapter>
{
  /**
   * Get Spotify catalog information for a single audiobook chapter. Chapters are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets.
   *
   * @param {string} chapterId - The Spotify ID for the chapter
   * Example: `"0D5wENdkdwbqlrHoaJ9g29"`
   * @param {MarketOnlyOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Chapter>}
   */
  get(chapterId: string, options?: MarketOnlyOptions): Promise<Chapter> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `chapters/${chapterId}`,
          ChapterSchema,
          options,
        );
      }),
    );
  }

  /**
   * Get Spotify catalog information for several audiobook chapters identified by their Spotify IDs. Chapters are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets.
   *
   * @param {string} chapterIds - A comma-separated list of the Spotify IDs. Maximum: 50 IDs.
   * Example: `"0IsXVP0JmcB2adSE338GkK,3ZXb8FKZGU0EHALYX6uCzU,0D5wENdkdwbqlrHoaJ9g29"`
   * @param {MarketOnlyOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Chapter[]>}
   */
  getMany(chapterIds: string, options?: MarketOnlyOptions): Promise<Chapter[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `chapters?${chapterIds}`,
          Schema.Array(ChapterSchema),
          options,
        );
      }),
    );
  }
}
