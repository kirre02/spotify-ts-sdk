import type { AuthService } from "@auth/index";
import type { ApiError } from "@errors";
import {
  guardAdditionalTypes,
  guardFields,
  guardId,
  guardLimit,
  guardMarket,
  guardOffset,
  guardString,
  guardUris,
} from "@guards";
import type {
  DetailedMarketPaginationOptions,
  MarketFieldOptions,
  PaginationOptions,
} from "@schemas/options";
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
} from "@schemas/services/playlist";
import { makeRequest } from "@transporter";
import { Context, Effect, Layer, Schema } from "effect";
import { IllegalArgumentException } from "effect/Cause";

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
  Effect.succeed(
    PlaylistService.of({
      get: (request: GetPlaylistRequest, options?: MarketFieldOptions) => {
        const { id } = request;

        guardId(id, "[PlaylistService/Get] Playlist id");
        if (options?.market != null) guardMarket(options.market, "[PlaylistService/Get]");
        if (options?.additional_types != null)
          guardAdditionalTypes(options.additional_types, "[PlaylistService/Get]");
        if (options?.fields != null) guardFields(options.fields, "[PlaylistService/Get]");

        return makeRequest({
          route: `playlists/${id.trim()}`,
          schema: GetPlaylistResponseSchema,
          options,
        });
      },
      changeDetails: (request: ChangeDetailsRequest) => {
        const { id, name, isPublic, collaborative, description } = request;

        guardId(id, "[PlaylistService/ChangeDetails] Playlist id");
        if (name != null) guardString(name, "[PlaylistService/ChangeDetails] Name");
        if (isPublic != null && typeof isPublic !== "boolean")
          throw new IllegalArgumentException(
            "[PlaylistService/ChangeDetails] isPublic must be a boolean",
          );
        if (collaborative != null && typeof collaborative !== "boolean")
          throw new IllegalArgumentException(
            "[PlaylistService/ChangeDetails] Collaborative must be a boolean",
          );
        if (description != null)
          guardString(description, "[PlaylistService/ChangeDetails] Description");

        return makeRequest({
          method: "PUT",
          route: `playlists/${id.trim()}`,
          schema: Schema.Void,
          body: {
            name,
            public: isPublic,
            collaborative,
            description,
          },
        });
      },
      getItems: (request: GetPlaylistItemRequest, options?: DetailedMarketPaginationOptions) => {
        const { id } = request;

        guardId(id, "[PlaylistService/GetItems] Playlist id");
        if (options?.market != null) guardMarket(options.market, "[PlaylistService/GetItems]");
        if (options?.fields != null) guardFields(options.fields, "[PlaylistService/GetItems]");
        if (options?.limit != null) guardLimit(options.limit, 50, "[PlaylistService/GetItems]");
        if (options?.offset != null) guardOffset(options.offset, "[PlaylistService/GetItems]");
        if (options?.additional_types != null)
          guardAdditionalTypes(options.additional_types, "[PlaylistService/GetItems]");

        return makeRequest({
          route: `playlists/${id.trim()}/tracks`,
          schema: GetPlaylistItemResponseSchema,
          options,
        });
      },
      updateItems: (request: UpdatePlaylistItemRequest) => {
        const { id, uris, rangeStart, insertBefore, rangeLength, snapshotId } = request;

        guardId(id, "[PlaylistService/UpdateItems] Playlist id");
        if (uris != null) {
          if (uris.length < 1 || uris.length > 100)
            throw new IllegalArgumentException(
              "[PlaylistService/UpdateItems] Uris must contain between 1 & 100 items",
            );
          guardUris(uris, "[PlaylistService/UpdateItems] Uris");
        }
        if (rangeStart != null) {
          if (!Number.isInteger(rangeStart))
            throw new IllegalArgumentException(
              "[PlaylistService/UpdateItems] Range start must be an integer",
            );
        }
        if (insertBefore != null) {
          if (!Number.isInteger(insertBefore))
            throw new IllegalArgumentException(
              "[PlaylistService/UpdateItems] Insert before must be an integer",
            );
        }
        if (rangeLength != null) {
          if (!Number.isInteger(rangeLength))
            throw new IllegalArgumentException(
              "[PlaylistService/UpdateItems] Range length must be an integer",
            );
        }
        if (snapshotId != null)
          guardString(snapshotId, "[PlaylistService/UpdateItems] Snapshot id");

        return makeRequest({
          method: "PUT",
          route: `playlists/${id.trim()}/tracks`,
          schema: UpdatePlaylistItemResponseSchema,
          body: {
            uris,
            range_start: rangeStart,
            insert_before: insertBefore,
            range_length: rangeLength,
            snapshot_id: snapshotId,
          },
        });
      },
      add: (request: AddPlaylistItemRequest) => {
        const { id, position, uris } = request;

        guardId(id, "[PlaylistService/Add] Playlist id");
        if (position != null) {
          if (!Number.isInteger(position))
            throw new IllegalArgumentException("[PlaylistService/Add] Position must be an integer");
        }
        if (uris != null) {
          if (uris.length > 100)
            throw new IllegalArgumentException(
              "[PlaylistService/Add] Uris can contain a maximum of 100 items",
            );
          guardUris(uris, "[PlaylistService/Add] Uris");
          if (
            uris.some(
              (uri) => !uri.startsWith("spotify:track") && !uri.startsWith("spotify:episode"),
            )
          )
            throw new IllegalArgumentException(
              "[PlaylistService/Add] Uris must either be of type track or episode",
            );
        }

        return makeRequest({
          method: "POST",
          route: `playlists/${id.trim()}/tracks`,
          schema: AddPlaylistItemResponseSchema,
          body: {
            position,
            uris,
          },
        });
      },
      remove: (request: RemovePlaylistItemRequest) => {
        const { id, tracks, snapshotId } = request;

        guardId(id, "[PlaylistService/Remove] Playlist id");
        if (tracks == null)
          throw new IllegalArgumentException("[PlaylistService/Remove] Tracks must be provided");
        if (tracks.length > 100)
          throw new IllegalArgumentException(
            "[PlaylistService/Remove] Tracks can contain a maximum of 100 items",
          );
        guardUris(
          tracks.map((track) => track.uri),
          "[PlaylistService/Remove] Tracks",
        );
        if (
          tracks.some(
            (track) =>
              !track.uri.startsWith("spotify:track") && !track.uri.startsWith("spotify:episode"),
          )
        )
          throw new IllegalArgumentException(
            "[PlaylistService/Remove] Tracks must either be of type track or episode",
          );
        if (snapshotId != null) guardString(snapshotId, "[PlaylistService/Remove] Snapshot id");

        return makeRequest({
          method: "DELETE",
          route: `playlists/${id.trim()}/tracks`,
          schema: RemovePlaylistItemResponseSchema,
          body: {
            tracks,
            snapshot_id: snapshotId,
          },
        });
      },
      getPlaylists: (options?: PaginationOptions) => {
        if (options?.limit != null) guardLimit(options.limit, 50, "[PlaylistService/GetPlaylists]");
        if (options?.offset != null) guardOffset(options.offset, "[PlaylistService/GetPlaylists]");

        return makeRequest({
          route: "me/playlists",
          schema: GetCurrentUserPlaylistResponseSchema,
          options,
        });
      },
      getUsersPlaylists: (request: GetUserPlaylistRequest, options?: PaginationOptions) => {
        const { id } = request;

        guardId(id, "[PlaylistService/GetUsersPlaylists] User id");
        if (options?.limit != null)
          guardLimit(options.limit, 50, "[PlaylistService/GetUsersPlaylists]");
        if (options?.offset != null)
          guardOffset(options.offset, "[PlaylistService/GetUsersPlaylists]");

        return makeRequest({
          route: `users/${id.trim()}/playlists`,
          schema: GetUserPlaylistResponseSchema,
          options,
        });
      },
      create: (request: CreatePlaylistRequest) => {
        const { name, isPublic, collaborative, description } = request;

        guardString(name, "[PlaylistService/Create] Playlist name");
        if (isPublic != null && typeof isPublic !== "boolean")
          throw new IllegalArgumentException("[PlaylistService/Create] isPublic must be a boolean");
        if (collaborative != null && typeof collaborative !== "boolean")
          throw new IllegalArgumentException(
            "[PlaylistService/Create] Collaborative must be a boolean",
          );
        if (description != null) guardString(description, "[PlaylistService/Create] Description");

        return makeRequest({
          method: "POST",
          route: "me/playlists",
          schema: CreatePlaylistResponseSchema,
          body: {
            name,
            public: isPublic,
            collaborative,
            description,
          },
        });
      },
      getCoverImage: (request: GetPlaylistCoverImageRequest) => {
        const { id } = request;

        guardId(id, "[PlaylistService/GetCoverImage] Playlist id");

        return makeRequest({
          route: `playlists/${id.trim()}/images`,
          schema: GetPlaylistCoverImageResponseSchema,
        });
      },
      addCustomCoverImage: (request: AddPlaylistCoverImageRequest) => {
        const { id, image } = request;

        guardId(id, "[PlaylistService/AddCustomCoverImage] Playlist id");
        guardString(image, "[PlaylistService/AddCustomCoverImage]");

        return makeRequest({
          method: "PUT",
          route: `playlists/${id.trim()}/images`,
          schema: Schema.Void,
          customHeaders: { "Content-Type": "image/jpeg" },
          body: image.trim(),
        });
      },
    }),
  ),
);
