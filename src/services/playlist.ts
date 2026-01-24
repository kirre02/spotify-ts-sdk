import { Context, Effect, Layer, Schema } from "effect";
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
} from "@internal/services/playlist";
import type { ApiError } from "@errors/index";
import type { AuthService } from "auth";

export class PlaylistService extends Context.Tag("PlaylistService")<
	PlaylistService,
	{
		readonly get: (
			request: GetPlaylistRequest,
			options?: MarketFieldOptions,
		) => Effect.Effect<Playlist, ApiError, AuthService>;
		readonly changeDetails: (
			request: ChangeDetailsRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly getItems: (
			request: GetPlaylistItemRequest,
			options?: DetailedMarketPaginationOptions,
		) => Effect.Effect<Page<PlaylistTrack>, ApiError, AuthService>;
		readonly updateItems: (
			request: UpdatePlaylistItemRequest,
		) => Effect.Effect<string, ApiError, AuthService>;
		readonly add: (
			request: AddItemToPlaylistRequest,
		) => Effect.Effect<string, ApiError, AuthService>;
		readonly remove: (
			request: RemoveItemsFromPlaylistRequest,
		) => Effect.Effect<string, ApiError, AuthService>;
		readonly getPlaylists: (
			options?: PaginationOptions,
		) => Effect.Effect<Page<SimplifiedPlaylist>, ApiError, AuthService>;
		readonly getUsersPlaylists: (
			request: GetUserPlaylistRequest,
			options?: PaginationOptions,
		) => Effect.Effect<Page<SimplifiedPlaylist>, ApiError, AuthService>;
		readonly create: (
			request: CreatePlaylistRequest,
		) => Effect.Effect<Playlist, ApiError, AuthService>;
		readonly getCoverImage: (
			request: GetPlaylistCoverImageRequest,
		) => Effect.Effect<Image[], ApiError, AuthService>;
		readonly addCustomCoverImage: (
			request: AddPlaylistCoverImageRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
	}
>() {}

export const PlaylistServiceLive = Layer.effect(
	PlaylistService,
	Effect.gen(function* () {
		return PlaylistService.of({
			get: (request: GetPlaylistRequest, options?: MarketFieldOptions) => {
				const { id } = request;

				return makeRequest({
					route: `playlists/${id.trim()}`,
					schema: PlaylistSchema,
					options,
				});
			},
			changeDetails: (request: ChangeDetailsRequest) => {
				const { playlistId, name, isPublic, collaborative, description } =
					request;

				return makeRequest({
					method: "PUT",
					route: `playlists/${playlistId.trim()}`,
					schema: Schema.Void,
					body: JSON.stringify({
						name,
						public: isPublic,
						collaborative,
						description,
					}),
				});
			},
			getItems: (
				request: GetPlaylistItemRequest,
				options?: DetailedMarketPaginationOptions,
			) => {
				const { id } = request;

				return makeRequest({
					route: `playlists/${id.trim()}/tracks`,
					schema: PageSchema(PlaylistTrackSchema),
					options,
				});
			},
			updateItems: (request: UpdatePlaylistItemRequest) => {
				const {
					playlistId,
					uris,
					rangeStart,
					insertBefore,
					rangeLength,
					snapshotId,
				} = request;

				return makeRequest({
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
				});
			},
			add: (request: AddItemToPlaylistRequest) => {
				const { playlistId, position, uris } = request;

				return makeRequest({
					method: "POST",
					route: `playlists/${playlistId}/tracks`,
					schema: Schema.String,
					body: JSON.stringify({
						position,
						uris,
					}),
				});
			},
			remove: (request: RemoveItemsFromPlaylistRequest) => {
				const { playlistId, tracks, snapshotId } = request;

				if (tracks?.length > 100) {
					throw new IllegalArgumentException(
						"Maximum 100 objects allowed per request",
					);
				}

				return makeRequest({
					method: "DELETE",
					route: `playlists/${playlistId.trim()}/tracks`,
					schema: Schema.String,
					body: JSON.stringify({
						tracks,
						snapshot_id: snapshotId,
					}),
				});
			},
			getPlaylists: (options?: PaginationOptions) => {
				return makeRequest({
					route: "me/playlists",
					schema: PageSchema(SimplifiedPlaylistSchema),
					options,
				});
			},
			getUsersPlaylists: (
				request: GetUserPlaylistRequest,
				options?: PaginationOptions,
			) => {
				const { id } = request;

				return makeRequest({
					route: `users/${id.trim()}/playlists`,
					schema: PageSchema(SimplifiedPlaylistSchema),
					options,
				});
			},
			create: (request: CreatePlaylistRequest) => {
				const { userId, name, isPublic, collaborative, description } = request;

				return makeRequest({
					method: "POST",
					route: `users/${userId}/playlists`,
					schema: PlaylistSchema,
					body: JSON.stringify({
						name,
						public: isPublic,
						collaborative,
						description,
					}),
				});
			},
			getCoverImage: (request: GetPlaylistCoverImageRequest) => {
				const { id } = request;

				return makeRequest({
					route: `playlists/${id.trim()}/images`,
					schema: Schema.Array(ImageSchema),
				});
			},
			addCustomCoverImage: (request: AddPlaylistCoverImageRequest) => {
				const { id, image } = request;

				return makeRequest({
					method: "PUT",
					route: `playlists/${id.trim()}/images`,
					schema: Schema.Void,
					customHeaders: { "Content-Type": "image/jpeg" },
					body: image.trim(),
				});
			},
		});
	}),
);
