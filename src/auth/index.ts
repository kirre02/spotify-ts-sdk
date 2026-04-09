import { KeyValueStore } from "@effect/platform";
import { Context, Effect, Layer, Option, Schema } from "effect";

export const TOKEN_KEY = "@better-music/token";

export class AuthService extends Context.Tag("AuthService")<
	AuthService,
	{
		getToken: Effect.Effect<string>;
	}
>() {}

export const BaseTokenSchema = Schema.Struct({
	access_token: Schema.String,
	token_type: Schema.String,
	expires_in: Schema.Number,
});

export const PKCETokenExtensionSchema = Schema.Struct({
	...BaseTokenSchema.fields,
	scope: Schema.String,
	refresh_token: Schema.String,
});

export interface StorageAdapter {
	get: (key: string) => Promise<string | undefined>;
	set: (key: string, value: string) => Promise<void>;
}

export function layerFromStorage(adapter: StorageAdapter) {
	return Layer.succeed(
		KeyValueStore.KeyValueStore,
		KeyValueStore.makeStringOnly({
			get: (key) =>
				Effect.promise(() =>
					adapter
						.get(key)
						.then((v) => (v !== undefined ? Option.some(v) : Option.none())),
				),
			set: (key, value) => Effect.promise(() => adapter.set(key, value)),
			clear: Effect.void,
			size: Effect.succeed(0),
			remove: (_key) => Effect.void,
		}),
	);
}
