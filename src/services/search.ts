import { Context, Effect, Layer } from "effect";
import { makeRequest } from "@core/client";
import type { MarketExternalOptions } from "@internal/options";
import { SearchResultsMapSchema } from "@internal/schemas";
import type { SearchResults } from "@internal/index";
import type { SearchRequest } from "@internal/services/search";
import type { ApiError } from "@errors/index";
import type { AuthService } from "auth";

export class SearchService extends Context.Tag("SearchService")<
	SearchService,
	{
		readonly search: (
			request: SearchRequest,
			options?: MarketExternalOptions,
		) => Effect.Effect<SearchResults, ApiError, AuthService>;
	}
>() {}

export const SearchServiceLive = Layer.effect(
	SearchService,
	Effect.gen(function* () {
		return SearchService.of({
			search: (request: SearchRequest, options?: MarketExternalOptions) => {
				const { query, types } = request;

				const encodedTypes = types
					.map((type) => type.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					route: `search?q=${query.trim()}&type=${encodedTypes}`,
					schema: SearchResultsMapSchema,
					options,
				});
			},
		});
	}),
);
