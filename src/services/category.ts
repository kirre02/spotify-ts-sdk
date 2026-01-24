import { Context, Effect, Layer } from "effect";
import type { Category, Page } from "@internal/index";
import { CategorySchema, PageSchema } from "@internal/schemas";
import { makeRequest } from "@core/client";
import type {
	LocaleOnlyOptions,
	LocalizedPaginationOptions,
} from "@internal/options";
import type { GetCategoryRequest } from "@internal/services/category";
import type { ApiError } from "@errors/index";
import type { AuthService } from "auth";

export class CategoryService extends Context.Tag("CategoryService")<
	CategoryService,
	{
		readonly get: (
			request: GetCategoryRequest,
			options?: LocaleOnlyOptions,
		) => Effect.Effect<Category, ApiError, AuthService>;
		readonly getMany: (
			options?: LocalizedPaginationOptions,
		) => Effect.Effect<Page<Category>, ApiError, AuthService>;
	}
>() {}

export const CategoryServiceLive = Layer.effect(
	CategoryService,
	Effect.gen(function* () {
		return CategoryService.of({
			get: (request: GetCategoryRequest, options?: LocaleOnlyOptions) => {
				const { id } = request;

				return makeRequest({
					route: `browse/categories/${id.trim()}`,
					schema: CategorySchema,
					options,
				});
			},
			getMany: (options?: LocalizedPaginationOptions) => {
				return makeRequest({
					route: `browse/categories`,
					schema: PageSchema(CategorySchema),
					options,
				});
			},
		});
	}),
);
