import {
	copyrightSchema,
	externalIdsSchema,
	PageSchema,
	SimplifiedAlbumSchema,
} from "@internal/shared";
import { Schema } from "effect";
import { SimplifiedTrackSchema } from "./track";

export const AlbumSchema = Schema.Struct({
	...SimplifiedAlbumSchema.fields,
	tracks: PageSchema(SimplifiedTrackSchema),
	copyrights: Schema.Array(copyrightSchema),
	external_ids: externalIdsSchema,
	genres: Schema.Array(Schema.String),
	label: Schema.String,
});

export const SavedAlbumSchema = Schema.Struct({
	added_at: Schema.optional(Schema.String),
	album: Schema.optional(AlbumSchema),
});

export type GetAlbumRequest = {
	/**
	 * The Spotify ID of the album
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export const GetAlbumResponseSchema = AlbumSchema;
export type GetAlbumResponse = Schema.Schema.Type<
	typeof GetAlbumResponseSchema
>;

export type GetSeveralAlbumRequest = {
	/**
	 * A list of the Spotify IDs for the albums. Maximum: 20 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export const GetSeveralAlbumResponseSchema = Schema.Array(AlbumSchema);
export type GetSeveralAlbumResponse = Schema.Schema.Type<
	typeof GetSeveralAlbumResponseSchema
>;

export type GetAlbumTracksRequest = {
	/**
	 * The Spotify ID of the album.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export const GetAlbumTracksResponseSchema = PageSchema(SimplifiedTrackSchema);
export type GetAlbumTracksResponse = Schema.Schema.Type<
	typeof GetAlbumTracksResponseSchema
>;

export const GetSavedAlbumResponseSchema = PageSchema(SavedAlbumSchema);
export type GetSavedAlbumResponse = Schema.Schema.Type<
	typeof GetSavedAlbumResponseSchema
>;

export type SaveAlbumRequest = {
	/**
	 * A list of the Spotify IDs for the albums. Maximum: 20 IDs
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type RemoveAlbumRequest = {
	/**
	 * A list of the Spotify IDs for the albums. Maximum: 20 IDs
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type CheckSavedAlbumRequest = {
	/**
	 * A list of the Spotify IDs for the albums. Maximum: 20 IDs
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export const GetNewReleasesResponseSchema = PageSchema(SimplifiedAlbumSchema);
export type GetNewReleasesResponse = Schema.Schema.Type<
	typeof GetNewReleasesResponseSchema
>;
