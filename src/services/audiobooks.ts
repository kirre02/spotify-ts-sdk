import { Data, Effect, Schema } from "effect";
import { makeRequest } from "@core/client";
import type {
	MarketOnlyOptions,
	PaginatedMarketOptions,
	PaginationOptions,
} from "@internal/options";
import type {
	Audiobook,
	Page,
	SimplifiedAudiobook,
	SimplifiedChapter,
} from "@internal/index";
import {
	AudiobookSchema,
	PageSchema,
	SimplifiedAudiobookSchema,
	SimplifiedChapterSchema,
} from "@internal/schemas";
import { IllegalArgumentException } from "effect/Cause";
import type {
	CheckSavedAudiobookRequest,
	GetAudiobookChapterRequest,
	GetAudiobookRequest,
	GetSeveralAudiobookRequest,
	RemoveAudiobookRequest,
	SaveAudiobookRequest,
} from "@internal/services/audiobooks";

export class AudiobookService extends Data.TaggedClass("AudiobookService") {
	/**
	 * Get an Audiobook
	 *
	 * @remarks
	 * Get Spotify catalog information for a single audiobook.
	 * Audiobooks are only available in:
	 *
	 * * US
	 * * UK
	 * * Canada
	 * * Ireland
	 * * New Zealand
	 * * Australia
	 */
	get(
		request: GetAudiobookRequest,
		options?: MarketOnlyOptions,
	): Promise<Audiobook> {
		const { id } = request;

		return Effect.runPromise(
			makeRequest({
				route: `audiobooks/${id.trim()}`,
				schema: AudiobookSchema,
				options,
			}),
		);
	}

	/**
	 * Get Several Audiobooks
	 *
	 *
	 * @remarks
	 * Get Spotify catalog information for several audiobooks identified by their Spotify IDs.
	 * Audiobooks are only available in:
	 *
	 * * US
	 * * UK
	 * * Canada
	 * * Ireland
	 * * New Zealand
	 * * Australia
	 *
	 * If one of the requested audiobooks is unavailable it will be returned as `null` in the response array
	 */
	getMany(
		request: GetSeveralAudiobookRequest,
		options?: MarketOnlyOptions,
	): Promise<Audiobook[]> {
		const { ids } = request;

		if (ids.length > 50)
			throw new IllegalArgumentException("Maximum 50 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				route: `audiobooks?ids=${encodedIds}`,
				schema: Schema.Array(AudiobookSchema),
				options,
			}),
		);
	}

	/**
	 * Get Audiobook Chapters
	 *
	 * @remarks
	 * Get Spotify catalog information about an audiobook's chapters.
	 * Audiobooks are only available in:
	 *
	 * * US
	 * * UK
	 * * Canada
	 * * Ireland
	 * * New Zealand
	 * * Australia
	 */
	getChapters(
		request: GetAudiobookChapterRequest,
		options?: PaginatedMarketOptions,
	): Promise<Page<SimplifiedChapter>> {
		const { id } = request;

		return Effect.runPromise(
			makeRequest({
				route: `audiobooks/${id.trim()}/chapters`,
				schema: PageSchema(SimplifiedChapterSchema),
				options,
			}),
		);
	}

	/**
	 * Get User's Saved Audiobooks
	 *
	 * @remarks
	 * Get a list of the audiobooks saved in the current Spotify user's 'Your Music' library.
	 */
	getSaved(options?: PaginationOptions): Promise<Page<SimplifiedAudiobook>> {
		return Effect.runPromise(
			makeRequest({
				route: "me/audiobooks",
				schema: PageSchema(SimplifiedAudiobookSchema),
				options,
			}),
		);
	}

	/**
	 * Save Audiobooks for Current User
	 *
	 * @remarks
	 * Save one or more audiobooks to the current Spotify user's library.
	 */
	save(request: SaveAudiobookRequest): Promise<void> {
		const { ids } = request;

		if (ids.length > 50)
			throw new IllegalArgumentException("Maximum 50 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				method: "PUT",
				route: `me/audiobooks?ids=${encodedIds}`,
				schema: Schema.Void,
			}),
		);
	}

	/**
	 * Remove User's Saved Audiobooks
	 *
	 * @remarks
	 * Remove one or more audiobooks from the Spotify user's library.
	 */
	remove(request: RemoveAudiobookRequest): Promise<void> {
		const { ids } = request;

		if (ids.length > 50)
			throw new IllegalArgumentException("Maximum 50 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				method: "DELETE",
				route: `me/audiobooks?ids=${encodedIds}`,
				schema: Schema.Void,
			}),
		);
	}

	/**
	 * Check User's Saved Audiobooks
	 *
	 * @remarks
	 * Check if one or more audiobooks are already saved in the current Spotify user's library.
	 */
	checkSaved(request: CheckSavedAudiobookRequest): Promise<boolean[]> {
		const { ids } = request;

		if (ids.length > 50)
			throw new IllegalArgumentException("Maximum 50 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				route: `me/audiobooks/contains?ids=${encodedIds}`,
				schema: Schema.Array(Schema.Boolean),
			}),
		);
	}
}
