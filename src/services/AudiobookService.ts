import { Data, Effect, Schema } from "effect";
import { makeRequest, type IEntity } from "./EntityService";
import type { Audiobook, Page, SimplifiedChapter } from "../schemas";
import {
  AudiobookSchema,
  PageSchema,
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
   *
   * @returns {Promise<Audiobook>}
   */
  get(audiobookId: string): Promise<Audiobook> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(`audiobooks/${audiobookId}`, AudiobookSchema);
      }),
    );
  }

  /**
   * Get Spotify catalog information for several audiobooks identified by their Spotify IDs. Audiobooks are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets.
   *
   * @param {string} audiobookIds - A comma-separated list of the Spotify IDs. Maximum: 50 IDs.
   * Example: `"18yVqkdbdRvS24c0Ilj2ci,1HGw3J3NxZO1TP1BTtVhpZ,7iHfbu1YPACw6oZPAFJtqe"`
   *
   * @returns {Promise<Audiobook[]>} A set of audiobooks.
   * If one of the requested audiobooks is unavailable then you'll find a `null` item in the `audiobooks` array where the audiobook object would otherwise be
   */
  getMany(audiobookIds: string): Promise<Audiobook[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `audiobooks?${audiobookIds}`,
          Schema.Array(AudiobookSchema),
        );
      }),
    );
  }

  /**
   * Get Spotify catalog information about an audiobook's chapters. Audiobooks are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets.
   *
   * @param {string} audiobookId - The Spotify ID for the audiobook
   * Example: `"7iHfbu1YPACw6oZPAFJtqe"`
   *
   * @returns {Promise<Page<SimplifiedChapter>>} Pages of chapters
   */
  getChapters(audiobookId: string): Promise<Page<SimplifiedChapter>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `audiobooks/${audiobookId}/chapters`,
          PageSchema(SimplifiedChapterSchema),
        );
      }),
    );
  }
}
