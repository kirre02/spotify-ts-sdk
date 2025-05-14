import { Data, Effect, Schema } from "effect";
import { makeRequest } from "@core/client";
import type { MarketOnlyOptions } from "@internal/options";
import { ChapterSchema } from "@internal/schemas";
import type { Chapter } from "@internal/index";
import { IllegalArgumentException } from "effect/Cause";
import type {
	GetChapterRequest,
	GetSeveralChapterRequest,
} from "@internal/services/chapters";

export class ChapterService extends Data.TaggedClass("ChapterService") {
	/**
	 * Get a Chapter
	 *
	 * @remarks
	 * Get Spotify catalog information for a single audiobook chapter.
	 * Chapters are only available in:
	 *
	 * * US
	 * * UK
	 * * Canada
	 * * Ireland
	 * * New Zealand
	 * * Australia
	 */
	get(
		request: GetChapterRequest,
		options?: MarketOnlyOptions,
	): Promise<Chapter> {
		const { id } = request;

		return Effect.runPromise(
			makeRequest({
				route: `chapters/${id.trim()}`,
				schema: ChapterSchema,
				options,
			}),
		);
	}

	/**
	 * Get Several Chapters
	 *
	 * @remarks
	 * Get Spotify catalog information for several audiobook chapters identified by their Spotify IDs.
	 * Chapters are only available in:
	 *
	 * * US
	 * * UK
	 * * Canada
	 * * Ireland
	 * * New Zealand
	 * * Australia
	 */
	getMany(
		request: GetSeveralChapterRequest,
		options?: MarketOnlyOptions,
	): Promise<Chapter[]> {
		const { ids } = request;

		if (ids.length > 50)
			throw new IllegalArgumentException("Maximum 50 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				route: `chapters?ids=${encodedIds}`,
				schema: Schema.Array(ChapterSchema),
				options,
			}),
		);
	}
}
