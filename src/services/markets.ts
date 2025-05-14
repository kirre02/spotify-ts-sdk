import { Data, Effect, Schema } from "effect";
import { makeRequest } from "@core/client";

export class MarketService extends Data.TaggedClass("MarketService") {
	/**
	 * Get Available Markets
	 *
	 * @remarks
	 * Get the list of markets where Spotify is available.
	 */
	getAll(): Promise<String[]> {
		return Effect.runPromise(
			makeRequest({ route: "markets", schema: Schema.Array(Schema.String) }),
		);
	}
}
