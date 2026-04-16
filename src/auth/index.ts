import { KeyValueStore } from "@effect/platform";
import type { PlatformError } from "@effect/platform/Error";
import type {
	JsonParseError,
	NetworkError,
	SchemaDecodeError,
	TokenNotFoundError,
	UnknownApiError,
} from "@errors/index";
import { Context, Effect, Layer, Option, Schema } from "effect";
import type { ParseError } from "effect/ParseResult";

export const TOKEN_KEY = "@better-music/token";

export class AuthService extends Context.Tag("AuthService")<
	AuthService,
	{
		getToken: Effect.Effect<
			string,
			| NetworkError
			| UnknownApiError
			| JsonParseError
			| SchemaDecodeError
			| TokenNotFoundError
		>;
	}
>() {}

type AuthError =
	| NetworkError
	| UnknownApiError
	| JsonParseError
	| PlatformError
	| ParseError
	| Error;

export class PKCEService extends Context.Tag("PKCEService")<
	PKCEService,
	{
		getAuthorizationUrl: Effect.Effect<string, AuthError>;
		exchangeCodeForTokens: (params: {
			code: string;
			state: string;
		}) => Effect.Effect<string, AuthError>;
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
	refresh_token: Schema.optional(Schema.String),
});

export interface StorageAdapter {
	get: (key: string) => Promise<string | undefined>;
	set: (key: string, value: string) => Promise<void>;
	remove?: (key: string) => Promise<void>;
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
			remove: (key) => {
				const remove = adapter.remove;
				return remove ? Effect.promise(() => remove(key)) : Effect.void;
			},
		}),
	);
}
