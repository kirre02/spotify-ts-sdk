import { Config, Duration, Effect, Schema, Option, Schedule } from "effect";
import {
	BadRequestError,
	ForbiddenError,
	JsonParseError,
	NetworkError,
	NotFoundError,
	RateLimitError,
	SchemaDecodeError,
	UnauthorizedError,
	UnknownApiError,
} from "@errors/index";
import type { AllOptions } from "@internal/options";
import { ErrorSchema } from "@internal/schemas";
import { MemoryCache } from "cache/memoryCache";
import withClientCredentials from "auth/withClientCredentials";
import { AuthService } from "auth";

export function makeRequest({
	method = "GET",
	route,
	schema,
	options,
	customHeaders = {},
	body,
}: {
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	route: string;
	schema: Schema.Schema<any>;
	options?: AllOptions;
	customHeaders?: Record<string, string>;
	body?: string;
}) {
	const baseUrl = "https://api.spotify.com/v1/";
	const url = new URL(`${baseUrl}${route}`);

	if (options) {
		Object.entries(options).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				if (Array.isArray(value)) {
					value = value
						.map((x: string) => x.trim())
						.join(encodeURIComponent(","));
				}
				url.searchParams.append(key, String(value));
			}
		});
	}

	/*const cache = new MemoryCache();
	const tokenClass = new withClientCredentials(
		cache,
		"1d3962f6f2474934b12a5a7f4cfd7da9",
		"42868524178041c68898dc11c6a0b3b5",
	);*/

	/*const headers = {
		Authorization: `Bearer ${token}`,
		...customHeaders,
	};*/

	return Effect.gen(function* () {
		const authService = yield* AuthService;
		const token = yield* authService.getToken;
		/*const { token } = yield* Effect.tryPromise(() =>
			tokenClass.getAccessToken(),
		);*/

		const response = yield* Effect.tryPromise({
			try: () =>
				fetch(url.toString(), {
					method,
					headers: { Authorization: `Bearer ${token}`, ...customHeaders },
					...(body ? { body } : undefined),
				}),
			catch: (cause) =>
				new NetworkError({
					message: "Network request failed",
					url: url.toString(),
					cause,
				}),
		});

		const json = yield* Effect.tryPromise({
			try: () => response.json(),
			catch: (cause) =>
				new JsonParseError({
					message: "Failed to transform Spotify response to JSON",
					cause,
				}),
		});

		if (!response.ok) {
			const spotifyError = yield* Schema.decodeUnknown(ErrorSchema)(json).pipe(
				Effect.mapError(
					(cause) =>
						new SchemaDecodeError({
							message: "Failed to decode Spotify error response",
							cause,
						}),
				),
			);

			const { status, message } = spotifyError.error;
			switch (status) {
				case 400:
					return yield* new BadRequestError({ cause: message });
				case 401:
					return yield* new UnauthorizedError({ cause: message });
				case 403:
					return yield* new ForbiddenError({ cause: message });
				case 404:
					return yield* new NotFoundError({ cause: message });
				case 429: {
					const retryHeader = yield* Option.fromNullable(
						response.headers.get("Retry-After"),
					).pipe(
						Option.andThen((seconds) => {
							return Schema.decode(Schema.NumberFromString)(seconds);
						}),
						Effect.transposeOption,
						Effect.andThen(
							Option.getOrElse(() => {
								return 15;
							}),
						),
					);

					return yield* new RateLimitError({
						cause: message,
						retryAfter: Duration.seconds(retryHeader),
					});
				}
				default:
					return yield* new UnknownApiError({ cause: message });
			}
		}

		return yield* Schema.decodeUnknown(schema)(json).pipe(
			Effect.mapError(
				(cause) =>
					new SchemaDecodeError({
						message: "Failed to decode Spotify response to provided schema",
						cause,
					}),
			),
		);
	}).pipe(
		/*Effect.retry({
			schedule: Schedule.fromFunction((error) => {
				if (error._tag === "RateLimitError") {
					return Schedule.fromDelay(error.retryAfter);
				}

				return Schedule.once;
			}),
		}),*/
	);
}
