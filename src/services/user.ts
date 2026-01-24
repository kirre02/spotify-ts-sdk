import { Context, Effect, Layer, Schema } from "effect";
import { IllegalArgumentException } from "effect/Cause";
import {
	ArtistSchema,
	FollowedArtistSchema,
	PageSchema,
	TrackSchema,
	UserSchema,
} from "@internal/schemas";
import type {
	Artist,
	FollowedArtist,
	Page,
	Track,
	User,
} from "@internal/index";
import { makeRequest } from "@core/client";
import type {
	AfterBasedPaginationOptions,
	TimeRangePaginationOptions,
} from "@internal/options";
import type {
	CheckUserFollowPlaylistRequest,
	CheckUserFollowRequest,
	GetFollowedArtistRequest,
	GetTopItemsRequest,
	GetUserProfileRequest,
	UserFollowPlaylistRequest,
	UserFollowRequest,
	UserUnfollowPlaylistRequest,
	UserUnfollowRequest,
} from "@internal/services/user";
import type { ApiError } from "@errors/index";
import type { AuthService } from "auth";

export class UserService extends Context.Tag("UserService")<
	UserService,
	{
		readonly getCurrentUser: () => Effect.Effect<User, ApiError, AuthService>;
		readonly getTopItems: (
			request: GetTopItemsRequest,
			options?: TimeRangePaginationOptions,
		) => Effect.Effect<Page<Artist | Track>, ApiError, AuthService>;
		readonly getUser: (
			request: GetUserProfileRequest,
		) => Effect.Effect<User, ApiError, AuthService>;
		readonly followPlaylist: (
			request: UserFollowPlaylistRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly unfollowPlaylist: (
			request: UserUnfollowPlaylistRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly getFollowedArtists: (
			request: GetFollowedArtistRequest,
			options?: AfterBasedPaginationOptions,
		) => Effect.Effect<FollowedArtist, ApiError, AuthService>;
		readonly follow: (
			request: UserFollowRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly unfollow: (
			request: UserUnfollowRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly checkFollowed: (
			request: CheckUserFollowRequest,
		) => Effect.Effect<boolean[], ApiError, AuthService>;
		readonly isFollowingPlaylist: (
			request: CheckUserFollowPlaylistRequest,
		) => Effect.Effect<boolean[], ApiError, AuthService>;
	}
>() {}

export const UserServiceLive = Layer.effect(
	UserService,
	Effect.gen(function* () {
		return UserService.of({
			getCurrentUser: () => {
				return makeRequest({ route: "me", schema: UserSchema });
			},
			getTopItems: (
				request: GetTopItemsRequest,
				options?: TimeRangePaginationOptions,
			) => {
				const { type } = request;

				return makeRequest({
					route: `me/top/${type}`,
					schema:
						type === "tracks"
							? PageSchema(TrackSchema)
							: PageSchema(ArtistSchema),
					options,
				});
			},
			getUser: (request: GetUserProfileRequest) => {
				const { id } = request;

				return makeRequest({ route: `users/${id.trim()}`, schema: UserSchema });
			},
			followPlaylist: (request: UserFollowPlaylistRequest) => {
				const { id, isPublic } = request;

				return makeRequest({
					method: "PUT",
					route: `playlists/${id.trim()}/followers`,
					schema: Schema.Void,
					body: JSON.stringify({
						public: isPublic,
					}),
				});
			},
			unfollowPlaylist: (request: UserUnfollowPlaylistRequest) => {
				const { id } = request;

				return makeRequest({
					method: "DELETE",
					route: `playlists/${id.trim()}/followers`,
					schema: Schema.Void,
				});
			},
			getFollowedArtists: (
				request: GetFollowedArtistRequest,
				options?: AfterBasedPaginationOptions,
			) => {
				const { type } = request;

				return makeRequest({
					route: `me/following?type=${type}`,
					schema: FollowedArtistSchema,
					options,
				});
			},
			follow: (request: UserFollowRequest) => {
				const { type, ids } = request;

				if (ids.length > 50)
					throw new IllegalArgumentException(
						"Maximum 50 IDs allowed per request",
					);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					method: "PUT",
					route: `me/following?type=${type}&ids=${encodedIds}`,
					schema: Schema.Void,
				});
			},
			unfollow: (request: UserUnfollowRequest) => {
				const { type, ids } = request;

				if (ids.length > 50)
					throw new IllegalArgumentException(
						"Maximum 50 IDs allowed per request",
					);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					method: "DELETE",
					route: `me/following?type=${type}&ids=${encodedIds}`,
					schema: Schema.Void,
				});
			},
			checkFollowed: (request: CheckUserFollowRequest) => {
				const { ids, type } = request;

				if (ids.length > 50)
					throw new IllegalArgumentException(
						"Maximum 50 IDs allowed per request",
					);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					route: `me/following/contains?type=${type}&ids=${encodedIds}`,
					schema: Schema.Array(Schema.Boolean),
				});
			},
			isFollowingPlaylist: (request: CheckUserFollowPlaylistRequest) => {
				const { id } = request;

				return makeRequest({
					route: `playlist/${id.trim()}/followers/contains`,
					schema: Schema.Array(Schema.Boolean),
				});
			},
		});
	}),
);
