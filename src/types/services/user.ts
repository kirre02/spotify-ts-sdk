import {
	externalUrlsSchema,
	imageSchema,
	PagedSetSchema,
	PageSchema,
} from "@internal/shared";
import { Schema } from "effect";
import { ArtistSchema } from "./artist";
import { TrackSchema } from "./track";

export const UserSchema = Schema.Struct({
	country: Schema.optional(Schema.String),
	display_name: Schema.optional(Schema.String),
	email: Schema.optional(Schema.String),
	explicit_content: Schema.optional(
		Schema.Struct({
			filter_enabled: Schema.optional(Schema.Boolean),
			filter_locked: Schema.optional(Schema.Boolean),
		}),
	),
	external_urls: Schema.optional(externalUrlsSchema),
	followers: Schema.optional(
		Schema.Struct({
			href: Schema.optional(Schema.NullOr(Schema.String)),
			total: Schema.optional(Schema.Number),
		}),
	),
	href: Schema.optional(Schema.String),
	id: Schema.optional(Schema.String),
	images: Schema.optional(Schema.Array(imageSchema)),
	product: Schema.optional(Schema.String),
	type: Schema.optional(Schema.Literal("user")),
	uri: Schema.optional(Schema.String),
});

export const ReferenceUserSchema = Schema.Struct({
	external_urls: Schema.optional(externalUrlsSchema),
	href: Schema.optional(Schema.String),
	id: Schema.optional(Schema.String),
	type: Schema.optional(Schema.Literal("user")),
	uri: Schema.optional(Schema.String),
});

export const DisplayReferenceUserSchema = Schema.Struct({
	...UserSchema.fields,
	display_name: Schema.optional(Schema.NullOr(Schema.String)),
});

export const FullReferenceUserSchema = Schema.Struct({
	...DisplayReferenceUserSchema.fields,
	images: Schema.optional(Schema.Array(imageSchema)),
});

export const GetCurrentUserResponseSchema = UserSchema;
export type GetCurrentUserResponse = Schema.Schema.Type<
	typeof GetCurrentUserResponseSchema
>;

export type GetTopItemsRequest = {
	/**
	 * The type of entity to return
	 */
	type: "artists" | "tracks";
};

export const GetTopItemsResponseSchema = PageSchema(
	Schema.Union(ArtistSchema, TrackSchema),
);
export type GetTopItemsResponse = Schema.Schema.Type<
	typeof GetTopItemsResponseSchema
>;

export type GetUserProfileRequest = {
	/**
	 * The user's Spotify user ID
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export const GetUserProfileResponseSchema = FullReferenceUserSchema;
export type GetUserProfileResponse = Schema.Schema.Type<
	typeof GetUserProfileResponseSchema
>;

export type UserFollowPlaylistRequest = {
	/**
	 * The Spotify ID of the playlist
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
	/**
	 * If playlist will be included in user's public playlists (added to profile)
	 *
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/playlists|Working with Playlists}
	 */
	isPublic?: boolean;
};

export type UserUnfollowPlaylistRequest = {
	/**
	 * The Spotify ID of the playlist
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export type GetFollowedArtistRequest = {
	/**
	 * The ID type
	 *
	 * @remarks
	 * Currently only artist is supported
	 */
	type: "artist";
};

export const GetFollowedArtistResponseSchema = PagedSetSchema(ArtistSchema);
export type GetFollowedArtistResponse = Schema.Schema.Type<
	typeof GetFollowedArtistResponseSchema
>;

export type UserFollowRequest = {
	/**
	 * The ID type
	 */
	type: "artist" | "user";
	/**
	 * A list of the artist or the user Spotify IDs. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type UserUnfollowRequest = {
	/**
	 * The ID type
	 */
	type: "artist" | "user";
	/**
	 * A list of the artist or the user Spotify IDs. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type CheckUserFollowRequest = {
	/**
	 * The ID type
	 */
	type: "artist" | "user";
	/**
	 * A list of the artist or the user Spotify IDs. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type CheckUserFollowPlaylistRequest = {
	/**
	 * The Spotify ID of the playlist
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};
