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
   * @param {Object} params - The params object
   * @param {string} params.id - The Spotify ID for the chapter
   * Example: `"0D5wENdkdwbqlrHoaJ9g29"`
   * @param {MarketOnlyOptions} [params.options] - Optional filter parameters
   *
   * @returns {Promise<Chapter>}
   */
  get({
    id,
    options,
  }: {
    id: string;
    options?: MarketOnlyOptions;
  }): Promise<Chapter> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `chapters/${encodeURIComponent(id)}`,
          ChapterSchema,
          options,
        );
      }),
    );
  }

  /**
   * Get Spotify catalog information for several audiobook chapters identified by their Spotify IDs. Chapters are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets.
   *
   * @param {Object} params - The params object
   * @param {string} params.ids - A comma-separated list of the Spotify IDs. Maximum: 50 IDs.
   * Example: `"0IsXVP0JmcB2adSE338GkK,3ZXb8FKZGU0EHALYX6uCzU,0D5wENdkdwbqlrHoaJ9g29"`
   * @param {MarketOnlyOptions} [params.options] - Optional filter parameters
   *
   * @returns {Promise<Chapter[]>}
   */
  getMany({
    ids,
    options,
  }: {
    ids: string;
    options?: MarketOnlyOptions;
  }): Promise<Chapter[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        const encodedIds = ids
          .split(",")
          .map((id) => encodeURIComponent(id.trim()))
          .join(",");

        return yield* makeRequest(
          `chapters?ids=${encodedIds}`,
          Schema.Array(ChapterSchema),
          options,
        );
      }),
    );
  }
}
