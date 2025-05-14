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
				if (typeof value === "object") {
					value = value
						.map((x: string) => x.trim())
						.join(encodeURIComponent(","));
				}

				url.searchParams.append(key, String(value));
			}
		});
	}

	const headers = {
		Authorization: `Bearer ${Config.redacted("SPOTIFY_API_KEY")}`,
		...customHeaders,
	};

	return Effect.gen(function* () {
		const response = yield* Effect.tryPromise({
			try: () =>
				fetch(url.toString(), {
					method,
					headers,
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
		Effect.retry({
			schedule: Schedule.fromFunction((error) => {
				if (error._tag === "RateLimitError") {
					return Schedule.fromDelay(error.retryAfter);
				}

				return Schedule.once;
			}),
		}),
	);
}
