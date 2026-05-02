import { Schema } from "effect";
import {
	externalIdsSchema,
	externalUrlsSchema,
	restrictionSchema,
	SimplifiedArtistSchema,
	SimplifiedAlbumSchema,
	PageSchema,
} from "@schemas/shared";

export const SimplifiedTrackSchema = Schema.Struct({
	artists: Schema.Array(SimplifiedArtistSchema),
	disc_number: Schema.optional(Schema.Number),
	duration_ms: Schema.optional(Schema.Number),
	explicit: Schema.optional(Schema.Boolean),
	external_urls: Schema.optional(externalUrlsSchema),
	href: Schema.optional(Schema.String),
	id: Schema.optional(Schema.String),
	is_playable: Schema.optional(Schema.Boolean),
	restrictions: Schema.optional(restrictionSchema),
	name: Schema.optional(Schema.String),
	track_number: Schema.optional(Schema.Number),
	type: Schema.optional(Schema.Literal("track")),
	uri: Schema.optional(Schema.String),
	is_local: Schema.optional(Schema.Boolean),
});

export const TrackSchema = Schema.Struct({
	...SimplifiedTrackSchema.fields,
	album: Schema.optional(SimplifiedAlbumSchema),
	external_ids: Schema.optional(externalIdsSchema),
});

export const SavedTrackSchema = Schema.Struct({
	added_at: Schema.optional(Schema.String),
	track: Schema.optional(TrackSchema),
});

export type GetTrackRequest = {
	/**
	 * The Spotify ID for the track
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export const GetTrackResponseSchema = TrackSchema;
export type GetTrackResponse = Schema.Schema.Type<
	typeof GetTrackResponseSchema
>;

export type GetSeveralTrackRequest = {
	/**
	 * A list of the Spotify IDs for the tracks. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export const GetSeveralTrackResponseSchema = Schema.Struct({
	tracks: Schema.Array(TrackSchema),
});
export type GetSeveralTrackResponse = Schema.Schema.Type<
	typeof GetSeveralTrackResponseSchema
>;

export const GetSavedTrackResponseSchema = PageSchema(SavedTrackSchema);
export type GetSavedTrackResponse = Schema.Schema.Type<
	typeof GetSavedTrackResponseSchema
>;

export type SaveTrackRequest = {
	/**
	 * A list of the Spotify IDs for the tracks. Maximum: 50 IDs.
	 * If `timestamped_ids` is present any IDs listed in this field will be ignored
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids?: string[];
	/**
	 * A list of objects containing track IDs with their corresponding timestamps.
	 * Each object must include a track ID and an added_at timestamp.
	 * This allows you to specify when tracks were added to maintain a specific chronological order.
	 * Maximum: 50 IDs. If this field is used any IDs present in the `ids` field will be ignored.
	 */
	timestamped_ids?: {
		id: string;
		added_at: string;
	}[];
};

export type RemoveTrackRequest = {
	/**
	 * A list of the Spotify IDs for the tracks. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type CheckSavedTrackRequest = {
	/**
	 * A list of the Spotify IDs for the tracks. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};
