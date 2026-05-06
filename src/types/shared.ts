import { Schema } from "effect";

export const ErrorSchema = Schema.Struct({
  error: Schema.Struct({
    status: Schema.Number,
    message: Schema.String,
  }),
});

export const copyrightSchema = Schema.Struct({
  text: Schema.optional(Schema.String),
  type: Schema.optional(Schema.Literal("C", "P")),
});

export const errorSchema = Schema.Struct({
  status: Schema.Number,
  message: Schema.String,
});

export const externalIdsSchema = Schema.Struct({
  isrc: Schema.optional(Schema.String),
  ean: Schema.optional(Schema.String),
  upc: Schema.optional(Schema.String),
});

export const externalUrlsSchema = Schema.Struct({
  spotify: Schema.optional(Schema.String),
});

export const imageSchema = Schema.Struct({
  url: Schema.String,
  height: Schema.NullOr(Schema.Number),
  width: Schema.NullOr(Schema.Number),
});

export const PageSchema = <T>(itemSchema: Schema.Schema<T>) =>
  Schema.Struct({
    href: Schema.String,
    limit: Schema.Number,
    next: Schema.NullOr(Schema.String),
    offset: Schema.Number,
    previous: Schema.NullOr(Schema.String),
    total: Schema.Number,
    items: Schema.Array(itemSchema),
  });

export const PagedSetSchema = <T>(itemSchema: Schema.Schema<T>) =>
  Schema.Struct({
    href: Schema.String,
    limit: Schema.Number,
    next: Schema.NullOr(Schema.String),
    cursors: Schema.Struct({
      after: Schema.optional(Schema.String),
      before: Schema.optional(Schema.String),
    }),
    total: Schema.Number,
    items: Schema.Array(itemSchema),
  });

export const restrictionSchema = Schema.Struct({
  reason: Schema.optional(Schema.Literal("market", "product", "explicit", "payment_required")),
});

export const SimplifiedArtistSchema = Schema.Struct({
  external_urls: Schema.optional(externalUrlsSchema),
  href: Schema.optional(Schema.String),
  id: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  type: Schema.optional(Schema.Literal("artist")),
  uri: Schema.optional(Schema.String),
});

export const SimplifiedAlbumSchema = Schema.Struct({
  album_type: Schema.Literal("album", "single", "compilation"),
  total_tracks: Schema.Number,
  external_urls: externalUrlsSchema,
  href: Schema.String,
  id: Schema.String,
  images: Schema.Array(imageSchema),
  name: Schema.String,
  release_date: Schema.String,
  release_date_precision: Schema.Literal("year", "month", "day"),
  restrictions: Schema.optional(restrictionSchema),
  type: Schema.Literal("album"),
  uri: Schema.String,
  artists: Schema.Array(SimplifiedArtistSchema),
});

export const SimplifiedShowSchema = Schema.Struct({
  copyrights: Schema.Array(copyrightSchema),
  description: Schema.String,
  html_description: Schema.String,
  explicit: Schema.Boolean,
  external_urls: externalUrlsSchema,
  href: Schema.String,
  id: Schema.String,
  images: Schema.Array(imageSchema),
  is_externally_hosted: Schema.Boolean,
  languages: Schema.Array(Schema.String),
  media_type: Schema.String,
  name: Schema.String,
  type: Schema.Literal("show"),
  uri: Schema.String,
  total_episodes: Schema.Number,
});
