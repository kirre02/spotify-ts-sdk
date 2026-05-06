import { SimplifiedChapterSchema } from "@schemas/services/chapter";
import { copyrightSchema, externalUrlsSchema, imageSchema, PageSchema } from "@schemas/shared";
import { Schema } from "effect";

export const SimplifiedAudiobookSchema = Schema.Struct({
  authors: Schema.Array(
    Schema.Struct({
      name: Schema.String,
    }),
  ),
  copyrights: Schema.Array(copyrightSchema),
  description: Schema.String,
  html_description: Schema.String,
  edition: Schema.optional(Schema.String),
  explicit: Schema.Boolean,
  external_urls: externalUrlsSchema,
  href: Schema.String,
  id: Schema.String,
  images: Schema.Array(imageSchema),
  languages: Schema.Array(Schema.String),
  media_type: Schema.String,
  name: Schema.String,
  narrators: Schema.Array(Schema.Struct({ name: Schema.String })),
  type: Schema.Literal("audiobook"),
  uri: Schema.String,
  total_chapters: Schema.Number,
});

export const AudioBookSchema = Schema.Struct({
  ...SimplifiedAudiobookSchema.fields,
  chapters: PageSchema(SimplifiedChapterSchema),
});

export type GetAudiobookRequest = {
  /**
   * The Spotify ID for the audiobook.
   *
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
   */
  id: string;
};

export const GetAudiobookResponseSchema = AudioBookSchema;
export type GetAudiobookResponse = Schema.Schema.Type<typeof GetAudiobookResponseSchema>;

export type GetSeveralAudiobookRequest = {
  /**
   * A list of the Spotify IDs for the audiobooks. Maximum: 50 IDs.
   *
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
   */
  ids: string[];
};

export const GetSeveralAudiobookResponseSchema = Schema.Struct({
  audiobooks: Schema.Array(Schema.NullOr(AudioBookSchema)),
});
export type GetSeveralAudiobookResponse = Schema.Schema.Type<
  typeof GetSeveralAudiobookResponseSchema
>;

export type GetAudiobookChapterRequest = {
  /**
   * The Spotify ID for the audiobook.
   *
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
   */
  id: string;
};

export const GetAudiobookChapterResponseSchema = PageSchema(SimplifiedChapterSchema);
export type GetAudiobookChapterResponse = Schema.Schema.Type<
  typeof GetAudiobookChapterResponseSchema
>;

export const GetSavedAudiobookResponseSchema = PageSchema(SimplifiedAudiobookSchema);
export type GetSavedAudiobookResponse = Schema.Schema.Type<typeof GetSavedAudiobookResponseSchema>;

export type SaveAudiobookRequest = {
  /**
   * A list of the Spotify IDs of the audiobooks. Maximum: 50 IDs.
   *
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
   */
  ids: string[];
};

export type RemoveAudiobookRequest = {
  /**
   * A list of the Spotify IDs of the audiobooks. Maximum: 50 IDs.
   *
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
   */
  ids: string[];
};

export type CheckSavedAudiobookRequest = {
  /**
   * A list of the Spotify IDs for the audiobooks. Maximum: 50 IDs
   *
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
   */
  ids: string[];
};
