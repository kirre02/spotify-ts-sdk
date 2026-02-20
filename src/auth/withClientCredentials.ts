import {
	Cache,
	Config,
	Duration,
	Effect,
	Layer,
	Redacted,
	Schema,
} from "effect";
import { JsonParseError, NetworkError, UnknownApiError } from "../errors";
import { AuthService } from "./index";
import { PlatformConfigProvider } from "@effect/platform";
import { NodeFileSystem } from "@effect/platform-node";

const TokenResponse = Schema.Struct({
	access_token: Schema.String,
	token_type: Schema.String,
	expires_in: Schema.Number,
});

function fetchToken(clientId: string, clientSecret: string) {
	return Effect.gen(function* () {
		const response = yield* Effect.tryPromise({
			try: () =>
				fetch("https://accounts.spotify.com/api/token", {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
					},
					body: "grant_type=client_credentials",
				}),
			catch: (cause) =>
				new NetworkError({
					message: "Failed sending client credentials token request",
					url: "https://accounts.spotify.com/api/token",
					cause,
				}),
		});

		if (!response.ok) {
			return yield* new UnknownApiError({
				cause: `Token fetch failed with status ${response.status}`,
			});
		}

		const json = yield* Effect.tryPromise({
			try: () => response.json(),
			catch: (cause) =>
				new JsonParseError({
					message: "Failed to transform client credentials token response",
					cause,
				}),
		});

		return yield* Schema.decodeUnknown(TokenResponse)(json);
	});
}

export function makeClientCredentialsAuth() {
	return Layer.effect(
		AuthService,
		Effect.gen(function* () {
			const clientId = yield* Config.redacted("SPOTIFY_CLIENT_ID");
			const clientSecret = yield* Config.redacted("SPOTIFY_CLIENT_SECRET");
			const tokenCache = yield* Cache.make({
				capacity: 1,
				timeToLive: Duration.minutes(55),
				lookup: () =>
					fetchToken(Redacted.value(clientId), Redacted.value(clientSecret)),
			});

			return AuthService.of({
				getToken: Effect.gen(function* () {
					const tokenResponse = yield* tokenCache.get("token");
					return tokenResponse.access_token;
				}).pipe(Effect.orDie),
			});
		}),
	).pipe(
		Layer.provide(
			Layer.unwrapEffect(
				PlatformConfigProvider.fromDotEnv(".env").pipe(
					Effect.provide(NodeFileSystem.layer),
					Effect.map(Layer.setConfigProvider),
				),
			),
		),
	);
}
