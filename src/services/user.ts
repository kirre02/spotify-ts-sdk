import { Context, Effect, Layer, Schema } from "effect";
import { IllegalArgumentException } from "effect/Cause";
import { makeRequest } from "@core/client";
import type {
	AfterBasedPaginationOptions,
	TimeRangePaginationOptions,
} from "@internal/options";
import {
	GetCurrentUserResponseSchema,
	GetFollowedArtistResponseSchema,
	GetTopArtistsResponseSchema,
	GetTopTracksResponseSchema,
	GetUserProfileResponseSchema,
	type GetCurrentUserResponse,
	type GetFollowedArtistResponse,
	type GetTopArtistsResponse,
	type GetTopTracksResponse,
	type GetUserProfileRequest,
	type GetUserProfileResponse,
	type IsFollowingArtistsRequest,
	type IsFollowingPlaylistRequest,
	type IsFollowingUsersRequest,
	type UserFollowArtistsRequest,
	type UserFollowPlaylistRequest,
	type UserFollowUsersRequest,
	type UserUnfollowArtistsRequest,
	type UserUnfollowPlaylistRequest,
	type UserUnfollowUsersRequest,
} from "@internal/services/user";
import type { ApiError } from "@errors/index";
import type { AuthService } from "auth";
import {
	guardId,
	guardIds,
	guardLimit,
	guardOffset,
	guardString,
} from "guards";

export class UserService extends Context.Tag("UserService")<
	UserService,
	{
		readonly getCurrentUser: () => Effect.Effect<
			GetCurrentUserResponse,
			ApiError,
			AuthService
		>;
		readonly getTopArtists: (
			options?: TimeRangePaginationOptions,
		) => Effect.Effect<GetTopArtistsResponse, ApiError, AuthService>;
		readonly getTopTracks: (
			options?: TimeRangePaginationOptions,
		) => Effect.Effect<GetTopTracksResponse, ApiError, AuthService>;
		readonly getUser: (
			request: GetUserProfileRequest,
		) => Effect.Effect<GetUserProfileResponse, ApiError, AuthService>;
		readonly followPlaylist: (
			request: UserFollowPlaylistRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly unfollowPlaylist: (
			request: UserUnfollowPlaylistRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly getFollowedArtists: (
			options?: AfterBasedPaginationOptions,
		) => Effect.Effect<GetFollowedArtistResponse, ApiError, AuthService>;
		readonly followArtists: (
			request: UserFollowArtistsRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly followUsers: (
			request: UserFollowUsersRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly unfollowArtists: (
			request: UserUnfollowArtistsRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly unfollowUsers: (
			request: UserUnfollowUsersRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly isFollowingArtists: (
			request: IsFollowingArtistsRequest,
		) => Effect.Effect<readonly boolean[], ApiError, AuthService>;
		readonly isFollowingUsers: (
			request: IsFollowingUsersRequest,
		) => Effect.Effect<readonly boolean[], ApiError, AuthService>;
		readonly isFollowingPlaylist: (
			request: IsFollowingPlaylistRequest,
		) => Effect.Effect<readonly boolean[], ApiError, AuthService>;
	}
>() {}

export const UserServiceLive = Layer.effect(
	UserService,
	Effect.gen(function* () {
		return UserService.of({
			getCurrentUser: () => {
				return makeRequest({
					route: "me",
					schema: GetCurrentUserResponseSchema,
				});
			},
			getTopArtists: (options?: TimeRangePaginationOptions) => {
				if (options?.limit != null)
					guardLimit(options.limit, 50, "[UserService/GetTopArtists]");
				if (options?.offset != null)
					guardOffset(options.offset, "[UserService/GetTopArtists]");

				if (options?.time_range != null) {
					if (
						options.time_range !== "long_term" &&
						options.time_range !== "medium_term" &&
						options.time_range !== "short_term"
					) {
						throw new IllegalArgumentException(
							'[UserService/GetTopArtists] Time range must be one of "long_term", "medium_term" or "short_term"',
						);
					}
				}

				return makeRequest({
					route: `me/top/artists`,
					schema: GetTopArtistsResponseSchema,
					options,
				});
			},
			getTopTracks: (options?: TimeRangePaginationOptions) => {
				if (options?.limit != null)
					guardLimit(options.limit, 50, "[UserService/GetTopTracks]");
				if (options?.offset != null)
					guardOffset(options.offset, "[UserService/GetTopTracks]");

				if (options?.time_range != null) {
					if (
						options.time_range !== "long_term" &&
						options.time_range !== "medium_term" &&
						options.time_range !== "short_term"
					) {
						throw new IllegalArgumentException(
							'[UserService/GetTopTracks] Time range must be one of "long_term", "medium_term" or "short_term"',
						);
					}
				}

				return makeRequest({
					route: `me/top/tracks`,
					schema: GetTopTracksResponseSchema,
					options,
				});
			},
			getUser: (request: GetUserProfileRequest) => {
				const { id } = request;

				guardString(id, "[UserService/GetUser] User id");

				return makeRequest({
					route: `users/${id.trim()}`,
					schema: GetUserProfileResponseSchema,
				});
			},
			followPlaylist: (request: UserFollowPlaylistRequest) => {
				const { id, isPublic } = request;

				guardId(id, "[UserService/FollowPlaylist] Playlist id");

				if (isPublic != null) {
					if (typeof isPublic !== "boolean")
						throw new IllegalArgumentException(
							"[UserService/FollowPlaylist] isPublic must be a boolean",
						);
				}

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

				guardId(id, "[UserService/UnfollowPlaylist] Playlist id");

				return makeRequest({
					method: "DELETE",
					route: `playlists/${id.trim()}/followers`,
					schema: Schema.Void,
				});
			},
			getFollowedArtists: (options?: AfterBasedPaginationOptions) => {
				if (options?.limit != null)
					guardLimit(options.limit, 50, "[UserService/GetFollowedArtists]");

				if (options?.after != null)
					guardId(options.after, "[UserService/GetFollowedArtists] Artist id");

				return makeRequest({
					route: "me/following?type=artist",
					schema: GetFollowedArtistResponseSchema,
					options,
				});
			},
			followArtists: (request: UserFollowArtistsRequest) => {
				const { ids } = request;

				guardIds(ids, "[UserService/FollowArtists] Artist ids", 50);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					method: "PUT",
					route: `me/following?type=artist&ids=${encodedIds}`,
					schema: Schema.Void,
				});
			},
			followUsers: (request: UserFollowUsersRequest) => {
				const { ids } = request;

				guardIds(ids, "[UserService/FollowUsers] User ids", 50);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					method: "PUT",
					route: `me/following?type=user&ids=${encodedIds}`,
					schema: Schema.Void,
				});
			},
			unfollowArtists: (request: UserUnfollowArtistsRequest) => {
				const { ids } = request;

				guardIds(ids, "[UserService/UnfollowArtists] Artist ids", 50);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					method: "DELETE",
					route: `me/following?type=artist&ids=${encodedIds}`,
					schema: Schema.Void,
				});
			},
			unfollowUsers: (request: UserUnfollowUsersRequest) => {
				const { ids } = request;

				guardIds(ids, "[UserService/UnfollowUsers] User ids", 50);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					method: "DELETE",
					route: `me/following?type=user&ids=${encodedIds}`,
					schema: Schema.Void,
				});
			},
			isFollowingArtists: (request: IsFollowingArtistsRequest) => {
				const { ids } = request;

				guardIds(ids, "[UserService/IsFollowingArtists] Artist ids", 50);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					route: `me/following/contains?type=artist&ids=${encodedIds}`,
					schema: Schema.Array(Schema.Boolean),
				});
			},
			isFollowingUsers: (request: IsFollowingUsersRequest) => {
				const { ids } = request;

				guardIds(ids, "[UserService/IsFollowingUsers] User ids", 50);

				const encodedIds = ids
					.map((id) => id.trim())
					.join(encodeURIComponent(","));

				return makeRequest({
					route: `me/following/contains?type=user&ids=${encodedIds}`,
					schema: Schema.Array(Schema.Boolean),
				});
			},
			isFollowingPlaylist: (request: IsFollowingPlaylistRequest) => {
				const { id } = request;

				guardId(id, "[UserService/IsFollowingPlaylist] Playlist id");

				return makeRequest({
					route: `playlists/${id.trim()}/followers/contains`,
					schema: Schema.Array(Schema.Boolean),
				});
			},
		});
	}),
);
