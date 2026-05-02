import { Context, Effect, Layer, Schema } from "effect";
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
import {
	guardId,
	guardIds,
	guardLimit,
	guardMarket,
	guardOffset,
} from "guards";

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
			options?: MarketOnlyOptions,
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

				guardId(id, "[ShowService/Get] Show id");
				if (options?.market != null)
					guardMarket(options.market, "[ShowService/Get]");

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

				guardIds(ids, "[ShowService/GetMany] Show ids", 50);
				if (options?.market != null)
					guardMarket(options.market, "[ShowService/GetMany]");

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					route: `shows?ids=${encodedIds}`,
					schema: GetSeveralShowResponseSchema,
					options,
				});
			},
			getEpisodes: (
				request: GetShowEpisodeRequest,
				options?: PaginatedMarketOptions,
			) => {
				const { id } = request;

				guardId(id, "[ShowService/GetEpisodes] Show id");
				if (options?.market != null)
					guardMarket(options.market, "[ShowService/GetEpisodes]");
				if (options?.limit != null)
					guardLimit(options.limit, 50, "[ShowService/GetEpisodes]");
				if (options?.offset != null)
					guardOffset(options.offset, "[ShowService/GetEpisodes]");

				return makeRequest({
					route: `shows/${id.trim()}/episodes`,
					schema: GetShowEpisodeResponseSchema,
					options,
				});
			},
			getSaved: (options?: PaginationOptions) => {
				if (options?.limit != null)
					guardLimit(options.limit, 50, "[ShowService/GetSaved]");
				if (options?.offset != null)
					guardOffset(options.offset, "[ShowService/GetSaved]");

				return makeRequest({
					route: "me/shows",
					schema: GetSavedShowResponseSchema,
					options,
				});
			},
			save: (request: SaveShowRequest) => {
				const { ids } = request;

				guardIds(ids, "[ShowService/Save] Show ids", 50);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					method: "PUT",
					route: `me/shows?ids=${encodedIds}`,
					schema: Schema.Void,
				});
			},
			remove: (request: RemoveShowRequest, options?: MarketOnlyOptions) => {
				const { ids } = request;

				guardIds(ids, "[ShowService/Remove] Show ids", 50);
				if (options?.market != null)
					guardMarket(options.market, "[ShowService/Remove]");

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

				guardIds(ids, "[ShowService/CheckSaved] Show ids", 50);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					route: `me/shows/contains?ids=${encodedIds}`,
					schema: Schema.Array(Schema.Boolean),
				});
			},
		});
	}),
);
