import {
	Config,
	ConfigProvider,
	Effect,
	Layer,
	Option,
	Redacted,
	Schema,
} from "effect";
import {
	AuthService,
	layerFromStorage,
	PKCEService,
	PKCETokenExtensionSchema,
	TOKEN_KEY,
	type StorageAdapter,
} from "./index";
import {
	InvalidStateError,
	JsonParseError,
	NetworkError,
	SchemaDecodeError,
	TokenNotFoundError,
	UnknownApiError,
} from "@errors/index";
import { KeyValueStore } from "@effect/platform/KeyValueStore";

const VERIFIER_KEY = "@better-music/verifier";

const StoredTokenSchema = Schema.Struct({
	access_token: Schema.String,
	token_type: Schema.String,
	expires_at: Schema.Number,
	scope: Schema.String,
	refresh_token: Schema.String,
});

const VerifierSchema = Schema.Struct({
	code_verifier: Schema.String,
	state: Schema.String,
});

function generatePKCE() {
	return Effect.gen(function* () {
		const verifierBytes = crypto.getRandomValues(new Uint8Array(32));

		const codeVerifier = Buffer.from(new Uint8Array(verifierBytes))
			.toString("base64")
			.replace(/=/g, "")
			.replace(/\+/g, "-")
			.replace(/\//g, "_");

		const hashed = yield* Effect.promise(() =>
			crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier)),
		);

		const codeChallenge = Buffer.from(new Uint8Array(hashed))
			.toString("base64")
			.replace(/=/g, "")
			.replace(/\+/g, "-")
			.replace(/\//g, "_");

		return { codeVerifier, codeChallenge };
	});
}

function refreshToken({
	clientId,
	refreshToken,
}: {
	clientId: string;
	refreshToken: string;
}) {
	return Effect.gen(function* () {
		const response = yield* Effect.tryPromise({
			try: () =>
				fetch("https://accounts.spotify.com/api/token", {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: new URLSearchParams({
						grant_type: "refresh_token",
						refresh_token: refreshToken,
						client_id: clientId,
					}),
				}),
			catch: (cause) =>
				new NetworkError({
					message: "Failed sending refresh token request",
					url: "https://accounts.spotify.com/api/token",
					cause,
				}),
		});

		if (!response.ok) {
			return yield* Effect.fail(
				new UnknownApiError({
					cause: `Token refresh failed with status ${response.status}`,
				}),
			);
		}

		const json = yield* Effect.tryPromise({
			try: () => response.json(),
			catch: (cause) =>
				new JsonParseError({
					message: "Failed to transform refresh token response",
					cause,
				}),
		});

		return yield* Schema.decodeUnknown(PKCETokenExtensionSchema)(json).pipe(
			Effect.mapError(
				(cause) =>
					new SchemaDecodeError({
						message:
							"Failed to decode Spotify PKCE token response during refresh",
						cause,
					}),
			),
		);
	});
}

export function makePKCEAuth(adapter: StorageAdapter, scopes: string[]) {
	const authLayer = Layer.effect(
		AuthService,
		Effect.gen(function* () {
			const clientId = Redacted.value(
				yield* Config.redacted("SPOTIFY_CLIENT_ID"),
			);

			const tokenKv = (yield* KeyValueStore).forSchema(StoredTokenSchema);

			return AuthService.of({
				getToken: Effect.gen(function* () {
					const maybeToken = Option.getOrNull(
						yield* tokenKv
							.get(TOKEN_KEY)
							.pipe(Effect.mapError((cause) => new UnknownApiError({ cause }))),
					);

					if (!maybeToken) {
						return yield* Effect.fail(
							new TokenNotFoundError({
								message:
									"No token found. Call login() and exchange(code) first.",
							}),
						);
					}

					if (maybeToken.expires_at < Date.now()) {
						const token = yield* refreshToken({
							clientId,
							refreshToken: maybeToken.refresh_token,
						});

						yield* tokenKv
							.set(TOKEN_KEY, {
								access_token: token.access_token,
								token_type: token.token_type,
								expires_at: Date.now() + token.expires_in * 1000,
								scope: token.scope,
								refresh_token: token.refresh_token ?? maybeToken.refresh_token,
							})
							.pipe(Effect.mapError((cause) => new UnknownApiError({ cause })));

						return token.access_token;
					}

					return maybeToken.access_token;
				}),
			});
		}),
	);

	const pkceLayer = Layer.effect(
		PKCEService,
		Effect.gen(function* () {
			const clientId = Redacted.value(
				yield* Config.redacted("SPOTIFY_CLIENT_ID"),
			);

			const redirectUri = Redacted.value(
				yield* Config.redacted("SPOTIFY_REDIRECT_URI"),
			);

			const baseKv = yield* KeyValueStore;
			const tokenKv = baseKv.forSchema(StoredTokenSchema);
			const verifierKv = baseKv.forSchema(VerifierSchema);

			const removeVerifier = Effect.ignore(verifierKv.remove(VERIFIER_KEY));

			const login = Effect.gen(function* () {
				const { codeVerifier, codeChallenge } = yield* generatePKCE();

				const state = crypto.randomUUID();

				yield* verifierKv
					.set(VERIFIER_KEY, {
						code_verifier: codeVerifier,
						state,
					})
					.pipe(Effect.mapError((cause) => new UnknownApiError({ cause })));

				const authUrl = new URL("https://accounts.spotify.com/authorize");

				authUrl.search = new URLSearchParams({
					response_type: "code",
					client_id: clientId,
					scope: scopes.join(" "),
					state,
					code_challenge_method: "S256",
					code_challenge: codeChallenge,
					redirect_uri: redirectUri,
				}).toString();

				const exchange = (params: { code: string; state: string }) =>
					Effect.gen(function* () {
						const stored = Option.getOrNull(
							yield* verifierKv
								.get(VERIFIER_KEY)
								.pipe(
									Effect.mapError((cause) => new UnknownApiError({ cause })),
								),
						);

						if (!stored) {
							return yield* Effect.fail(
								new TokenNotFoundError({
									message: "Missing PKCE verifier. Call login() first.",
								}),
							);
						}

						if (params.state !== stored.state) {
							return yield* Effect.fail(
								new InvalidStateError({
									message: "Invalid state. Possible CSRF attack.",
								}),
							);
						}

						const response = yield* Effect.tryPromise({
							try: () =>
								fetch("https://accounts.spotify.com/api/token", {
									method: "POST",
									headers: {
										"Content-Type": "application/x-www-form-urlencoded",
									},
									body: new URLSearchParams({
										client_id: clientId,
										grant_type: "authorization_code",
										code: params.code,
										redirect_uri: redirectUri,
										code_verifier: stored.code_verifier,
									}),
								}),
							catch: (cause) =>
								new NetworkError({
									message: "Failed sending PKCE token request",
									url: "https://accounts.spotify.com/api/token",
									cause,
								}),
						});

						if (!response.ok) {
							const body = yield* Effect.tryPromise({
								try: () => response.text(),
								catch: (cause) =>
									new JsonParseError({
										message: "Failed to read error body",
										cause,
									}),
							});
							console.error("Token exchange error body:", body);
							return yield* Effect.fail(
								new UnknownApiError({
									cause: `Token fetch failed with status ${response.status}`,
								}),
							);
						}

						const json = yield* Effect.tryPromise({
							try: () => response.json(),
							catch: (cause) =>
								new JsonParseError({
									message: "Failed to transform PKCE token response",
									cause,
								}),
						});

						const token = yield* Schema.decodeUnknown(PKCETokenExtensionSchema)(
							json,
						).pipe(
							Effect.mapError(
								(cause) =>
									new SchemaDecodeError({
										message: "Failed to decode Spotify PKCE token response",
										cause,
									}),
							),
						);

						if (!token.refresh_token) {
							return yield* Effect.fail(
								new TokenNotFoundError({
									message: "No refresh_token in Spotify response",
								}),
							);
						}

						yield* tokenKv
							.set(TOKEN_KEY, {
								access_token: token.access_token,
								token_type: token.token_type,
								expires_at: Date.now() + token.expires_in * 1000,
								scope: token.scope,
								refresh_token: token.refresh_token,
							})
							.pipe(Effect.mapError((cause) => new UnknownApiError({ cause })));

						return token.access_token;
					}).pipe(Effect.ensuring(removeVerifier));

				return {
					url: authUrl.toString(),
					exchange,
				};
			});

			return PKCEService.of({
				login,
			});
		}),
	);

	return Layer.merge(authLayer, pkceLayer).pipe(
		Layer.provide(layerFromStorage(adapter)),
		Layer.provide(Layer.setConfigProvider(ConfigProvider.fromEnv())),
	);
}
