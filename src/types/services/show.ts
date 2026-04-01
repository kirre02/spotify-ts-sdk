import { PageSchema, SimplifiedShowSchema } from "@internal/shared";
import { Schema } from "effect";
import { SimplifiedEpisodeSchema } from "./episode";

export const ShowSchema = Schema.Struct({
	...SimplifiedShowSchema.fields,
	episodes: PageSchema(SimplifiedEpisodeSchema),
});

export const SavedShowSchema = Schema.Struct({
	added_at: Schema.optional(Schema.String),
	show: Schema.optional(SimplifiedShowSchema),
});

export type GetShowRequest = {
	/**
	 * The Spotify ID for the show
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export const GetShowResponseSchema = ShowSchema;
export type GetShowResponse = Schema.Schema.Type<typeof GetShowResponseSchema>;

export type GetSeveralShowRequest = {
	/**
	 * A list of the Spotify IDs for the shows. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export const GetSeveralShowResponseSchema = Schema.Struct({
	shows: Schema.Array(ShowSchema),
});
export type GetSeveralShowResponse = Schema.Schema.Type<
	typeof GetSeveralShowResponseSchema
>;

export type GetShowEpisodeRequest = {
	/**
	 * The Spotify ID for the show
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export const GetShowEpisodeResponseSchema = PageSchema(SimplifiedEpisodeSchema);
export type GetShowEpisodeResponse = Schema.Schema.Type<
	typeof GetShowEpisodeResponseSchema
>;

export const GetSavedShowResponseSchema = PageSchema(SavedShowSchema);
export type GetSavedShowResponse = Schema.Schema.Type<
	typeof GetSavedShowResponseSchema
>;

export type SaveShowRequest = {
	/**
	 * A list of the Spotify IDs for the shows. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type RemoveShowRequest = {
	/**
	 * A list of the Spotify IDs for the shows. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type CheckSavedShowRequest = {
	/**
	 * A list of the Spotify IDs for the shows. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};
