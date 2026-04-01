import { Context, Effect, Layer } from "effect";
import { makeRequest } from "@core/client";
import type {
	LocaleOnlyOptions,
	LocalizedPaginationOptions,
} from "@internal/options";
import {
	GetCategoryResponseSchema,
	GetSeveralCategoryResponseSchema,
	type GetCategoryRequest,
	type GetCategoryResponse,
	type GetSeveralCategoryResponse,
} from "@internal/services/category";
import type { ApiError } from "@errors/index";
import type { AuthService } from "auth";
import { IllegalArgumentException } from "effect/Cause";

export class CategoryService extends Context.Tag("CategoryService")<
	CategoryService,
	{
		readonly get: (
			request: GetCategoryRequest,
			options?: LocaleOnlyOptions,
		) => Effect.Effect<GetCategoryResponse, ApiError, AuthService>;
		readonly getMany: (
			options?: LocalizedPaginationOptions,
		) => Effect.Effect<GetSeveralCategoryResponse, ApiError, AuthService>;
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
					schema: GetCategoryResponseSchema,
					options,
				});
			},
			getMany: (options?: LocalizedPaginationOptions) => {
				if (options?.limit !== undefined) {
					if (options.limit < 0 || options.limit > 50) {
						throw new IllegalArgumentException(
							"Limit must be between 0 and 50",
						);
					}
				}
				return makeRequest({
					route: `browse/categories`,
					schema: GetSeveralCategoryResponseSchema,
					options,
				});
			},
		});
	}),
);
