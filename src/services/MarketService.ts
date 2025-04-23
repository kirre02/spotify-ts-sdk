import { Data, Effect, Schema } from "effect";
import { makeRequest } from "./EntityService";

export class MarketService extends Data.TaggedClass("MarketService") {
  /**
   * Get the list of markets where Spotify is available.
   *
   * @returns {Promise<String[]>} A markets object with an array of country codes
   */
  getAll(): Promise<String[]> {
    return Effect.runPromise(
      makeRequest(`markets`, Schema.Array(Schema.String))
    );
  }
}
