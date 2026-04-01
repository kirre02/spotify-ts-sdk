import { Context, Effect, Layer, Schema } from "effect";
import { makeRequest } from "@core/client";
import type {
	MarketOnlyOptions,
	PaginatedMarketOptions,
} from "@internal/options";
import { IllegalArgumentException } from "effect/Cause";
import {
	type GetEpisodeRequest,
	type GetEpisodeResponse,
	type GetSavedEpisodeResponse,
	type GetSeveralEpisodeRequest,
	type GetSeveralEpisodeResponse,
	type SaveEpisodeRequest,
	type RemoveEpisodeRequest,
	type CheckSavedEpisodeRequest,
	GetSavedEpisodeResponseSchema,
	GetEpisodeResponseSchema,
	GetSeveralEpisodeResponseSchema,
} from "@internal/services/episode";
import type { ApiError } from "@errors/index";
import type { AuthService } from "auth";

export class EpisodeService extends Context.Tag("EpisodeService")<
	EpisodeService,
	{
		readonly get: (
			request: GetEpisodeRequest,
			options?: MarketOnlyOptions,
		) => Effect.Effect<GetEpisodeResponse, ApiError, AuthService>;
		readonly getMany: (
			request: GetSeveralEpisodeRequest,
			options?: MarketOnlyOptions,
		) => Effect.Effect<GetSeveralEpisodeResponse, ApiError, AuthService>;
		readonly getSaved: (
			options?: PaginatedMarketOptions,
		) => Effect.Effect<GetSavedEpisodeResponse, ApiError, AuthService>;
		readonly save: (
			request: SaveEpisodeRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly remove: (
			request: RemoveEpisodeRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly checkSaved: (
			request: CheckSavedEpisodeRequest,
		) => Effect.Effect<readonly boolean[], ApiError, AuthService>;
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
					schema: GetEpisodeResponseSchema,
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
					schema: GetSeveralEpisodeResponseSchema,
					options,
				});
			},
			getSaved: (options?: PaginatedMarketOptions) => {
				if (options?.limit !== undefined) {
					if (options.limit < 0 || options.limit > 50) {
						throw new IllegalArgumentException(
							"Limit must be between 0 and 50",
						);
					}
				}

				return makeRequest({
					route: "me/episodes",
					schema: GetSavedEpisodeResponseSchema,
					options,
				});
			},
			save: (request: SaveEpisodeRequest) => {
				const { ids } = request;

				if (ids.length > 50)
					throw new IllegalArgumentException(
						"Maximum 50 IDs allowed per request",
					);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					method: "PUT",
					route: `me/episodes?ids=${encodedIds}`,
					schema: Schema.Void,
				});
			},
			remove: (request: RemoveEpisodeRequest) => {
				const { ids } = request;

				if (ids.length > 50)
					throw new IllegalArgumentException(
						"Maximum 50 IDs allowed per request",
					);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					method: "DELETE",
					route: `me/episodes?ids=${encodedIds}`,
					schema: Schema.Void,
				});
			},
			checkSaved: (request: CheckSavedEpisodeRequest) => {
				const { ids } = request;

				if (ids.length > 50)
					throw new IllegalArgumentException(
						"Maximum 50 IDs allowed per request",
					);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					route: `me/episodes/contains?ids=${encodedIds}`,
					schema: Schema.Array(Schema.Boolean),
				});
			},
		});
	}),
);
