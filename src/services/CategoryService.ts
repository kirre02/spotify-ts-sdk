import { Data, Effect } from "effect";
import type { Category, Page } from "../schemas";
import { CategorySchema, PageSchema } from "../schemas";
import {
  makeRequest,
  type LocaleOnlyOptions,
  type LocalizedPaginationOptions,
} from "./EntityService";

export class CategoryService extends Data.TaggedClass("CategoryService") {
  /**
   * Get a single category used to tag items in Spotify (on, for example, the Spotify player’s “Browse” tab).
   *
   * @param {Object} params - The params object
   * @param {string} params.id - The Spotify category ID for the category
   * Example: `"dinner"`
   * @param {LocaleOnlyOptions} [params.options] - Optional filter parameters
   *
   * @returns {Promise<Category>} A category
   */
  get({
    id,
    options,
  }: {
    id: string;
    options?: LocaleOnlyOptions;
  }): Promise<Category> {
    return Effect.runPromise(
      makeRequest(
        `browse/categories/${encodeURIComponent(id)}`,
        CategorySchema,
        options,
      )
    );
  }

  /**
   * Get a list of categories used to tag items in Spotify (on, for example, the Spotify player’s “Browse” tab).
   *
   * @param {Object} params - The params object
   * @param {LocalizedPaginationOptions} [params.options] - Optional filter parameters
   *
   * @returns {Promise<Page<Category>>} A paged set of categories
   */
  getMany({
    options,
  }: {
    options?: LocalizedPaginationOptions;
  }): Promise<Page<Category>> {
    return Effect.runPromise(
      makeRequest(
        `browse/categories`,
        PageSchema(CategorySchema),
        options,
      )
    );
  }
}
