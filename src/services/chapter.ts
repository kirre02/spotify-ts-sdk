import type { AuthService } from "@auth/index";
import type { ApiError } from "@errors";
import { guardId, guardIds, guardMarket } from "@guards";
import type { MarketOnlyOptions } from "@schemas/options";
import {
  GetChapterResponseSchema,
  GetSeveralChapterResponseSchema,
  type GetChapterRequest,
  type GetChapterResponse,
  type GetSeveralChapterRequest,
  type GetSeveralChapterResponse,
} from "@schemas/services/chapter";
import { makeRequest } from "@transporter";
import { Effect, Context, Layer } from "effect";

export class ChapterService extends Context.Tag("ChapterService")<
  ChapterService,
  {
    readonly get: (
      request: GetChapterRequest,
      options?: MarketOnlyOptions,
    ) => Effect.Effect<GetChapterResponse, ApiError, AuthService>;
    readonly getMany: (
      request: GetSeveralChapterRequest,
      options?: MarketOnlyOptions,
    ) => Effect.Effect<GetSeveralChapterResponse, ApiError, AuthService>;
  }
>() {}

export const ChapterServiceLive = Layer.effect(
  ChapterService,
  Effect.succeed(
    ChapterService.of({
      get: (request: GetChapterRequest, options?: MarketOnlyOptions) => {
        const { id } = request;

        guardId(id, "[ChapterService/Get] Chapter id");
        if (options?.market != null) guardMarket(options.market, "[ChapterService/Get]");

        return makeRequest({
          route: `chapters/${id.trim()}`,
          schema: GetChapterResponseSchema,
          options,
        });
      },
      getMany: (request: GetSeveralChapterRequest, options?: MarketOnlyOptions) => {
        const { ids } = request;

        guardIds(ids, "[ChapterService/GetMany] Chapter ids", 50);
        if (options?.market != null) guardMarket(options.market, "[ChapterService/GetMany]");

        const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

        return makeRequest({
          route: `chapters?ids=${encodedIds}`,
          schema: GetSeveralChapterResponseSchema,
          options,
        });
      },
    }),
  ),
);
