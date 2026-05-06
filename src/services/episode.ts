import type { AuthService } from "@auth/index";
import type { ApiError } from "@errors";
import { guardId, guardIds, guardLimit, guardMarket, guardOffset } from "@guards";
import type { MarketOnlyOptions, PaginatedMarketOptions } from "@schemas/options";
import {
  type GetEpisodeRequest,
  type GetEpisodeResponse,
  type GetSavedEpisodeResponse,
  type GetSeveralEpisodeRequest,
  type GetSeveralEpisodeResponse,
  type SaveEpisodeRequest,
  type RemoveEpisodeRequest,
  type CheckSavedEpisodeRequest,
  GetSavedEpisodeResponseSchema,
  GetEpisodeResponseSchema,
  GetSeveralEpisodeResponseSchema,
} from "@schemas/services/episode";
import { makeRequest } from "@transporter";
import { Context, Effect, Layer, Schema } from "effect";

export class EpisodeService extends Context.Tag("EpisodeService")<
  EpisodeService,
  {
    readonly get: (
      request: GetEpisodeRequest,
      options?: MarketOnlyOptions,
    ) => Effect.Effect<GetEpisodeResponse, ApiError, AuthService>;
    readonly getMany: (
      request: GetSeveralEpisodeRequest,
      options?: MarketOnlyOptions,
    ) => Effect.Effect<GetSeveralEpisodeResponse, ApiError, AuthService>;
    readonly getSaved: (
      options?: PaginatedMarketOptions,
    ) => Effect.Effect<GetSavedEpisodeResponse, ApiError, AuthService>;
    readonly save: (request: SaveEpisodeRequest) => Effect.Effect<void, ApiError, AuthService>;
    readonly remove: (request: RemoveEpisodeRequest) => Effect.Effect<void, ApiError, AuthService>;
    readonly checkSaved: (
      request: CheckSavedEpisodeRequest,
    ) => Effect.Effect<readonly boolean[], ApiError, AuthService>;
  }
>() {}

export const EpisodeServiceLive = Layer.effect(
  EpisodeService,
  Effect.succeed(
    EpisodeService.of({
      get: (request: GetEpisodeRequest, options?: MarketOnlyOptions) => {
        const { id } = request;

        guardId(id, "[EpisodeService/Get] Episode id");
        if (options?.market != null) guardMarket(options.market, "[EpisodeService/Get]");

        return makeRequest({
          route: `episodes/${id.trim()}`,
          schema: GetEpisodeResponseSchema,
          options,
        });
      },
      getMany: (request: GetSeveralEpisodeRequest, options?: MarketOnlyOptions) => {
        const { ids } = request;

        guardIds(ids, "[EpisodeService/GetMany] Episode ids", 50);
        if (options?.market != null) guardMarket(options.market, "[EpisodeService/GetMany]");

        const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

        return makeRequest({
          route: `episodes?ids=${encodedIds}`,
          schema: GetSeveralEpisodeResponseSchema,
          options,
        });
      },
      getSaved: (options?: PaginatedMarketOptions) => {
        if (options?.market != null) guardMarket(options.market, "[EpisodeService/GetSaved]");
        if (options?.limit != null) guardLimit(options.limit, 50, "[EpisodeService/GetSaved]");
        if (options?.offset != null) guardOffset(options.offset, "[EpisodeService/GetSaved]");

        return makeRequest({
          route: "me/episodes",
          schema: GetSavedEpisodeResponseSchema,
          options,
        });
      },
      save: (request: SaveEpisodeRequest) => {
        const { ids } = request;

        guardIds(ids, "[EpisodeService/Save] Episode ids", 50);

        const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

        return makeRequest({
          method: "PUT",
          route: `me/episodes?ids=${encodedIds}`,
          schema: Schema.Void,
        });
      },
      remove: (request: RemoveEpisodeRequest) => {
        const { ids } = request;

        guardIds(ids, "[EpisodeService/Remove] Episode ids", 50);

        const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

        return makeRequest({
          method: "DELETE",
          route: `me/episodes?ids=${encodedIds}`,
          schema: Schema.Void,
        });
      },
      checkSaved: (request: CheckSavedEpisodeRequest) => {
        const { ids } = request;

        guardIds(ids, "[EpisodeService/CheckSaved] Episode ids", 50);

        const encodedIds = ids.map((id) => id.trim()).join(encodeURIComponent(","));

        return makeRequest({
          route: `me/episodes/contains?ids=${encodedIds}`,
          schema: Schema.Array(Schema.Boolean),
        });
      },
    }),
  ),
);
