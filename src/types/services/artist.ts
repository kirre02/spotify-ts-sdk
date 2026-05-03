import {
	imageSchema,
	PageSchema,
	SimplifiedAlbumSchema,
} from "@schemas/shared";
import { Schema } from "effect";
import { TrackSchema } from "@schemas/services/track";
import { SimplifiedArtistSchema } from "@schemas/shared";

export const ArtistSchema = Schema.Struct({
	...SimplifiedArtistSchema.fields,
	images: Schema.optional(Schema.Array(imageSchema)),
});

export type GetArtistRequest = {
	/**
	 * The Spotify ID of the artist.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export const GetArtistResponseSchema = ArtistSchema;
export type GetArtistResponse = Schema.Schema.Type<
	typeof GetArtistResponseSchema
>;

export type GetSeveralArtistRequest = {
	/**
	 * A list of the Spotify IDs for the artists. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export const GetSeveralArtistResponseSchema = Schema.Array(ArtistSchema);
export type GetSeveralArtistResponse = Schema.Schema.Type<
	typeof GetSeveralArtistResponseSchema
>;

export type GetArtistAlbumRequest = {
	/**
	 * The Spotify ID of the artist.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export const GetArtistAlbumResponseSchema = PageSchema(
	Schema.Struct({
		...SimplifiedAlbumSchema.fields,
		album_group: Schema.String,
	}),
);
export type GetArtistAlbumResponse = Schema.Schema.Type<
	typeof GetArtistAlbumResponseSchema
>;

export type GetArtistTopTracksRequest = {
	/**
	 * The Spotify ID of the artist.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export const GetArtistTopTracksResponseSchema = Schema.Array(TrackSchema);
export type GetArtistTopTracksResponse = Schema.Schema.Type<
	typeof GetArtistTopTracksResponseSchema
>;
