import { Context, Effect, Layer, Schema } from "effect";
import { IllegalArgumentException } from "effect/Cause";
import { makeRequest } from "@transporter";
import type {
	MarketOnlyOptions,
	PaginatedMarketOptions,
} from "@schemas/options";
import {
	GetSavedTrackResponseSchema,
	GetSeveralTrackResponseSchema,
	GetTrackResponseSchema,
	type CheckSavedTrackRequest,
	type GetSavedTrackResponse,
	type GetSeveralTrackRequest,
	type GetSeveralTrackResponse,
	type GetTrackRequest,
	type GetTrackResponse,
	type RemoveTrackRequest,
	type SaveTrackRequest,
} from "@schemas/services/track";
import type { ApiError } from "@errors";
import type { AuthService } from "@auth/index";
import {
	guardId,
	guardIds,
	guardLimit,
	guardMarket,
	guardOffset,
	guardTimestampedIds,
} from "@guards";

export class TrackService extends Context.Tag("TrackService")<
	TrackService,
	{
		readonly get: (
			request: GetTrackRequest,
			options?: MarketOnlyOptions,
		) => Effect.Effect<GetTrackResponse, ApiError, AuthService>;
		readonly getMany: (
			request: GetSeveralTrackRequest,
			options?: MarketOnlyOptions,
		) => Effect.Effect<GetSeveralTrackResponse, ApiError, AuthService>;
		readonly getSaved: (
			options?: PaginatedMarketOptions,
		) => Effect.Effect<GetSavedTrackResponse, ApiError, AuthService>;
		readonly save: (
			request: SaveTrackRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly remove: (
			request: RemoveTrackRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly checkSaved: (
			request: CheckSavedTrackRequest,
		) => Effect.Effect<readonly boolean[], ApiError, AuthService>;
	}
>() {}

export const TrackServiceLive = Layer.effect(
	TrackService,
	Effect.gen(function* () {
		return TrackService.of({
			get: (request: GetTrackRequest, options?: MarketOnlyOptions) => {
				const { id } = request;

				guardId(id, "[TrackService/Get] Track id");
				if (options?.market != null)
					guardMarket(options.market, "[TrackService/Get]");

				return makeRequest({
					route: `tracks/${id.trim()}`,
					schema: GetTrackResponseSchema,
					options,
				});
			},
			getMany: (
				request: GetSeveralTrackRequest,
				options?: MarketOnlyOptions,
			) => {
				const { ids } = request;

				guardIds(ids, "[TrackService/GetMany] Track ids", 50);
				if (options?.market != null)
					guardMarket(options.market, "[TrackService/GetMany]");

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					route: `tracks?ids=${encodedIds}`,
					schema: GetSeveralTrackResponseSchema,
					options,
				});
			},
			getSaved: (options?: PaginatedMarketOptions) => {
				if (options?.market != null)
					guardMarket(options.market, "[TrackService/GetSaved]");
				if (options?.limit != null)
					guardLimit(options.limit, 50, "[TrackService/GetSaved]");
				if (options?.offset != null)
					guardOffset(options.offset, "[TrackService/GetSaved]");

				return makeRequest({
					route: "me/tracks",
					schema: GetSavedTrackResponseSchema,
					options,
				});
			},
			save: (request: SaveTrackRequest) => {
				const { ids, timestamped_ids } = request;

				let body: string[] | { id: string; added_at: string }[] = [];

				if (ids != null && timestamped_ids != null)
					throw new IllegalArgumentException(
						"[TrackService/Save] Only one of ids and timestamped_ids can be provided",
					);
				if (ids != null) {
					guardIds(ids, "[TrackService/Save] Track ids", 50);
					body = ids.map((id) => id.trim());
				} else if (timestamped_ids != null) {
					guardTimestampedIds(
						timestamped_ids,
						"[TrackService/Save] Timestamped ids",
						50,
					);
					body = timestamped_ids.map((id) => ({
						id: id.id.trim(),
						added_at: id.added_at.trim(),
					}));
				} else {
					throw new IllegalArgumentException(
						"[TrackService/Save] One of ids and timestamped_ids must be provided",
					);
				}

				return makeRequest({
					method: "PUT",
					route: "me/tracks",
					schema: Schema.Void,
					body: JSON.stringify(
						ids != null
							? { ids: body }
							: {
									timestamped_ids: body,
								},
					),
				});
			},
			remove: (request: RemoveTrackRequest) => {
				const { ids } = request;

				guardIds(ids, "[TrackService/Remove] Track ids", 50);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					method: "DELETE",
					route: `me/tracks?ids=${encodedIds}`,
					schema: Schema.Void,
				});
			},
			checkSaved: (request: CheckSavedTrackRequest) => {
				const { ids } = request;

				guardIds(ids, "[TrackService/CheckSaved] Track ids", 50);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					route: `me/tracks/contains?ids=${encodedIds}`,
					schema: Schema.Array(Schema.Boolean),
				});
			},
		});
	}),
);
