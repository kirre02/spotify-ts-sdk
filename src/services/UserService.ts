import { Data, Effect, Schema } from "effect";
import {
  ArtistSchema,
  FollowedArtistSchema,
  PageSchema,
  TrackSchema,
  UserSchema,
} from "../schemas";
import type { Artist, FollowedArtist, Page, Track, User } from "../schemas";
import {
  makeRequest,
  type AfterBasedPaginationOptions,
  type TimeRangePaginationOptions,
} from "./EntityService";

class UserService extends Data.TaggedClass("UserService") {
  /**
   * Get detailed profile information about the current user (including the current user's username)
   *
   * @returns {Promise<User>} A user
   */
  getCurrentUser(): Promise<User> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest("me", UserSchema);
      }),
    );
  }

  /**
   * Get the current user's top artists or tracks based on calculated affinity
   *
   * @param {"artists" | "tracks"} type - The type of entity to return
   * @param {TimeRangePaginationOptions} [options] - Optional filter parameters
   *
   * @returns {Page<Artist | Track>} Pages of artists or tracks
   */
  getTopItems(
    type: "artists" | "tracks",
    options?: TimeRangePaginationOptions,
  ): Promise<Page<Artist | Track>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `me/top/${encodeURIComponent(type)}`,
          type === "tracks"
            ? PageSchema(TrackSchema)
            : PageSchema(ArtistSchema),
          options,
        );
      }),
    );
  }

  /**
   * Get public profile information about a Spotify user
   *
   * @param {string} userId - The user's Spotify ID
   * Example: `"smedjan"`
   *
   * @returns {Promise<User>} A user
   */
  getUser(userId: string): Promise<User> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `users/${encodeURIComponent(userId)}`,
          UserSchema,
        );
      }),
    );
  }

  /**
   * Get the current user's followed artists
   *
   * @param {"artist"} type - The ID type
   * @param {AfterBasedPaginationOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<FollowedArtist>} A paged set of artists
   */
  getFollowedArtists(
    type: "artist",
    options?: AfterBasedPaginationOptions,
  ): Promise<FollowedArtist> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `me/following?type=${encodeURIComponent(type)}`,
          FollowedArtistSchema,
          options,
        );
      }),
    );
  }

  /**
   * Check to see if the current user is following one or more artists or other Spotify users
   *
   * @param {string} userIds - A comma-separated list of the artist or the user Spotify IDs to check. Maximum: 50 IDs
   * Example: `"2CIMQHirSU0MQqyYHq0eOx,57dN52uHvrHOxijzpIgu3E,1vCWHaC5f2uS3yhpwWbIA6"`
   * @param {"artist" | "user"} type - The ID type
   *
   * @returns {Promise<boolean[]>} Array of booleans
   */
  checkFollowed(userIds: string, type: "artist" | "user"): Promise<boolean[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        const encodedIds = userIds
          .split(",")
          .map((id) => encodeURIComponent(id.trim()))
          .join(",");

        return yield* makeRequest(
          `me/following/contains?type=${type}&ids=${encodedIds}`,
          Schema.Array(Schema.Boolean),
        );
      }),
    );
  }

  /**
   * Check to see if the current user is following a specified playlist
   *
   * @param {string} playlistId - The Spotify ID of the playlist
   * Example: `"3cEYpjA9oz9GiPac4AsH4n"`
   *
   * @returns {Promise<boolean[]>} Array of boolean, containing a single boolean
   */
  isFollowingPlaylist(playlistId: string): Promise<boolean[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `playlist/${encodeURIComponent(playlistId)}/followers/contains`,
          Schema.Array(Schema.Boolean),
        );
      }),
    );
  }
}
