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
   * @param {string} artistId - The Spotify ID of the artist
   * Example: `"0TnOYISbd1XYRBk9myaseg"`
   *
   * @returns {Promise<Artist>} An artist
   */
  get(artistId: string): Promise<Artist> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `artists/${encodeURIComponent(artistId)}`,
          ArtistSchema,
        );
      }),
    );
  }

  /**
   * Get Spotify catalog information for several artists based on their Spotify IDs.
   *
   * @param {string} artistIds - A comma-separated list of the Spotify IDs for the artists. Maximum: 50 IDs.
   * Example: `"2CIMQHirSU0MQqyYHq0eOx,57dN52uHvrHOxijzpIgu3E,1vCWHaC5f2uS3yhpwWbIA6"`
   *
   * @returns {Promise<Artist[]>} A set of artists
   */
  getMany(artistIds: string): Promise<Artist[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        const encodedIds = artistIds
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
   * @param {string} artistId - The Spotify ID of the artist.
   * Example: `"0TnOYISbd1XYRBk9myaseg"`
   * @param {AlbumRetrievalOptions} [options] - Optional filter parameters
   *
   * @returns {Promise<Page<SimplifiedAlbum>>} Pages of albums
   */
  getAlbums(
    artistId: string,
    options?: AlbumRetrievalOptions,
  ): Promise<Page<SimplifiedAlbum>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `artists/${encodeURIComponent(artistId)}/albums`,
          PageSchema(SimplifiedAlbumSchema),
          options,
        );
      }),
    );
  }

  /**
   * Get Spotify catalog information about an artist's top tracks by country
   *
   * @param {string} artistId - The Spotify ID of the artist.
   * Example: `"0TnOYISbd1XYRBk9myaseg"`
   * @param {MarketOnlyOptions} [options] - Optional filter parameters
   *
   * @returns {Track[]} A set of tracks
   */
  getTopTracks(
    artistId: string,
    options?: MarketOnlyOptions,
  ): Promise<Track[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `artists/${encodeURIComponent(artistId)}/top-tracks`,
          Schema.Array(TrackSchema),
          options,
        );
      }),
    );
  }
}
