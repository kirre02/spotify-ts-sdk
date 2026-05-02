import { makeRequest } from "@transporter";
import type { ApiError } from "@errors";
import { Context, Effect, Layer, Schema } from "effect";
import type { AuthService } from "@auth/index";

export class MarketService extends Context.Tag("MarketService")<
	MarketService,
	{
		readonly getAll: () => Effect.Effect<
			readonly string[],
			ApiError,
			AuthService
		>;
	}
>() {}

export const MarketServiceLive = Layer.effect(
	MarketService,
	Effect.gen(function* () {
		return MarketService.of({
			getAll: () => {
				return makeRequest({
					route: "markets",
					schema: Schema.Array(Schema.String),
				});
			},
		});
	}),
);
