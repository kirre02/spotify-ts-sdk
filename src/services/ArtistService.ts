import { IEntity } from "./EntityService.js";
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
    return await Effect.runPromise(
      Effect.tryPromise({
        try: async () => {
          const response = await fetch(
            `https://api.spotify.com/v1/artists/${artistId}`,
            {
              headers: { Authorization: `Bearer ${this.apiKey}` },
            },
          );

          if (!response.ok) {
            throw new Error(`ArtistService Error: ${response.statusText}`);
          }

          return (await response.json()) as Artist;
        },
        catch: (error) => error as Error,
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
  async getMany(artistIds: string): Promise<Artist[]> {
    return await Effect.runPromise(
      Effect.tryPromise({
        try: async () => {
          const response = await fetch(
            `https://api.spotify.com/v1/artists?${artistIds}`,
            {
              headers: { Authorization: `Bearer ${this.apiKey}` },
            },
          );

          if (!response.ok) {
            throw new Error(`ArtistService Error: ${response.statusText}`);
          }

          return (await response.json()) as Artist[];
        },
        catch: (error) => error as Error,
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
  async getAlbums(artistId: string): Promise<Page<SimplifiedAlbum>> {
    return await Effect.runPromise(
      Effect.tryPromise({
        try: async () => {
          const response = await fetch(
            `https://api.spotify.com/v1/artists/${artistId}/albums`,
            {
              headers: { Authorization: `Bearer ${this.apiKey}` },
            },
          );

          if (!response.ok) {
            throw new Error(`ArtistService Error: ${response.statusText}`);
          }

          return (await response.json()) as Page<SimplifiedAlbum>;
        },
        catch: (error) => error as Error,
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
  async getTopTracks(artistId: string): Promise<Track[]> {
    return await Effect.runPromise(
      Effect.tryPromise({
        try: async () => {
          const response = await fetch(
            `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
            {
              headers: { Authorization: `Bearer ${this.apiKey}` },
            },
          );

          if (!response.ok) {
            throw new Error(`ArtistService Error: ${response.statusText}`);
          }

          return (await response.json()) as Track[];
        },
        catch: (error) => error as Error,
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
  async getRelatedArtists(artistId: string): Promise<Artist[]> {
    return await Effect.runPromise(
      Effect.tryPromise({
        try: async () => {
          const response = await fetch(
            `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
            {
              headers: { Authorization: `Bearer ${this.apiKey}` },
            },
          );

          if (!response.ok) {
            throw new Error(`ArtistService Error: ${response.statusText}`);
          }

          return (await response.json()) as Artist[];
        },
        catch: (error) => error as Error,
      }),
    );
  }
}
