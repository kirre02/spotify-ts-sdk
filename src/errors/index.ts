import { Schema } from "effect";

export class NetworkError extends Schema.TaggedError<NetworkError>()(
	"NetworkError",
	{
		message: Schema.String,
		url: Schema.String,
		cause: Schema.optional(Schema.Unknown),
	},
) {}

export class JsonParseError extends Schema.TaggedError<JsonParseError>()(
	"JsonParseError",
	{
		message: Schema.String,
		cause: Schema.optional(Schema.Unknown),
	},
) {}

export class SchemaDecodeError extends Schema.TaggedError<SchemaDecodeError>()(
	"SchemaDecodeError",
	{
		message: Schema.String,
		cause: Schema.optional(Schema.Unknown),
	},
) {}

// Fetch response errors
export class BadRequestError extends Schema.TaggedError<BadRequestError>()(
	"BadRequestError",
	{
		cause: Schema.optional(Schema.Unknown),
	},
) {}

export class ForbiddenError extends Schema.TaggedError<ForbiddenError>()(
	"ForbiddenError",
	{
		cause: Schema.optional(Schema.Unknown),
	},
) {}

export class NotFoundError extends Schema.TaggedError<NotFoundError>()(
	"NotFoundError",
	{
		cause: Schema.optional(Schema.Unknown),
	},
) {}

export class RateLimitError extends Schema.TaggedError<RateLimitError>()(
	"RateLimitError",
	{
		cause: Schema.optional(Schema.Unknown),
		retryAfter: Schema.DurationFromSelf,
	},
) {}

export class UnauthorizedError extends Schema.TaggedError<UnauthorizedError>()(
	"UnauthorizedError",
	{
		cause: Schema.optional(Schema.Unknown),
	},
) {}

export class UnknownApiError extends Schema.TaggedError<UnknownApiError>()(
	"UnknownApiError",
	{
		cause: Schema.optional(Schema.Unknown),
	},
) {}
