import type { AuthService } from "@auth/index";
import type { ApiError } from "@errors";
import { guardLimit, guardLocale, guardOffset, guardString } from "@guards";
import type { LocaleOnlyOptions, LocalizedPaginationOptions } from "@schemas/options";
import {
  GetCategoryResponseSchema,
  GetSeveralCategoryResponseSchema,
  type GetCategoryRequest,
  type GetCategoryResponse,
  type GetSeveralCategoryResponse,
} from "@schemas/services/category";
import { makeRequest } from "@transporter";
import { Context, Effect, Layer } from "effect";

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
  Effect.succeed(
    CategoryService.of({
      get: (request: GetCategoryRequest, options?: LocaleOnlyOptions) => {
        const { id } = request;

        guardString(id, "[CategoryService/Get] Id");
        if (options?.locale != null) guardLocale(options.locale, "[CategoryService/Get]");

        return makeRequest({
          route: `browse/categories/${id.trim()}`,
          schema: GetCategoryResponseSchema,
          options,
        });
      },
      getMany: (options?: LocalizedPaginationOptions) => {
        if (options?.locale != null) guardLocale(options.locale, "[CategoryService/GetMany]");
        if (options?.limit != null) guardLimit(options.limit, 50, "[CategoryService/GetMany]");
        if (options?.offset != null) guardOffset(options.offset, "[CategoryService/GetMany]");

        return makeRequest({
          route: `browse/categories`,
          schema: GetSeveralCategoryResponseSchema,
          options,
        });
      },
    }),
  ),
);
