import { Effect } from "effect";

export interface IEntity<T> {
  get(id: string): Promise<T>;
  getMany(ids: string): Promise<T[]>;
}

export function makeRequest<T>(
  route: string,
  apiKey: string,
): Effect.Effect<T, Error> {
  return Effect.tryPromise({
    try: async () => {
      Effect.log(`Handling fetch for route: ${route}`);
      const response = await fetch(`https://api.spotify.com/v1/${route}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (!response.ok) {
        throw new Error(
          `Error in services/makeRequest: ${response.statusText}`,
        );
      }

      return (await response.json()) as T;
    },
    catch: (error) => {
      const handledError = error as Error;
      Effect.log(
        `Unknown error while fetching route: ${route}`,
        "Message:",
        handledError.message,
        "Trace:",
        handledError.stack,
      );
      return handledError;
    },
  });
}
