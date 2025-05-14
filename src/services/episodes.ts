import { Data, Effect, Schema } from "effect";
import { makeRequest } from "@core/client";
import type { MarketOnlyOptions } from "@internal/options";
import type { Episode } from "@internal/index";
import { EpisodeSchema } from "@internal/schemas";
import { IllegalArgumentException } from "effect/Cause";
import type {
	GetEpisodeRequest,
	GetSeveralEpisodeRequest,
} from "@internal/services/episodes";

export class EpisodeService extends Data.TaggedClass("EpisodeService") {
	/**
	 * Get Episode
	 *
	 * @remarks
	 * Get Spotify catalog information for a single episode identified by its unique Spotify ID.
	 */
	get(
		request: GetEpisodeRequest,
		options?: MarketOnlyOptions,
	): Promise<Episode> {
		const { id } = request;

		return Effect.runPromise(
			makeRequest({
				route: `episodes/${id.trim()}`,
				schema: EpisodeSchema,
				options,
			}),
		);
	}

	/**
	 * Get Several Episodes
	 *
	 * @remarks
	 * Get Spotify catalog information for several episodes based on their Spotify IDs.
	 */
	getMany(
		request: GetSeveralEpisodeRequest,
		options?: MarketOnlyOptions,
	): Promise<Episode[]> {
		const { ids } = request;

		if (ids.length > 50)
			throw new IllegalArgumentException("Maximum 50 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				route: `episodes?ids=${encodedIds}`,
				schema: Schema.Array(EpisodeSchema),
				options,
			}),
		);
	}
}
