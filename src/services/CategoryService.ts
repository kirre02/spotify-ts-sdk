import { Data, Effect } from "effect";
import type { Category, Page } from "../schemas";
import { CategorySchema, PageSchema } from "../schemas";
import {
  makeRequest,
  type LocaleOnlyOptions,
  type LocalizedPaginationOptions,
} from "./EntityService";

class CategoryService extends Data.TaggedClass("CategoryService") {
  /**
   * Get a single category used to tag items in Spotify (on, for example, the Spotify player’s “Browse” tab).
   *
   * @param {string} categoryId - The Spotify category ID for the category
   * Example: `"dinner"`
   * @param {LocaleOnlyOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Category>}
   */
  get(categoryId: string, options?: LocaleOnlyOptions): Promise<Category> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `browse/categories/${encodeURIComponent(categoryId)}`,
          CategorySchema,
          options,
        );
      }),
    );
  }

  /**
   * Get a list of categories used to tag items in Spotify (on, for example, the Spotify player’s “Browse” tab).
   *
   * @param {LocalizedPaginationOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Page<Category>>}
   */
  getMany(options?: LocalizedPaginationOptions): Promise<Page<Category>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `browse/categories`,
          PageSchema(CategorySchema),
          options,
        );
      }),
    );
  }
}
