import { Data, Effect, Schema } from "effect";
import { makeRequest } from "./EntityService";

class MarketService extends Data.TaggedClass("MarketService") {
  /**
   * Get the list of markets where Spotify is available.
   *
   * @returns {Promise<String[]>} A markets object with an array of country codes
   */
  getAll(): Promise<String[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(`markets`, Schema.Array(Schema.String));
      }),
    );
  }
}
