import { Effect, Context, Layer } from "effect";
import { makeRequest } from "@core/client";
import type { MarketOnlyOptions } from "@internal/options";
import {
	GetChapterResponseSchema,
	GetSeveralChapterResponseSchema,
	type GetChapterRequest,
	type GetChapterResponse,
	type GetSeveralChapterRequest,
	type GetSeveralChapterResponse,
} from "@internal/services/chapter";
import type { ApiError } from "@errors/index";
import type { AuthService } from "auth";
import { guardId, guardIds, guardMarket } from "guards";

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
	Effect.gen(function* () {
		return ChapterService.of({
			get: (request: GetChapterRequest, options?: MarketOnlyOptions) => {
				const { id } = request;

				guardId(id, "[ChapterService/Get] Chapter id");
				if (options?.market != null)
					guardMarket(options.market, "[ChapterService/Get]");

				return makeRequest({
					route: `chapters/${id.trim()}`,
					schema: GetChapterResponseSchema,
					options,
				});
			},
			getMany: (
				request: GetSeveralChapterRequest,
				options?: MarketOnlyOptions,
			) => {
				const { ids } = request;

				guardIds(ids, "[ChapterService/GetMany] Chapter ids", 50);
				if (options?.market != null)
					guardMarket(options.market, "[ChapterService/GetMany]");

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					route: `chapters?ids=${encodedIds}`,
					schema: GetSeveralChapterResponseSchema,
					options,
				});
			},
		});
	}),
);
