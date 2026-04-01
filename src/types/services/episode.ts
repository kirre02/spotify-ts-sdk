import {
	externalUrlsSchema,
	imageSchema,
	PageSchema,
	restrictionSchema,
	SimplifiedShowSchema,
} from "@internal/shared";
import { Schema } from "effect";

export const SimplifiedEpisodeSchema = Schema.Struct({
	description: Schema.String,
	html_description: Schema.String,
	duration_ms: Schema.Number,
	explicit: Schema.Boolean,
	external_urls: externalUrlsSchema,
	href: Schema.String,
	id: Schema.String,
	images: Schema.Array(imageSchema),
	is_externally_hosted: Schema.Boolean,
	is_playable: Schema.Boolean,
	language: Schema.String,
	languages: Schema.Array(Schema.String),
	name: Schema.String,
	release_date: Schema.String,
	release_date_precision: Schema.Literal("year", "month", "day"),
	resume_point: Schema.optional(
		Schema.Struct({
			fully_played: Schema.Boolean,
			resume_position_ms: Schema.Number,
		}),
	),
	type: Schema.Literal("episode"),
	uri: Schema.String,
	restrictions: Schema.optional(restrictionSchema),
});

export const EpisodeSchema = Schema.Struct({
	...SimplifiedEpisodeSchema.fields,
	show: SimplifiedShowSchema,
});

export const SavedEpisodeSchema = Schema.Struct({
	added_at: Schema.optional(Schema.String),
	episode: Schema.optional(EpisodeSchema),
});

export type GetEpisodeRequest = {
	/**
	 * The Spotify ID for the episode.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export const GetEpisodeResponseSchema = EpisodeSchema;
export type GetEpisodeResponse = Schema.Schema.Type<
	typeof GetEpisodeResponseSchema
>;

export type GetSeveralEpisodeRequest = {
	/**
	 * A list of the Spotify IDs for the episodes. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export const GetSeveralEpisodeResponseSchema = Schema.Struct({
	episodes: Schema.Array(EpisodeSchema),
});
export type GetSeveralEpisodeResponse = Schema.Schema.Type<
	typeof GetSeveralEpisodeResponseSchema
>;

export const GetSavedEpisodeResponseSchema = PageSchema(SavedEpisodeSchema);
export type GetSavedEpisodeResponse = Schema.Schema.Type<
	typeof GetSavedEpisodeResponseSchema
>;

export type SaveEpisodeRequest = {
	/**
	 * A list of the Spotify IDs for the episodes. Maximum: 50 IDs
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type RemoveEpisodeRequest = {
	/**
	 * A list of the Spotify IDs for the episodes. Maximum: 50 IDs
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type CheckSavedEpisodeRequest = {
	/**
	 * A list of the Spotify IDs for the episodes. Maximum: 50 IDs
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};
