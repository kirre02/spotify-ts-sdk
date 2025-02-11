import { Data, Effect } from "effect";
import type { Category, Page } from "../schemas";
import { CategorySchema, PageSchema } from "../schemas";
import { makeRequest } from "./EntityService";

class CategoryService extends Data.TaggedClass("CategoryService") {
  /**
   * Get a single category used to tag items in Spotify (on, for example, the Spotify player’s “Browse” tab).
   *
   * @param {string} categoryId - The Spotify category ID for the category
   * Example: `"dinner"`
   *
   * @returns {Promise<Category>}
   */
  get(categoryId: string): Promise<Category> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `browse/categories/${categoryId}`,
          CategorySchema,
        );
      }),
    );
  }

  /**
   * Get a list of categories used to tag items in Spotify (on, for example, the Spotify player’s “Browse” tab).
   *
   * @returns {Promise<Page<Category>>}
   */
  getMany(): Promise<Page<Category>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `browse/categories`,
          PageSchema(CategorySchema),
        );
      }),
    );
  }
}
