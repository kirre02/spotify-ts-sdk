import {
	Config,
	ConfigProvider,
	Effect,
	Layer,
	Option,
	Redacted,
	Schema,
} from "effect";
import { JsonParseError, NetworkError, UnknownApiError } from "../errors";
import {
	AuthService,
	BaseTokenSchema,
	layerFromStorage,
	TOKEN_KEY,
	type StorageAdapter,
} from "./index";
import { KeyValueStore } from "@effect/platform/KeyValueStore";

const StoredTokenSchema = Schema.Struct({
	access_token: Schema.String,
	token_type: Schema.String,
	expires_at: Schema.Number,
});

function fetchToken(clientId: string, clientSecret: string) {
	return Effect.gen(function* () {
		const response = yield* Effect.tryPromise({
			try: () =>
				fetch("https://accounts.spotify.com/api/token", {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
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

		return yield* Schema.decodeUnknown(BaseTokenSchema)(json);
	});
}

export function makeClientCredentialsAuth(adapter: StorageAdapter) {
	return Layer.effect(
		AuthService,
		Effect.gen(function* () {
			const clientId = yield* Config.redacted("SPOTIFY_CLIENT_ID");
			const clientSecret = yield* Config.redacted("SPOTIFY_CLIENT_SECRET");
			const kv = (yield* KeyValueStore).forSchema(StoredTokenSchema);

			return AuthService.of({
				getToken: Effect.gen(function* () {
					const maybeToken = Option.getOrNull(yield* kv.get(TOKEN_KEY));
					if (!maybeToken || maybeToken.expires_at < Date.now()) {
						const token = yield* fetchToken(
							Redacted.value(clientId),
							Redacted.value(clientSecret),
						);

						yield* kv.set(TOKEN_KEY, {
							access_token: token.access_token,
							token_type: token.token_type,
							expires_at: Date.now() + token.expires_in * 1000,
						});

						return token.access_token;
					}
					return maybeToken.access_token;
				}).pipe(Effect.orDie),
			});
		}),
	).pipe(
		Layer.provide(layerFromStorage(adapter)),
		Layer.provide(Layer.setConfigProvider(ConfigProvider.fromEnv())),
	);
}
