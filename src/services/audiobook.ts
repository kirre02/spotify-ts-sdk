import { Context, Effect, Layer, Schema } from "effect";
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
} from "@internal/services/audiobook";
import type { ApiError } from "@errors/index";
import type { AuthService } from "auth";

export class AudiobookService extends Context.Tag("AudiobookService")<
	AudiobookService,
	{
		readonly get: (
			request: GetAudiobookRequest,
			options?: MarketOnlyOptions,
		) => Effect.Effect<Audiobook, ApiError, AuthService>;
		readonly getMany: (
			request: GetSeveralAudiobookRequest,
			options?: MarketOnlyOptions,
		) => Effect.Effect<Audiobook[], ApiError, AuthService>;
		readonly getChapters: (
			request: GetAudiobookChapterRequest,
			options?: PaginatedMarketOptions,
		) => Effect.Effect<Page<SimplifiedChapter>, ApiError, AuthService>;
		readonly getSaved: (
			options?: PaginationOptions,
		) => Effect.Effect<Page<SimplifiedAudiobook>, ApiError, AuthService>;
		readonly save: (
			request: SaveAudiobookRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly remove: (
			request: RemoveAudiobookRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly checkSaved: (
			request: CheckSavedAudiobookRequest,
		) => Effect.Effect<boolean[], ApiError, AuthService>;
	}
>() {}

export const AudiobookServiceLive = Layer.effect(
	AudiobookService,
	Effect.gen(function* () {
		return AudiobookService.of({
			get: (request: GetAudiobookRequest, options?: MarketOnlyOptions) => {
				const { id } = request;

				return makeRequest({
					route: `audiobooks/${id.trim()}`,
					schema: AudiobookSchema,
					options,
				});
			},
			getMany: (
				request: GetSeveralAudiobookRequest,
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
					route: `audiobooks?ids=${encodedIds}`,
					schema: Schema.Array(AudiobookSchema),
					options,
				});
			},
			getChapters: (
				request: GetAudiobookChapterRequest,
				options?: PaginatedMarketOptions,
			) => {
				const { id } = request;

				return makeRequest({
					route: `audiobooks/${id.trim()}/chapters`,
					schema: PageSchema(SimplifiedChapterSchema),
					options,
				});
			},
			getSaved: (options?: PaginationOptions) => {
				return makeRequest({
					route: "me/audiobooks",
					schema: PageSchema(SimplifiedAudiobookSchema),
					options,
				});
			},
			save: (request: SaveAudiobookRequest) => {
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
					route: `me/audiobooks?ids=${encodedIds}`,
					schema: Schema.Void,
				});
			},
			remove: (request: RemoveAudiobookRequest) => {
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
					route: `me/audiobooks?ids=${encodedIds}`,
					schema: Schema.Void,
				});
			},
			checkSaved: (request: CheckSavedAudiobookRequest) => {
				const { ids } = request;

				if (ids.length > 50)
					throw new IllegalArgumentException(
						"Maximum 50 IDs allowed per request",
					);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					route: `me/audiobooks/contains?ids=${encodedIds}`,
					schema: Schema.Array(Schema.Boolean),
				});
			},
		});
	}),
);
