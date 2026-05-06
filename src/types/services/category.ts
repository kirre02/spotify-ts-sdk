import { imageSchema, PageSchema } from "@schemas/shared";
import { Schema } from "effect";

export const CategorySchema = Schema.Struct({
  href: Schema.String,
  icons: Schema.Array(imageSchema),
  id: Schema.String,
  name: Schema.String,
});

export type GetCategoryRequest = {
  /**
   * The Spotify category ID for the category.
   *
   * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
   */
  id: string;
};

export const GetCategoryResponseSchema = CategorySchema;
export type GetCategoryResponse = Schema.Schema.Type<typeof GetCategoryResponseSchema>;

export const GetSeveralCategoryResponseSchema = PageSchema(CategorySchema);
export type GetSeveralCategoryResponse = Schema.Schema.Type<
  typeof GetSeveralCategoryResponseSchema
>;
