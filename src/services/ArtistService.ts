import {
  ArtistSchema,
  PageSchema,
  SimplifiedAlbumSchema,
  TrackSchema,
} from "../schemas.js";
import type { Artist, Page, SimplifiedAlbum, Track } from "../schemas.js";
import {
  type AlbumRetrievalOptions,
  type IEntity,
  makeRequest,
  type MarketOnlyOptions,
} from "./EntityService.js";
import { Effect, Data, Schema } from "effect";

class ArtistService
  extends Data.TaggedClass("ArtistService")
  implements IEntity<Artist>
{
  /**
   * Get Spotify catalog information for a single artist identified by their unique Spotify ID.
   *
   * @param {Object} params - The params object
   * @param {string} params.id - The Spotify ID of the artist
   * Example: `"0TnOYISbd1XYRBk9myaseg"`
   *
   * @returns {Promise<Artist>} An artist
   */
  get({ id }: { id: string }): Promise<Artist> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `artists/${encodeURIComponent(id)}`,
          ArtistSchema,
        );
      }),
    );
  }

  /**
   * Get Spotify catalog information for several artists based on their Spotify IDs.
   *
   * @param {Object} params - The params object
   * @param {string} params.ids - A comma-separated list of the Spotify IDs for the artists. Maximum: 50 IDs.
   * Example: `"2CIMQHirSU0MQqyYHq0eOx,57dN52uHvrHOxijzpIgu3E,1vCWHaC5f2uS3yhpwWbIA6"`
   *
   * @returns {Promise<Artist[]>} A set of artists
   */
  getMany({ ids }: { ids: string }): Promise<Artist[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        const encodedIds = ids
          .split(",")
          .map((id) => encodeURIComponent(id.trim()))
          .join(",");

        return yield* makeRequest(
          `artists?ids=${encodedIds}`,
          Schema.Array(ArtistSchema),
        );
      }),
    );
  }

  /**
   * Get Spotify catalog information about an artist's albums.
   *
   * @param {Object} params - The parameters object
   * @param {string} params.id - The Spotify ID of the artist.
   * Example: `"0TnOYISbd1XYRBk9myaseg"`
   * @param {AlbumRetrievalOptions} [params.options] - Optional filter parameters
   *
   * @returns {Promise<Page<SimplifiedAlbum>>} Pages of albums
   */
  getAlbums({
    id,
    options,
  }: {
    id: string;
    options?: AlbumRetrievalOptions;
  }): Promise<Page<SimplifiedAlbum>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `artists/${encodeURIComponent(id)}/albums`,
          PageSchema(SimplifiedAlbumSchema),
          options,
        );
      }),
    );
  }

  /**
   * Get Spotify catalog information about an artist's top tracks by country
   *
   * @param {Object} params - The parameters object
   * @param {string} params.id - The Spotify ID of the artist.
   * Example: `"0TnOYISbd1XYRBk9myaseg"`
   * @param {MarketOnlyOptions} [params.options] - Optional filter parameters
   *
   * @returns {Track[]} A set of tracks
   */
  getTopTracks({
    id,
    options,
  }: {
    id: string;
    options?: MarketOnlyOptions;
  }): Promise<Track[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `artists/${encodeURIComponent(id)}/top-tracks`,
          Schema.Array(TrackSchema),
          options,
        );
      }),
    );
  }
}
