import { Context, Effect, Layer, Schema } from "effect";
import { IllegalArgumentException } from "effect/Cause";
import { makeRequest } from "@core/client";
import type {
	MarketOnlyOptions,
	PaginatedMarketOptions,
	PaginationOptions,
} from "@internal/options";
import {
	GetSavedShowResponseSchema,
	GetSeveralShowResponseSchema,
	GetShowEpisodeResponseSchema,
	GetShowResponseSchema,
	type CheckSavedShowRequest,
	type GetSavedShowResponse,
	type GetSeveralShowRequest,
	type GetSeveralShowResponse,
	type GetShowEpisodeRequest,
	type GetShowEpisodeResponse,
	type GetShowRequest,
	type GetShowResponse,
	type RemoveShowRequest,
	type SaveShowRequest,
} from "@internal/services/show";
import type { ApiError } from "@errors/index";
import type { AuthService } from "auth";

export class ShowService extends Context.Tag("ShowService")<
	ShowService,
	{
		readonly get: (
			request: GetShowRequest,
			options?: MarketOnlyOptions,
		) => Effect.Effect<GetShowResponse, ApiError, AuthService>;
		readonly getMany: (
			request: GetSeveralShowRequest,
			options?: MarketOnlyOptions,
		) => Effect.Effect<GetSeveralShowResponse, ApiError, AuthService>;
		readonly getEpisodes: (
			request: GetShowEpisodeRequest,
			options?: PaginatedMarketOptions,
		) => Effect.Effect<GetShowEpisodeResponse, ApiError, AuthService>;
		readonly getSaved: (
			options?: PaginationOptions,
		) => Effect.Effect<GetSavedShowResponse, ApiError, AuthService>;
		readonly save: (
			request: SaveShowRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly remove: (
			request: RemoveShowRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly checkSaved: (
			request: CheckSavedShowRequest,
		) => Effect.Effect<readonly boolean[], ApiError, AuthService>;
	}
>() {}

export const ShowServiceLive = Layer.effect(
	ShowService,
	Effect.gen(function* () {
		return ShowService.of({
			get: (request: GetShowRequest, options?: MarketOnlyOptions) => {
				const { id } = request;

				return makeRequest({
					route: `shows/${id.trim()}`,
					schema: GetShowResponseSchema,
					options,
				});
			},
			getMany: (
				request: GetSeveralShowRequest,
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
					route: `shows?${encodedIds}`,
					schema: GetSeveralShowResponseSchema,
					options,
				});
			},
			getEpisodes: (
				request: GetShowEpisodeRequest,
				options?: PaginatedMarketOptions,
			) => {
				const { id } = request;

				if (options?.limit !== undefined) {
					if (options.limit < 0 || options.limit > 50) {
						throw new IllegalArgumentException(
							"Limit must be between 0 and 50",
						);
					}
				}

				return makeRequest({
					route: `shows/${id.trim()}/episodes`,
					schema: GetShowEpisodeResponseSchema,
					options,
				});
			},
			getSaved: (options?: PaginationOptions) => {
				if (options?.limit !== undefined) {
					if (options.limit < 0 || options.limit > 50) {
						throw new IllegalArgumentException(
							"Limit must be between 0 and 50",
						);
					}
				}

				return makeRequest({
					route: "me/shows",
					schema: GetSavedShowResponseSchema,
					options,
				});
			},
			save: (request: SaveShowRequest) => {
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
					route: `me/shows?ids=${encodedIds}`,
					schema: Schema.Void,
				});
			},
			remove: (request: RemoveShowRequest) => {
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
					route: `me/shows?ids=${encodedIds}`,
					schema: Schema.Void,
				});
			},
			checkSaved: (request: CheckSavedShowRequest) => {
				const { ids } = request;

				if (ids.length > 50)
					throw new IllegalArgumentException(
						"Maximum 50 IDs allowed per request",
					);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					route: `me/shows/contains?${encodedIds}`,
					schema: Schema.Array(Schema.Boolean),
				});
			},
		});
	}),
);
