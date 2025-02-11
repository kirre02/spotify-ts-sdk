import { Config, Effect, Schema } from "effect";
import { FetchError, JsonError } from "../errors";

export interface IEntity<T> {
  get(id: string): Promise<T>;
  getMany(ids: string): Promise<T[]>;
}

export function makeRequest(route: string, schema: Schema.Schema<any>) {
  return Effect.gen(function* () {
    const baseUrl = "https://api.spotify.com/v1/";
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(`${baseUrl}${route}`, {
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
