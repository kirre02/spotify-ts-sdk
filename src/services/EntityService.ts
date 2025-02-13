import { Config, Effect, Schema } from "effect";
import { FetchError, JsonError } from "../errors";

export interface IEntity<T> {
  get(id: string, options?: AllOptions): Promise<T>;
  getMany(ids: string, options?: AllOptions): Promise<T[]>;
}

export interface MarketOnlyOptions {
  market?: string;
}

export interface LocaleOnlyOptions {
  locale?: string;
}

export interface RecommendationOptions {
  limit?: number;
  market?: string;
  min_acousticness?: number;
  max_acousticness?: number;
  target_acousticness?: number;
  min_danceability?: number;
  max_danceability?: number;
  target_danceability?: number;
  min_duration_ms?: number;
  max_duration_ms?: number;
  target_duration_ms?: number;
  min_energy?: number;
  max_energy?: number;
  target_energy?: number;
  min_instrumentalness?: number;
  max_instrumentalness?: number;
  target_instrumentalness?: number;
  min_key?: number;
  max_key?: number;
  target_key?: number;
  min_liveness?: number;
  max_liveness?: number;
  target_liveness?: number;
  min_loudness?: number;
  max_loudness?: number;
  target_loudness?: number;
  min_mode?: number;
  max_mode?: number;
  target_mode?: number;
  min_popularity?: number;
  max_popularity?: number;
  target_popularity?: number;
  min_speechiness?: number;
  max_speechiness?: number;
  target_speechiness?: number;
  min_tempo?: number;
  max_tempo?: number;
  target_tempo?: number;
  min_time_signature?: number;
  max_time_signature?: number;
  target_time_signature?: number;
  min_valence?: number;
  max_valence?: number;
  target_valence?: number;
}

export interface PaginatedMarketOptions {
  market?: string;
  limit?: number;
  offset?: number;
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export interface AlbumRetrievalOptions {
  include_groups?: string;
  market?: string;
  limit?: number;
  offset?: number;
}

export interface LocalizedPaginationOptions {
  locale?: string;
  limit?: number;
  offset: number;
}

export interface MarketAdditionalTypesOptions {
  market?: string;
  additional_types?: string;
}

export interface DateRangeOptions {
  limit?: number;
  after?: number;
  before?: number;
}

export interface MarketFieldOptions {
  market?: string;
  fields?: string;
  additional_types?: string;
}

export interface DetailedMarketPaginationOptions {
  market?: string;
  fields?: string;
  limit?: number;
  offset?: number;
  additional_types?: string;
}

export interface MarketExternalOptions {
  market?: string;
  limit?: number;
  offset?: number;
  include_external?: string;
}

export interface TimeRangePaginationOptions {
  time_range?: string;
  limit?: number;
  offset?: number;
}

export interface AfterBasedPaginationOptions {
  after?: string;
  limit?: number;
}

type AllOptions =
  | MarketOnlyOptions
  | LocaleOnlyOptions
  | RecommendationOptions
  | PaginatedMarketOptions
  | PaginationOptions
  | AlbumRetrievalOptions
  | LocalizedPaginationOptions
  | MarketAdditionalTypesOptions
  | DateRangeOptions
  | MarketFieldOptions
  | DetailedMarketPaginationOptions
  | MarketExternalOptions
  | TimeRangePaginationOptions
  | AfterBasedPaginationOptions;

export function makeRequest(
  route: string,
  schema: Schema.Schema<any>,
  options?: AllOptions,
) {
  return Effect.gen(function* () {
    const baseUrl = "https://api.spotify.com/v1/";

    const params = new URLSearchParams();
    if (options) {
      Object.entries(options as Record<string, string | number>).forEach(
        ([key, value]) => {
          if (value !== undefined) params.append(key, value.toString());
        },
      );
    }

    const url = params.toString()
      ? `${baseUrl}${route}?${params.toString()}`
      : `${baseUrl}${route}`;

    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(url, {
          headers: {
            Authorization: `Bearer ${yield* Config.redacted("SPOTIFY_API_KEY")}`,
          },
        }),
      catch: () => new FetchError(),
    });

    if (!response.ok) {
      return yield* new FetchError();
    }

    const json = yield* Effect.tryPromise({
      try: () => response.json(),
      catch: () => new JsonError(),
    });

    return yield* Schema.decodeUnknown(schema)(json);
  });
}
