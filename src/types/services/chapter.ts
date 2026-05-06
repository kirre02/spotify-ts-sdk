import { SimplifiedAudiobookSchema } from "@schemas/services/audiobook";
import { externalUrlsSchema, imageSchema, restrictionSchema } from "@schemas/shared";
import { Schema } from "effect";

export const SimplifiedChapterSchema = Schema.Struct({
  chapter_number: Schema.Number,
  description: Schema.String,
  html_description: Schema.String,
  duration_ms: Schema.Number,
  explicit: Schema.Boolean,
  external_urls: externalUrlsSchema,
  href: Schema.String,
  id: Schema.String,
  images: Schema.Array(imageSchema),
  is_playable: Schema.optional(Schema.Boolean),
  languages: Schema.Array(Schema.String),
  name: Schema.String,
  release_date: Schema.String,
  release_date_precision: Schema.Literal("year", "month", "day"),
  resume_point: Schema.optional(
    Schema.Struct({
      fully_played: Schema.optional(Schema.Boolean),
      resume_position_ms: Schema.optional(Schema.Number),
    }),
  ),
  type: Schema.Literal("chapter"),
  uri: Schema.String,
  restrictions: Schema.optional(restrictionSchema),
});

export const ChapterSchema = Schema.Struct({
  ...SimplifiedChapterSchema.fields,
  audiobook: Schema.suspend(() => SimplifiedAudiobookSchema),
});

export type GetChapterRequest = {
  /**
   * The Spotify ID for the chapter
   *
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
   */
  id: string;
};

export const GetChapterResponseSchema = ChapterSchema;
export type GetChapterResponse = Schema.Schema.Type<typeof GetChapterResponseSchema>;

export type GetSeveralChapterRequest = {
  /**
   * A list of the Spotify IDs of the chapters. Maximum: 50 IDs.
   *
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
   */
  ids: string[];
};

export const GetSeveralChapterResponseSchema = Schema.Struct({
  chapters: Schema.Array(Schema.NullOr(ChapterSchema)),
});
export type GetSeveralChapterResponse = Schema.Schema.Type<typeof GetSeveralChapterResponseSchema>;
