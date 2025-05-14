import { Data, Effect, Schema } from "effect";
import { IllegalArgumentException } from "effect/Cause";
import { makeRequest } from "@core/client";
import type {
	DetailedMarketPaginationOptions,
	MarketFieldOptions,
	PaginationOptions,
} from "@internal/options";
import {
	SimplifiedPlaylistSchema,
	PageSchema,
	PlaylistSchema,
	PlaylistTrackSchema,
	ImageSchema,
} from "@internal/schemas";
import type {
	SimplifiedPlaylist,
	Page,
	Playlist,
	PlaylistTrack,
	Image,
} from "@internal/index";
import type {
	AddItemToPlaylistRequest,
	AddPlaylistCoverImageRequest,
	ChangeDetailsRequest,
	CreatePlaylistRequest,
	GetPlaylistCoverImageRequest,
	GetPlaylistItemRequest,
	GetPlaylistRequest,
	GetUserPlaylistRequest,
	RemoveItemsFromPlaylistRequest,
	UpdatePlaylistItemRequest,
} from "@internal/services/playlists";

export class PlaylistService extends Data.TaggedClass("PlaylistService") {
	/**
	 * Get Playlist
	 *
	 * @remarks
	 * Get a playlist owned by a Spotify user
	 */
	get(
		request: GetPlaylistRequest,
		options?: MarketFieldOptions,
	): Promise<Playlist> {
		const { id } = request;

		return Effect.runPromise(
			makeRequest({
				route: `playlists/${id.trim()}`,
				schema: PlaylistSchema,
				options,
			}),
		);
	}

	/**
	 * Change Playlist Details
	 *
	 * @remarks
	 * Change a playlist's name and public/private state. (The user must, of course, own the playlist.)
	 */
	changeDetails(request: ChangeDetailsRequest): Promise<void> {
		const { playlistId, name, isPublic, collaborative, description } = request;

		return Effect.runPromise(
			makeRequest({
				method: "PUT",
				route: `playlists/${playlistId.trim()}`,
				schema: Schema.Void,
				body: JSON.stringify({
					name,
					public: isPublic,
					collaborative,
					description,
				}),
			}),
		);
	}

	/**
	 * Get Playlist Items
	 *
	 * @remarks
	 * Get full details of the items of a playlist owned by a Spotify user
	 */
	getItems(
		request: GetPlaylistItemRequest,
		options?: DetailedMarketPaginationOptions,
	): Promise<Page<PlaylistTrack>> {
		const { id } = request;

		return Effect.runPromise(
			makeRequest({
				route: `playlists/${id.trim()}/tracks`,
				schema: PageSchema(PlaylistTrackSchema),
				options,
			}),
		);
	}

	/**
	 * Update Playlist Items
	 *
	 * @remarks
	 * Either reorder or replace items in a playlist depending on the request's parameters. To reoder items, include `rangeStart`, `insertBefore`, `rangeLength` and `snapshotId`.
	 *
	 * To replace items, include `uris`. Replacing items in a playlist will overwrite its existing items. This operation can be used for replacing or clearing items in a playlist
	 *
	 * **Note:** Replace and reorder are mutually exclusive operations which share the same endpoint, but have different parameters. These operations can't be applied together in a single request
	 */
	updateItems(request: UpdatePlaylistItemRequest): Promise<string> {
		const {
			playlistId,
			uris,
			rangeStart,
			insertBefore,
			rangeLength,
			snapshotId,
		} = request;

		return Effect.runPromise(
			makeRequest({
				method: "PUT",
				route: `playlists/${playlistId.trim()}/tracks`,
				schema: Schema.String,
				body: JSON.stringify({
					uris,
					range_start: rangeStart,
					insert_before: insertBefore,
					range_length: rangeLength,
					snapshot_id: snapshotId,
				}),
			}),
		);
	}

	/**
	 * Add Items to Playlist
	 *
	 * @remarks
	 * Add one or more items to a user's playlist
	 */
	add(request: AddItemToPlaylistRequest): Promise<string> {
		const { playlistId, position, uris } = request;

		return Effect.runPromise(
			makeRequest({
				method: "POST",
				route: `playlists/${playlistId}/tracks`,
				schema: Schema.String,
				body: JSON.stringify({
					position,
					uris,
				}),
			}),
		);
	}

	/**
	 * Remove Playlist Items
	 *
	 * @remarks
	 * Remove one or more items from a user's playlist
	 */
	remove(request: RemoveItemsFromPlaylistRequest): Promise<string> {
		const { playlistId, tracks, snapshotId } = request;

		if (tracks?.length > 100) {
			throw new IllegalArgumentException(
				"Maximum 100 objects allowed per request",
			);
		}

		return Effect.runPromise(
			makeRequest({
				method: "DELETE",
				route: `playlists/${playlistId.trim()}/tracks`,
				schema: Schema.String,
				body: JSON.stringify({
					tracks,
					snapshot_id: snapshotId,
				}),
			}),
		);
	}

	/**
	 * Get Current User's Playlists
	 *
	 * @remarks
	 * Get a list of the playlists owned or followed by the current Spotify user
	 */
	getPlaylists(options?: PaginationOptions): Promise<Page<SimplifiedPlaylist>> {
		return Effect.runPromise(
			makeRequest({
				route: "me/playlists",
				schema: PageSchema(SimplifiedPlaylistSchema),
				options,
			}),
		);
	}

	/**
	 * Get User's Playlists
	 *
	 * @remarks
	 * Get a list of the playlists owned or followed by a Spotify user
	 */
	getUsersPlaylists(
		request: GetUserPlaylistRequest,
		options: PaginationOptions,
	): Promise<Page<SimplifiedPlaylist>> {
		const { id } = request;

		return Effect.runPromise(
			makeRequest({
				route: `users/${id.trim()}/playlists`,
				schema: PageSchema(SimplifiedPlaylistSchema),
				options,
			}),
		);
	}

	/**
	 * Create Playlist
	 *
	 * @remarks
	 * Create a playlist for a Spotify user. (The playlist will be empty until you add tracks.) Each user is generally limited to a maximum of 11000 playlists
	 */
	create(request: CreatePlaylistRequest): Promise<Playlist> {
		const { userId, name, isPublic, collaborative, description } = request;

		return Effect.runPromise(
			makeRequest({
				method: "POST",
				route: `users/${userId}/playlists`,
				schema: PlaylistSchema,
				body: JSON.stringify({
					name,
					public: isPublic,
					collaborative,
					description,
				}),
			}),
		);
	}

	/**
	 * Get Playlist Cover Image
	 *
	 * @remarks
	 * Get the current image associated with a specific playlist
	 */
	getCoverImage(request: GetPlaylistCoverImageRequest): Promise<Image[]> {
		const { id } = request;

		return Effect.runPromise(
			makeRequest({
				route: `playlists/${id.trim()}/images`,
				schema: Schema.Array(ImageSchema),
			}),
		);
	}

	/**
	 * Add Custom Playlist Cover Image
	 *
	 * @remarks
	 * Replace the image used to represent a specific playlist
	 */
	addCustomCoverImage(request: AddPlaylistCoverImageRequest): Promise<void> {
		const { id, image } = request;

		return Effect.runPromise(
			makeRequest({
				method: "PUT",
				route: `playlists/${id.trim()}/images`,
				schema: Schema.Void,
				customHeaders: { "Content-Type": "image/jpeg" },
				body: image.trim(),
			}),
		);
	}
}
