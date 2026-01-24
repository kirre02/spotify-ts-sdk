import { Effect, Context, Schema, Layer } from "effect";
import { makeRequest } from "@core/client";
import type { MarketOnlyOptions } from "@internal/options";
import { ChapterSchema } from "@internal/schemas";
import type { Chapter } from "@internal/index";
import { IllegalArgumentException } from "effect/Cause";
import type {
	GetChapterRequest,
	GetSeveralChapterRequest,
} from "@internal/services/chapter";
import type { ApiError } from "@errors/index";
import type { AuthService } from "auth";

export class ChapterService extends Context.Tag("ChapterService")<
	ChapterService,
	{
		readonly get: (
			request: GetChapterRequest,
			options?: MarketOnlyOptions,
		) => Effect.Effect<Chapter, ApiError, AuthService>;
		readonly getMany: (
			request: GetSeveralChapterRequest,
			options?: MarketOnlyOptions,
		) => Effect.Effect<Chapter[], ApiError, AuthService>;
	}
>() {}

export const ChapterServiceLive = Layer.effect(
	ChapterService,
	Effect.gen(function* () {
		return ChapterService.of({
			get: (request: GetChapterRequest, options?: MarketOnlyOptions) => {
				const { id } = request;

				return makeRequest({
					route: `chapters/${id.trim()}`,
					schema: ChapterSchema,
					options,
				});
			},
			getMany: (
				request: GetSeveralChapterRequest,
				options?: MarketOnlyOptions,
			) => {
				const { ids } = request;

				if (ids.length > 50)
					throw new IllegalArgumentException(
						"Maximum 50 IDs allowed per request",
					);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					route: `chapters?ids=${encodedIds}`,
					schema: Schema.Array(ChapterSchema),
					options,
				});
			},
		});
	}),
);
