import {
  ArtistSchema,
  PageSchema,
  SimplifiedAlbumSchema,
  TrackSchema,
} from "../schemas.js";
import type { Artist, Page, SimplifiedAlbum, Track } from "../schemas.js";
import { type IEntity, makeRequest } from "./EntityService.js";
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
        return yield* makeRequest(`artists/${artistId}`, ArtistSchema);
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
        return yield* makeRequest(
          `artists?${artistIds}`,
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
   *
   * @returns {Promise<Page<SimplifiedAlbum>>} Pages of albums
   */
  getAlbums(artistId: string): Promise<Page<SimplifiedAlbum>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `artists/${artistId}/albums`,
          PageSchema(SimplifiedAlbumSchema),
        );
      }),
    );
  }

  /**
   * Get Spotify catalog information about an artist's top tracks by country
   *
   * @param {string} artistId - The Spotify ID of the artist.
   * Example: `"0TnOYISbd1XYRBk9myaseg"`
   *
   * @returns {Track[]} A set of tracks
   */
  getTopTracks(artistId: string): Promise<Track[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `artists/${artistId}/top-tracks`,
          Schema.Array(TrackSchema),
        );
      }),
    );
  }

  /**
   * Get Spotify catalog information about artists similar to a given artist.
   * Similarity is based on analysis of the Spotify community's listening history.
   *
   * @param {string} artistId - The Spotify ID of the artist.
   * Example: `"0TnOYISbd1XYRBk9myaseg"`
   *
   * @returns {Artist[]} A set of artists
   */
  getRelatedArtists(artistId: string): Promise<Artist[]> {
    return Effect.runPromise(
      makeRequest(
        `artists/${artistId}/related-artists`,
        Schema.Array(ArtistSchema),
      ),
    );
  }
}
