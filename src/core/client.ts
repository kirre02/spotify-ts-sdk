import { Duration, Effect, Schema, Option, Schedule } from "effect";
import {
	type ApiError,
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
import { AuthService } from "auth";

// Use generic sceham for the schema param
// then get the types from infering

export function makeRequest<T, I, R>({
	method = "GET",
	route,
	schema,
	options,
	customHeaders = {},
	body,
}: {
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	route: string;
	schema: Schema.Schema<T, I, R>;
	options?: AllOptions;
	customHeaders?: Record<string, string>;
	body?: string;
}): Effect.Effect<T, ApiError, AuthService | R> {
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

	return Effect.gen(function* () {
		const authService = yield* AuthService;
		const token = yield* authService.getToken;

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
		Effect.tapError((error) => {
			if (error._tag === "RateLimitError") {
				return Effect.sleep(error.retryAfter);
			}
			return Effect.void;
		}),
		Effect.retry({
			while: (error) =>
				error._tag === "RateLimitError" ||
				error._tag === "UnauthorizedError" ||
				error._tag === "NetworkError",
			schedule: Schedule.union(
				Schedule.union(
					Schedule.recurs(3).pipe(
						Schedule.whileInput(
							(error: ApiError) => error._tag === "RateLimitError",
						),
					),
					Schedule.once.pipe(
						Schedule.whileInput(
							(error: ApiError) => error._tag === "UnauthorizedError",
						),
					),
				),
				Schedule.exponential(Duration.seconds(1), 2).pipe(
					Schedule.compose(Schedule.recurs(3)),
					Schedule.whileInput(
						(error: ApiError) => error._tag === "NetworkError",
					),
				),
			),
		}),
	);
}
