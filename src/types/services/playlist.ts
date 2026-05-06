import { EpisodeSchema } from "@schemas/services/episode";
import { TrackSchema } from "@schemas/services/track";
import { DisplayReferenceUserSchema, ReferenceUserSchema } from "@schemas/services/user";
import { externalUrlsSchema, imageSchema, PageSchema } from "@schemas/shared";
import { Schema } from "effect";

export const PlaylistTrackSchema = Schema.Struct({
  added_at: Schema.optional(Schema.String),
  added_by: Schema.optional(Schema.NullOr(ReferenceUserSchema)),
  is_local: Schema.optional(Schema.Boolean),
  item: Schema.optional(Schema.Union(TrackSchema, EpisodeSchema)),
});

export const PlaylistSchema = Schema.Struct({
  collaborative: Schema.optional(Schema.Boolean),
  description: Schema.optional(Schema.NullOr(Schema.String)),
  external_urls: Schema.optional(externalUrlsSchema),
  href: Schema.optional(Schema.String),
  id: Schema.optional(Schema.String),
  images: Schema.optional(Schema.Array(imageSchema)),
  name: Schema.optional(Schema.String),
  owner: Schema.optional(DisplayReferenceUserSchema),
  public: Schema.optional(Schema.Boolean),
  snapshot_id: Schema.optional(Schema.String),
  items: Schema.optional(PageSchema(PlaylistTrackSchema)),
  type: Schema.optional(Schema.Literal("playlist")),
  uri: Schema.optional(Schema.String),
});

const OmittedPlaylistSchema = PlaylistSchema.omit("items");
export const PlaylistItemsSchema = Schema.Struct({
  ...OmittedPlaylistSchema.fields,
  items: Schema.optional(
    Schema.Struct({
      href: Schema.optional(Schema.String),
      total: Schema.optional(Schema.Number),
    }),
  ),
});

export const snapshotSchema = Schema.Struct({
  snapshot_id: Schema.optional(Schema.String),
});

export type GetPlaylistRequest = {
  /**
   * The Spotify ID of the playlist
   *
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
   */
  id: string;
};

export const GetPlaylistResponseSchema = PlaylistSchema;
export type GetPlaylistResponse = Schema.Schema.Type<typeof GetPlaylistResponseSchema>;

export type ChangeDetailsRequest = {
  /**
   * The Spotify ID of the playlist
   *
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/playlists|Working with Playlists}
   */
  id: string;
  /** The new name for the playlist, for example "My New Playlist Title" */
  name?: string;
  /**
   * The playlist's public/private status (if it should be added to the user's profile or not) true:
   * the playlist will be public, false: the playlist will be private, null: the playlist status is
   * not relevant
   */
  isPublic?: boolean;
  /**
   * If true, the playlist will become collaborative and other users will be able to modify the
   * playlist in their Spotify client. **Note:** You can only set collaborative to true on
   * non-public playlists
   */
  collaborative?: boolean;
  /** Value for playlist description as displayed in Spotify Clients and in the Web API */
  description?: string;
};

export type GetPlaylistItemRequest = {
  /**
   * The Spotify ID of the playlist
   *
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
   */
  id: string;
};

export const GetPlaylistItemResponseSchema = PageSchema(PlaylistTrackSchema);
export type GetPlaylistItemResponse = Schema.Schema.Type<typeof GetPlaylistItemResponseSchema>;

export type UpdatePlaylistItemRequest = {
  /**
   * The Spotify ID of the playlist
   *
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
   */
  id: string;
  /**
   * A list of Spotify URIs to set, can be track or episode URIs. A maximum of 100 items can be set
   * in one request
   *
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify URIs}
   */
  uris?: string[];
  /** The position of the first item to be reordered. */
  rangeStart?: number;
  /**
   * The position where the items should be inserted. To reorder the items to the end of the
   * playlist, simply set `insert_before` to the position after the last item.
   *
   * @remarks
   *   To reorder the first item to the last position in a playlist with 10 items, set `rangeStart`
   *   to 0, and `insertBefore` to 10. To reorder the last item in a playlist with 10 items to the
   *   start of the playlist, set `rangeStart` to 9, and `insertBefore` to 0.
   */
  insertBefore?: number;
  /**
   * The amount of items to be reordered. Defaults to 1 if not set. The range of items to be
   * reordered begins from the `rangeStart` position, and includes the `rangeLength` subsequent
   * items.
   *
   * @remarks
   *   To move the items at index 9-10 to the start of the playlist, `rangeStart` is set to 9, and
   *   `rangeLength` is set to 2.
   */
  rangeLength?: number;
  /** The playlist's snapshot ID against which you want to make the changes */
  snapshotId?: string;
};

export const UpdatePlaylistItemResponseSchema = snapshotSchema;
export type UpdatePlaylistItemResponse = Schema.Schema.Type<
  typeof UpdatePlaylistItemResponseSchema
>;

export type AddPlaylistItemRequest = {
  /**
   * The Spotify ID of the playlist
   *
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
   */
  id: string;
  /**
   * The position to insert the items, a zero-based index.
   *
   * For example, to insert the items in the first position: `position=0`; to insert the items in
   * the third position: `position=2`.
   *
   * If omitted, the items will be appended to the playlist. Items are added in the order they are
   * listed
   */
  position?: number;
  /**
   * A list of Spotify URIs to add, can be track or episode URIs.
   *
   * @remarks
   *   A maximum of 100 items can be added in one request
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify URIs}
   */
  uris?: string[];
};

export const AddPlaylistItemResponseSchema = snapshotSchema;
export type AddPlaylistItemResponse = Schema.Schema.Type<typeof AddPlaylistItemResponseSchema>;

export type RemovePlaylistItemRequest = {
  /**
   * The Spotify ID of the playlist
   *
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
   */
  id: string;
  /**
   * An array of objects containing Spotify URIs of the tracks or episodes to remove.
   *
   * @remarks
   *   Example: `[{uri: "spotify:track:4iV5W9uYEdYUVa79Axb7Rh"}, { uri:
   *   "spotify:track:1301WleyT98MSxVHPZCA6M"}]` A maximum of 100 objects can be sent at once
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify URIs}
   */
  tracks: { uri: string }[];
  /**
   * The playlist's snapshot ID against which you want to make the changes.
   *
   * @remarks
   *   The API will validate that the specified items exist and in the specified positions to make
   *   the changes, even if more recent changes have been made to the playlist.
   */
  snapshotId?: string;
};

export const RemovePlaylistItemResponseSchema = snapshotSchema;
export type RemovePlaylistItemResponse = Schema.Schema.Type<typeof AddPlaylistItemResponseSchema>;

export const GetCurrentUserPlaylistResponseSchema = PlaylistItemsSchema;
export type GetCurrentUserPlaylistResponse = Schema.Schema.Type<
  typeof GetCurrentUserPlaylistResponseSchema
>;

export type GetUserPlaylistRequest = {
  /**
   * The user's Spotify user ID
   *
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
   */
  id: string;
};

export const GetUserPlaylistResponseSchema = PageSchema(PlaylistItemsSchema);
export type GetUserPlaylistResponse = Schema.Schema.Type<typeof GetUserPlaylistResponseSchema>;

export type CreatePlaylistRequest = {
  /**
   * The name for the new playlist
   *
   * @remarks
   *   This name does not need to be unique; a user may have several playlists with the same name
   */
  name: string;
  /**
   * The playlist's public/private status (if it should be added to the user's profile or not):
   *
   * @remarks
   *   Defaults to true Allowed values: true: the playlist will be public, false: the playlist will
   *   be private. To be able to create private playlists, the user must have granted the
   *   `playlist-modify-private` scope.
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/scopes#list-of-scopes|Scopes}
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/playlists|Working with Playlists}
   */
  isPublic?: boolean;
  /**
   * Defaults to false.
   *
   * If `true` the playlist will be collaborative.
   *
   * **Note:** to create a collaborative playlist you must also set public to false. To create
   * collaborative playlists you must have granted `playlist-modify-private` and
   * `playlist-modify-public` scopes.
   *
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/scopes#list-of-scopes|Scopes}
   */
  collaborative?: boolean;
  /** Value for playlist description as displayed in Spotify Clients and in the Web API. */
  description?: string;
};

export const CreatePlaylistResponseSchema = PlaylistSchema;
export type CreatePlaylistResponse = Schema.Schema.Type<typeof CreatePlaylistResponseSchema>;

export type GetPlaylistCoverImageRequest = {
  /**
   * The Spotify ID of the playlist
   *
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
   */
  id: string;
};

export const GetPlaylistCoverImageResponseSchema = Schema.Array(imageSchema);
export type GetPlaylistCoverImageResponse = Schema.Schema.Type<
  typeof GetPlaylistCoverImageResponseSchema
>;

export type AddPlaylistCoverImageRequest = {
  /**
   * The Spotify ID of the playlist
   *
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
   */
  id: string;
  /**
   * Base64 encoded JPEG image data
   *
   * @remarks
   *   Maximum payload size is 256 KB
   */
  image: string;
};
