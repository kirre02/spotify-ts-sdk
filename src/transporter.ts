import { Duration, Effect, Schema, Schedule } from "effect";
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
} from "@errors";
import type { AllOptions } from "@schemas/options";
import { ErrorSchema } from "@schemas/shared";
import { AuthService } from "@auth/index";

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
	body?: unknown;
}): Effect.Effect<T, ApiError, AuthService | R> {
	const baseUrl = "https://api.spotify.com/v1/";
	const url = new URL(route.replace(/^\/+/, ""), baseUrl);

	if (options) {
		for (const [key, value] of Object.entries(options)) {
			if (value == null) continue;
			const serialized = Array.isArray(value)
				? value.map((x: string) => x.trim()).join(encodeURIComponent(","))
				: String(value);
			url.searchParams.append(key, serialized);
		}
	}

	return Effect.gen(function* () {
		const authService = yield* AuthService;
		const token = yield* authService.getToken;

		const response = yield* Effect.tryPromise({
			try: () =>
				fetch(url.toString(), {
					method,
					headers: {
						Authorization: `Bearer ${token}`,
						...(body != null && !customHeaders["Content-Type"]
							? { "Content-Type": "application/json" }
							: {}),
						...customHeaders,
					},
					body: body != null ? JSON.stringify(body) : undefined,
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
					return yield* Effect.fail(new BadRequestError({ cause: message }));
				case 401:
					return yield* Effect.fail(new UnauthorizedError({ cause: message }));
				case 403:
					return yield* Effect.fail(new ForbiddenError({ cause: message }));
				case 404:
					return yield* Effect.fail(new NotFoundError({ cause: message }));
				case 429: {
					const retryAfterHeader = response.headers.get("Retry-After");
					const retryHeader =
						retryAfterHeader !== null ? Number(retryAfterHeader) || 15 : 15;

					return yield* Effect.fail(
						new RateLimitError({
							cause: message,
							retryAfter: Duration.seconds(retryHeader),
						}),
					);
				}
				default:
					return yield* Effect.fail(new UnknownApiError({ cause: message }));
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
			if (error._tag === "RateLimitError")
				return Effect.sleep(error.retryAfter);
			return Effect.void;
		}),
		Effect.retry({
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
					Schedule.intersect(Schedule.recurs(3)),
					Schedule.whileInput(
						(error: ApiError) => error._tag === "NetworkError",
					),
				),
			),
		}),
	);
}
