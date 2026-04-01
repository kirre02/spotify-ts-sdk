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
	GetTopItemsResponseSchema,
	GetUserProfileResponseSchema,
	type CheckUserFollowPlaylistRequest,
	type CheckUserFollowRequest,
	type GetCurrentUserResponse,
	type GetFollowedArtistRequest,
	type GetFollowedArtistResponse,
	type GetTopItemsRequest,
	type GetTopItemsResponse,
	type GetUserProfileRequest,
	type GetUserProfileResponse,
	type UserFollowPlaylistRequest,
	type UserFollowRequest,
	type UserUnfollowPlaylistRequest,
	type UserUnfollowRequest,
} from "@internal/services/user";
import type { ApiError } from "@errors/index";
import type { AuthService } from "auth";

export class UserService extends Context.Tag("UserService")<
	UserService,
	{
		readonly getCurrentUser: () => Effect.Effect<
			GetCurrentUserResponse,
			ApiError,
			AuthService
		>;
		readonly getTopItems: (
			request: GetTopItemsRequest,
			options?: TimeRangePaginationOptions,
		) => Effect.Effect<GetTopItemsResponse, ApiError, AuthService>;
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
			request: GetFollowedArtistRequest,
			options?: AfterBasedPaginationOptions,
		) => Effect.Effect<GetFollowedArtistResponse, ApiError, AuthService>;
		readonly follow: (
			request: UserFollowRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly unfollow: (
			request: UserUnfollowRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly checkFollowed: (
			request: CheckUserFollowRequest,
		) => Effect.Effect<readonly boolean[], ApiError, AuthService>;
		readonly isFollowingPlaylist: (
			request: CheckUserFollowPlaylistRequest,
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
			getTopItems: (
				request: GetTopItemsRequest,
				options?: TimeRangePaginationOptions,
			) => {
				const { type } = request;

				if (options?.limit !== undefined) {
					if (options.limit < 0 || options.limit > 50) {
						throw new IllegalArgumentException(
							"Limit must be between 0 and 50",
						);
					}
				}

				return makeRequest({
					route: `me/top/${type}`,
					schema: GetTopItemsResponseSchema,
					options,
				});
			},
			getUser: (request: GetUserProfileRequest) => {
				const { id } = request;

				return makeRequest({
					route: `users/${id.trim()}`,
					schema: GetUserProfileResponseSchema,
				});
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

				if (options?.limit !== undefined) {
					if (options.limit < 0 || options.limit > 50) {
						throw new IllegalArgumentException(
							"Limit must be between 0 and 50",
						);
					}
				}

				return makeRequest({
					route: `me/following?type=${type}`,
					schema: GetFollowedArtistResponseSchema,
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
