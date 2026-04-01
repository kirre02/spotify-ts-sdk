import { Context, Effect, Layer, Schema } from "effect";
import { IllegalArgumentException } from "effect/Cause";
import { makeRequest } from "@core/client";
import type {
	DetailedMarketPaginationOptions,
	MarketFieldOptions,
	PaginationOptions,
} from "@internal/options";
import {
	GetPlaylistItemResponseSchema,
	GetPlaylistResponseSchema,
	UpdatePlaylistItemResponseSchema,
	type AddPlaylistItemRequest,
	type AddPlaylistCoverImageRequest,
	type ChangeDetailsRequest,
	type CreatePlaylistRequest,
	type GetPlaylistCoverImageRequest,
	type GetPlaylistItemRequest,
	type GetPlaylistItemResponse,
	type GetPlaylistRequest,
	type GetPlaylistResponse,
	type GetUserPlaylistRequest,
	type RemovePlaylistItemRequest,
	type UpdatePlaylistItemRequest,
	type UpdatePlaylistItemResponse,
	type AddPlaylistItemResponse,
	type RemovePlaylistItemResponse,
	AddPlaylistItemResponseSchema,
	RemovePlaylistItemResponseSchema,
	type GetCurrentUserPlaylistResponse,
	GetCurrentUserPlaylistResponseSchema,
	CreatePlaylistResponseSchema,
	type CreatePlaylistResponse,
	GetUserPlaylistResponseSchema,
	type GetUserPlaylistResponse,
	GetPlaylistCoverImageResponseSchema,
	type GetPlaylistCoverImageResponse,
} from "@internal/services/playlist";
import type { ApiError } from "@errors/index";
import type { AuthService } from "auth";

export class PlaylistService extends Context.Tag("PlaylistService")<
	PlaylistService,
	{
		readonly get: (
			request: GetPlaylistRequest,
			options?: MarketFieldOptions,
		) => Effect.Effect<GetPlaylistResponse, ApiError, AuthService>;
		readonly changeDetails: (
			request: ChangeDetailsRequest,
		) => Effect.Effect<void, ApiError, AuthService>;
		readonly getItems: (
			request: GetPlaylistItemRequest,
			options?: DetailedMarketPaginationOptions,
		) => Effect.Effect<GetPlaylistItemResponse, ApiError, AuthService>;
		readonly updateItems: (
			request: UpdatePlaylistItemRequest,
		) => Effect.Effect<UpdatePlaylistItemResponse, ApiError, AuthService>;
		readonly add: (
			request: AddPlaylistItemRequest,
		) => Effect.Effect<AddPlaylistItemResponse, ApiError, AuthService>;
		readonly remove: (
			request: RemovePlaylistItemRequest,
		) => Effect.Effect<RemovePlaylistItemResponse, ApiError, AuthService>;
		readonly getPlaylists: (
			options?: PaginationOptions,
		) => Effect.Effect<GetCurrentUserPlaylistResponse, ApiError, AuthService>;
		readonly getUsersPlaylists: (
			request: GetUserPlaylistRequest,
			options?: PaginationOptions,
		) => Effect.Effect<GetUserPlaylistResponse, ApiError, AuthService>;
		readonly create: (
			request: CreatePlaylistRequest,
		) => Effect.Effect<CreatePlaylistResponse, ApiError, AuthService>;
		readonly getCoverImage: (
			request: GetPlaylistCoverImageRequest,
		) => Effect.Effect<GetPlaylistCoverImageResponse, ApiError, AuthService>;
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
					schema: GetPlaylistResponseSchema,
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

				if (options?.limit !== undefined) {
					if (options.limit < 0 || options.limit > 50) {
						throw new IllegalArgumentException(
							"Limit must be between 0 and 50",
						);
					}
				}

				return makeRequest({
					route: `playlists/${id.trim()}/tracks`,
					schema: GetPlaylistItemResponseSchema,
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
					schema: UpdatePlaylistItemResponseSchema,
					body: JSON.stringify({
						uris,
						range_start: rangeStart,
						insert_before: insertBefore,
						range_length: rangeLength,
						snapshot_id: snapshotId,
					}),
				});
			},
			add: (request: AddPlaylistItemRequest) => {
				const { playlistId, position, uris } = request;

				return makeRequest({
					method: "POST",
					route: `playlists/${playlistId}/tracks`,
					schema: AddPlaylistItemResponseSchema,
					body: JSON.stringify({
						position,
						uris,
					}),
				});
			},
			remove: (request: RemovePlaylistItemRequest) => {
				const { playlistId, tracks, snapshotId } = request;

				if (tracks?.length > 100) {
					throw new IllegalArgumentException(
						"Maximum 100 objects allowed per request",
					);
				}

				return makeRequest({
					method: "DELETE",
					route: `playlists/${playlistId.trim()}/tracks`,
					schema: RemovePlaylistItemResponseSchema,
					body: JSON.stringify({
						tracks,
						snapshot_id: snapshotId,
					}),
				});
			},
			getPlaylists: (options?: PaginationOptions) => {
				if (options?.limit !== undefined) {
					if (options.limit < 0 || options.limit > 50) {
						throw new IllegalArgumentException(
							"Limit must be between 0 and 50",
						);
					}
				}

				return makeRequest({
					route: "me/playlists",
					schema: GetCurrentUserPlaylistResponseSchema,
					options,
				});
			},
			getUsersPlaylists: (
				request: GetUserPlaylistRequest,
				options?: PaginationOptions,
			) => {
				const { id } = request;

				if (options?.limit !== undefined) {
					if (options.limit < 0 || options.limit > 50) {
						throw new IllegalArgumentException(
							"Limit must be between 0 and 50",
						);
					}
				}

				return makeRequest({
					route: `users/${id.trim()}/playlists`,
					schema: GetUserPlaylistResponseSchema,
					options,
				});
			},
			create: (request: CreatePlaylistRequest) => {
				const { userId, name, isPublic, collaborative, description } = request;

				return makeRequest({
					method: "POST",
					route: `users/${userId}/playlists`,
					schema: CreatePlaylistResponseSchema,
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
					schema: GetPlaylistCoverImageResponseSchema,
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
