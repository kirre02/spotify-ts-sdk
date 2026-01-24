import { Context, Effect, Layer, Schema } from "effect";
import { makeRequest } from "@core/client";
import type { MarketOnlyOptions } from "@internal/options";
import type { Episode } from "@internal/index";
import { EpisodeSchema } from "@internal/schemas";
import { IllegalArgumentException } from "effect/Cause";
import type {
	GetEpisodeRequest,
	GetSeveralEpisodeRequest,
} from "@internal/services/episode";
import type { ApiError } from "@errors/index";
import type { AuthService } from "auth";

export class EpisodeService extends Context.Tag("EpisodeService")<
	EpisodeService,
	{
		readonly get: (
			request: GetEpisodeRequest,
			options?: MarketOnlyOptions,
		) => Effect.Effect<Episode, ApiError, AuthService>;
		readonly getMany: (
			request: GetSeveralEpisodeRequest,
			options?: MarketOnlyOptions,
		) => Effect.Effect<Episode[], ApiError, AuthService>;
	}
>() {}

export const EpisodeServiceLive = Layer.effect(
	EpisodeService,
	Effect.gen(function* () {
		return EpisodeService.of({
			get: (request: GetEpisodeRequest, options?: MarketOnlyOptions) => {
				const { id } = request;

				return makeRequest({
					route: `episodes/${id.trim()}`,
					schema: EpisodeSchema,
					options,
				});
			},
			getMany: (
				request: GetSeveralEpisodeRequest,
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
					route: `episodes?ids=${encodedIds}`,
					schema: Schema.Array(EpisodeSchema),
					options,
				});
			},
		});
	}),
);
