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

export class SearchService extends Context.Tag("SearchService")<
	SearchService,
	{
		readonly search: (
			request: SearchRequest,
			options?: MarketExternalOptions,
		) => Effect.Effect<SearchResponse, ApiError, AuthService>;
	}
>() {}

export const SearchServiceLive = Layer.effect(
	SearchService,
	Effect.gen(function* () {
		return SearchService.of({
			search: (request: SearchRequest, options?: MarketExternalOptions) => {
				const { query, types } = request;

				if (options?.limit !== undefined) {
					if (options.limit < 0 || options.limit > 50) {
						throw new IllegalArgumentException(
							"Limit must be between 0 and 50",
						);
					}
				}

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
