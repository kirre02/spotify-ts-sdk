import { Data, Effect, Schema } from "effect";
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
} from "@internal/services/users";

export class UserService extends Data.TaggedClass("UserService") {
	/**
	 * Get Current User's Profile
	 *
	 * @remarks
	 * Get detailed profile information about the current user (including the current user's username)
	 */
	getCurrentUser(): Promise<User> {
		return Effect.runPromise(makeRequest({ route: "me", schema: UserSchema }));
	}

	/**
	 * Get User's Top Items
	 *
	 * @remarks
	 * Get the current user's top artists or tracks based on calculated affinity
	 */
	getTopItems(
		request: GetTopItemsRequest,
		options?: TimeRangePaginationOptions,
	): Promise<Page<Artist | Track>> {
		const { type } = request;

		return Effect.runPromise(
			makeRequest({
				route: `me/top/${type}`,
				schema:
					type === "tracks"
						? PageSchema(TrackSchema)
						: PageSchema(ArtistSchema),
				options,
			}),
		);
	}

	/**
	 * Get User's Profile
	 *
	 * @remarks
	 * Get public profile information about a Spotify user
	 */
	getUser(request: GetUserProfileRequest): Promise<User> {
		const { id } = request;

		return Effect.runPromise(
			makeRequest({ route: `users/${id.trim()}`, schema: UserSchema }),
		);
	}

	/**
	 * Follow Playlist
	 *
	 * @remarks
	 * Add the current user as a follower of a playlist
	 */
	followPlaylist(request: UserFollowPlaylistRequest): Promise<void> {
		const { id, isPublic } = request;

		return Effect.runPromise(
			makeRequest({
				method: "PUT",
				route: `playlists/${id.trim()}/followers`,
				schema: Schema.Void,
				body: JSON.stringify({
					public: isPublic,
				}),
			}),
		);
	}

	/**
	 * Unfollow Playlist
	 *
	 * @remarks
	 * Remove the current user as a follower of a playlist
	 */
	unfollowPlaylist(request: UserUnfollowPlaylistRequest): Promise<void> {
		const { id } = request;

		return Effect.runPromise(
			makeRequest({
				method: "DELETE",
				route: `playlists/${id.trim()}/followers`,
				schema: Schema.Void,
			}),
		);
	}

	/**
	 * Get Followed Artists
	 *
	 * @remarks
	 * Get the current user's followed artists
	 */
	getFollowedArtists(
		request: GetFollowedArtistRequest,
		options?: AfterBasedPaginationOptions,
	): Promise<FollowedArtist> {
		const { type } = request;

		return Effect.runPromise(
			makeRequest({
				route: `me/following?type=${type}`,
				schema: FollowedArtistSchema,
				options,
			}),
		);
	}

	/**
	 * Follow Artists or Users
	 *
	 * @remarks
	 * Add the current user as a follower of one or more artists or other Spotify users
	 */
	follow(request: UserFollowRequest): Promise<void> {
		const { type, ids } = request;

		if (ids.length > 50)
			throw new IllegalArgumentException("Maximum 50 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				method: "PUT",
				route: `me/following?type=${type}&ids=${encodedIds}`,
				schema: Schema.Void,
			}),
		);
	}

	/**
	 * Unfollow Artists or Users
	 *
	 * @remarks
	 * Remove the current user as a follower of one or more artists or other Spotify users
	 */
	unfollow(request: UserUnfollowRequest): Promise<void> {
		const { type, ids } = request;

		if (ids.length > 50)
			throw new IllegalArgumentException("Maximum 50 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				method: "DELETE",
				route: `me/following?type=${type}&ids=${encodedIds}`,
				schema: Schema.Void,
			}),
		);
	}

	/**
	 * Check If User Follows Artists or Users
	 *
	 * @remarks
	 * Check to see if the current user is following one or more artists or other Spotify users
	 */
	checkFollowed(request: CheckUserFollowRequest): Promise<boolean[]> {
		const { ids, type } = request;

		if (ids.length > 50)
			throw new IllegalArgumentException("Maximum 50 IDs allowed per request");

		const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

		return Effect.runPromise(
			makeRequest({
				route: `me/following/contains?type=${type}&ids=${encodedIds}`,
				schema: Schema.Array(Schema.Boolean),
			}),
		);
	}

	/**
	 * Check If Current User Follows Playlist
	 *
	 * @remarks
	 * Check to see if the current user is following a specified playlist
	 */
	isFollowingPlaylist(
		request: CheckUserFollowPlaylistRequest,
	): Promise<boolean[]> {
		const { id } = request;

		return Effect.runPromise(
			makeRequest({
				route: `playlist/${id.trim()}/followers/contains`,
				schema: Schema.Array(Schema.Boolean),
			}),
		);
	}
}
