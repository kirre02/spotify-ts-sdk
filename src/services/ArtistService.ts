import { type IEntity, makeRequest } from "./EntityService.js";
import type { Artist, Page, SimplifiedAlbum, Track } from "../types.js";
import { Data, Effect } from "effect";

class ArtistService
  extends Data.TaggedClass("ArtistService")<{ readonly apiKey: string }>
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
  async get(artistId: string): Promise<Artist> {
    Effect.log(`Requested artist with ID: ${artistId}`);
    return await Effect.runPromise(
      makeRequest<Artist>(`artists/${artistId}`, this.apiKey),
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
  async getMany(artistIds: string): Promise<Artist[]> {
    Effect.log(`Requested artists with IDs: ${artistIds}`);
    return await Effect.runPromise(
      makeRequest<Artist[]>(`artists?${artistIds}`, this.apiKey),
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
  async getAlbums(artistId: string): Promise<Page<SimplifiedAlbum>> {
    Effect.log(`Requested albums from artist with ID: ${artistId}`);
    return await Effect.runPromise(
      makeRequest<Page<SimplifiedAlbum>>(
        `artists/${artistId}/albums`,
        this.apiKey,
      ),
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
  async getTopTracks(artistId: string): Promise<Track[]> {
    Effect.log(`Requested top tracks for artist with ID: ${artistId}`);
    return await Effect.runPromise(
      makeRequest<Track[]>(`artists/${artistId}/top-tracks`, this.apiKey),
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
  async getRelatedArtists(artistId: string): Promise<Artist[]> {
    Effect.log(`Requested related artists to artist with ID: ${artistId}`);
    return await Effect.runPromise(
      makeRequest<Artist[]>(`artists/${artistId}/related-artists`, this.apiKey),
    );
  }
}
