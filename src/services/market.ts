import type { AuthService } from "@auth/index";
import type { ApiError } from "@errors";
import { makeRequest } from "@transporter";
import { Context, Effect, Layer, Schema } from "effect";

export class MarketService extends Context.Tag("MarketService")<
  MarketService,
  {
    readonly getAll: () => Effect.Effect<readonly string[], ApiError, AuthService>;
  }
>() {}

export const MarketServiceLive = Layer.effect(
  MarketService,
  Effect.succeed(
    MarketService.of({
      getAll: () => {
        return makeRequest({
          route: "markets",
          schema: Schema.Array(Schema.String),
        });
      },
    }),
  ),
);
