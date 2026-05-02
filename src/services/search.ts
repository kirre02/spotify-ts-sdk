import { Context, Effect, Layer } from "effect";
import { makeRequest } from "@core/client";
import type { MarketExternalOptions } from "@internal/options";
import {
	type SearchRequest,
	type SearchResponse,
	SearchResponseSchema,
} from "@internal/services/search";
import type { ApiError } from "@errors/index";
import type { AuthService } from "auth";
import { IllegalArgumentException } from "effect/Cause";
import {
	guardArrays,
	guardLimit,
	guardMarket,
	guardOffset,
	guardString,
} from "guards";

export class SearchService extends Context.Tag("SearchService")<
	SearchService,
	{
		readonly query: (
			request: SearchRequest,
			options?: MarketExternalOptions,
		) => Effect.Effect<SearchResponse, ApiError, AuthService>;
	}
>() {}

export const SearchServiceLive = Layer.effect(
	SearchService,
	Effect.gen(function* () {
		return SearchService.of({
			query: (request: SearchRequest, options?: MarketExternalOptions) => {
				const { query, types } = request;

				guardString(query, "[SearchService/Query] Query");
				guardArrays(types, "[SearchService/Query] Types");
				const validTypes = [
					"album",
					"artist",
					"playlist",
					"track",
					"show",
					"episode",
					"audiobook",
				];
				if (types.some((type) => !validTypes.includes(type.trim())))
					throw new IllegalArgumentException(
						'[SearchService/Query] Types can only contain "album", "artist", "playlist", "track", "show", "episode" or "audiobook"',
					);

				if (options?.limit != null)
					guardLimit(options.limit, 50, "[SearchService/Query]");
				if (options?.offset != null)
					guardOffset(options.offset, "[SearchService/Query]");
				if (options?.limit != null && options.offset != null) {
					if (options.limit + options.offset > 1000)
						throw new IllegalArgumentException(
							"[SearchService/Query] Limit + Offset can not exceed 1000",
						);
				}
				if (options?.market != null)
					guardMarket(options.market, "[SearchService/Query]");
				if (
					options?.include_external != null &&
					options.include_external !== "audio"
				)
					throw new IllegalArgumentException(
						'[SearchService/Query] Include external is only allowed to be "audio"',
					);

				const encodedQuery = query.replaceAll(" ", encodeURIComponent(" "));

				const encodedTypes = types
					.map((type) => type.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					route: `search?q=${encodeURI(encodedQuery.trim())}&type=${encodedTypes}`,
					schema: SearchResponseSchema,
					options,
				});
			},
		});
	}),
);
