import { Data, Effect, Schema } from "effect";
import { type IEntity, makeRequest } from "./EntityService";
import type { Album, Page, SimplifiedAlbum, Track } from "../schemas";
import {
  AlbumSchema,
  PageSchema,
  SimplifiedAlbumSchema,
  TrackSchema,
} from "../schemas";

class AlbumService
  extends Data.TaggedClass("AlbumService")
  implements IEntity<Album>
{
  /**
   * Get Spotify catalog information for a single album
   *
   * @param {string} albumId - The Spotify ID of the album
   * Example: `"4aawyAB9vmqN3uQ7FjRGTy"`
   *
   * @returns {Promise<Album>} An album
   */
  get(albumId: string): Promise<Album> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(`albums/${albumId}`, AlbumSchema);
      }),
    );
  }

  /**
   * Get Spotify catalog information for multiple albums identified by their Spotify IDs
   *
   * @param {string} albumIds - A comma-separated list of the Spotify IDs for the albums. Maximum: 20 IDs
   * Example: `"382ObEPsp2rxGrnsizN5TX,1A2GTWGtFfWp7KSQTwWOyo,2noRn2Aes5aoNVsU6iWThc"`
   *
   * @returns {Promise<Album[]>} A set of albums
   */
  getMany(albumIds: string): Promise<Album[]> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `albums?${albumIds}`,
          Schema.Array(AlbumSchema),
        );
      }),
    );
  }

  /**
   * Get Spotify catalog information about an album’s tracks.
   *
   * @param {string} albumId - The Spotify ID of the album.
   * Example: `"4aawyAB9vmqN3uQ7FjRGTy"`
   *
   * @returns {Promise<Page<Track>>} Pages of tracks
   */
  getTracks(albumId: string): Promise<Page<Track>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `albums/${albumId}/tracks`,
          PageSchema(TrackSchema),
        );
      }),
    );
  }

  /**
   * Get a list of new album releases featured in Spotify (shown, for example, on a Spotify player’s “Browse” tab).
   *
   * @returns {Promise<Page<SimplifiedAlbum>>}
   */
  getNewReleases(): Promise<Page<SimplifiedAlbum>> {
    return Effect.runPromise(
      Effect.gen(function* () {
        return yield* makeRequest(
          `browse/new-releases`,
          PageSchema(SimplifiedAlbumSchema),
        );
      }),
    );
  }
}
