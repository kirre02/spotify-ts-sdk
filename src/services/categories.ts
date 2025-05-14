import { Data, Effect } from "effect";
import type { Category, Page } from "@internal/index";
import { CategorySchema, PageSchema } from "@internal/schemas";
import { makeRequest } from "@core/client";
import type {
	LocaleOnlyOptions,
	LocalizedPaginationOptions,
} from "@internal/options";
import type { GetCategoryRequest } from "@internal/services/categories";

export class CategoryService extends Data.TaggedClass("CategoryService") {
	/**
	 * Get Single Browse Category
	 *
	 * @remarks
	 * Get a single category used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
	 */
	get(
		request: GetCategoryRequest,
		options?: LocaleOnlyOptions,
	): Promise<Category> {
		const { id } = request;

		return Effect.runPromise(
			makeRequest({
				route: `browse/categories/${id.trim()}`,
				schema: CategorySchema,
				options,
			}),
		);
	}

	/**
	 * Get Several Browse Categories
	 *
	 * @remarks
	 * Get a list of categories used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
	 */
	getMany(options?: LocalizedPaginationOptions): Promise<Page<Category>> {
		return Effect.runPromise(
			makeRequest({
				route: `browse/categories`,
				schema: PageSchema(CategorySchema),
				options,
			}),
		);
	}
}
