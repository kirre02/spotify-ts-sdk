# better-music

Fully type-safe music SDK for TypeScript built on [Effect TS](https://effect.website) under the hood.

> NOTE: This project is still in an early stage. Tests are missing and potential breaking bugs have not been discovered. Be careful and adopt in small pieces.

> FYI: The Spotify endpoints does not use the new API endpoints from February 2026. Some of the types from the same changes have been implemented however.

## Install

```sh
npm install better-music
```

Or with Bun / pnpm:

```sh
bun add better-music
pnpm add better-music
```

## Quick Start

```ts
import { BetterMusic } from "better-music";

const store = new Map<string, string>();

const client = BetterMusic.withClientCredentials({
  get: async (key) => store.get(key),
  set: async (key, value) => {
    store.set(key, value);
  },
});

const track = await client.track.get({ id: "4qDHt2ClApBBzDAvhNGWFd" });
console.log(track);
```

## Contents

- [Authorization](#authorization)
- [Stores](#stores)
- [Tokens](#tokens)
- [Response Types and Optional Fields](#response-types-and-optional-fields)
- [Error Handling and Retries](#error-handling-and-retries)
- [API Reference](#api-reference)
- [Future Plans](#future-plans)

## Authorization

better-music currently only supports Spotify and their client credentials flow as well as their PKCE flow.
The SDK reads credentials from environment variables. The keys the SDK looks for is:

- SPOTIFY_CLIENT_ID
- SPOTIFY_CLIENT_SECRET
- SPOTIFY_REDIRECT_URI

The user is not required to load in their environment variables using `dotenv` or other packages. Just make sure to have a `.env` file with the correct secrets

### Client Credentials

```ts
import { BetterMusic } from "better-music";

const store = new Map<string, string>();

const client = BetterMusic.withClientCredentials({
  get: async (key) => store.get(key),
  set: async (key, value) => {
    store.set(key, value);
  },
});

const track = await client.track.get({ id: "4qDHt2ClApBBzDAvhNGWFd" });
console.log(track);
```

### PKCE

```ts
import { BetterMusic } from "better-music";

const store = new Map<string, string>();

const adapter = {
  get: async (key: string) => store.get(key),
  set: async (key: string, value: string) => {
    store.set(key, value);
  },
  remove: async (key: string) => {
    store.delete(key);
  },
};

const sdk = BetterMusic.withPKCE(adapter, ["user-read-private"]);

// 1. Redirect the user to Spotify's authorization page
const url = await sdk.auth.getAuthorizationUrl();
console.log("Open this URL in your browser:\n", url);

// 2. After the user authorizes, Spotify redirects to your callback with a code and state.
//    Exchange them for tokens:
const token = await sdk.auth.exchangeCodeForTokens({ code, state });

// 3. Use the client
const track = await sdk.client.track.get({ id: "4qDHt2ClApBBzDAvhNGWFd" });
```

## Stores

The SDK exposes an interface to allow users to store their tokens & PKCE verifier where ever they want.
The examples only uses an in-memory object but can be extended to libraries such as Redis.

## Tokens

better-music automatically handles token refreshing in both client credentials & PKCE.
It checks on every request if the token has expired and if so fetches a new one or uses an existing refresh token (from PKCE) if available

## Response Types and Optional Fields

The types of better-music is built upon the [Spotify Web API docs](https://developer.spotify.com/documentation/web-api).
They put "Required" next to some of the request parameters and/or response fields. These are set as required in the types, while the others are set as optional.
This will cause some responses to potentially have optional chains of 3-4 fields

## Error Handling and Retries

better-music has built in error handling with typed errors from Effect's `Schema.TaggedError` function.
It also has retry logic for endpoint calls on certain response types

## API Reference

> NOTE: All available APIs are the non-deprecated endpoints before February 2026 changes

### Builder

| Method                                       | Auth Required | Description                                        |
| -------------------------------------------- | ------------- | -------------------------------------------------- |
| `BetterMusic.withClientCredentials(adapter)` | No            | Creates a client using the Client Credentials flow |
| `BetterMusic.withPKCE(adapter, scopes)`      | No            | Creates a PKCE auth object and client              |

### Auth

| Method                                            | Description                                                   |
| ------------------------------------------------- | ------------------------------------------------------------- |
| `sdk.auth.getAuthorizationUrl()`                  | Returns the Spotify authorization URL to redirect the user to |
| `sdk.auth.exchangeCodeForTokens({ code, state })` | Exchanges the callback code for access and refresh tokens     |

### Services

#### Album

| Method           | Scopes              |
| ---------------- | ------------------- |
| `Get`            | N/A                 |
| `GetMany`        | N/A                 |
| `GetTracks`      | N/A                 |
| `GetSaved`       | user-library-read   |
| `Save`           | user-library-modify |
| `Remove`         | user-library-modify |
| `CheckSaved`     | user-library-read   |
| `GetNewReleases` | N/A                 |

#### Artist

| Method         | Scopes |
| -------------- | ------ |
| `Get`          | N/A    |
| `GetMany`      | N/A    |
| `GetAlbums`    | N/A    |
| `GetTopTracks` | N/A    |

#### Audiobook

| Method        | Scopes              |
| ------------- | ------------------- |
| `Get`         | N/A                 |
| `GetMany`     | N/A                 |
| `GetChapters` | N/A                 |
| `GetSaved`    | user-library-read   |
| `Save`        | user-library-modify |
| `Remove`      | user-library-modify |
| `CheckSaved`  | user-library-read   |

#### Category

| Method    | Scopes |
| --------- | ------ |
| `Get`     | N/A    |
| `GetMany` | N/A    |

#### Chapter

| Method    | Scopes |
| --------- | ------ |
| `Get`     | N/A    |
| `GetMany` | N/A    |

#### Episode

| Method       | Scopes                                         |
| ------------ | ---------------------------------------------- |
| `Get`        | user-read-playback-position                    |
| `GetMany`    | user-read-playback-position                    |
| `GetSaved`   | user-library-read, user-read-playback-position |
| `Save`       | user-library-modify                            |
| `Remove`     | user-library-modify                            |
| `CheckSaved` | user-library-read                              |

#### Market

| Method   | Scopes |
| -------- | ------ |
| `GetAll` | N/A    |

#### Player

| Method                  | Scopes                                                |
| ----------------------- | ----------------------------------------------------- |
| `GetPlaybackState`      | user-read-playback-state                              |
| `TransferPlayback`      | user-modify-playback-state                            |
| `GetDevices`            | user-read-playback-state                              |
| `GetCurrentlyPlaying`   | user-read-currently-playing                           |
| `StartOrResumePlayback` | user-modify-playback-state                            |
| `PausePlayback`         | user-modify-playback-state                            |
| `SkipTonext`            | user-modify-playback-state                            |
| `SkipToPrevious`        | user-modify-playback-state                            |
| `SeekToPosition`        | user-modify-playback-state                            |
| `SeteRepeatMode`        | user-modify-playback-state                            |
| `SetPlaybackVolume`     | user-modify-playback-state                            |
| `TogglePlaybackShuffle` | user-modify-playback-state                            |
| `GetRecentlyPlayed`     | user-read-recently-played                             |
| `GetQueue`              | user-read-currently-playing, user-read-playback-state |
| `AddToPlaybackQueue`    | user-modify-playback-state                            |

#### Playlist

| Method                | Scopes                                                            |
| --------------------- | ----------------------------------------------------------------- |
| `Get`                 | N/A                                                               |
| `ChangeDetails`       | playlist-modify-public, playlist-modify-private                   |
| `GetItems`            | playlist-read-private                                             |
| `UpdateItems`         | playlist-modify-public, playlist-modify-private                   |
| `Add`                 | playlist-modify-public, playlist-modify-private                   |
| `Remove`              | playlist-modify-public, playlist-modify-private                   |
| `GetPlaylists`        | playlist-read-private                                             |
| `GetUsersPlaylists`   | playlist-read-private, playlist-read-collaborative                |
| `Create`              | playlist-modify-public, playlist-modify-private                   |
| `GetCoverImage`       | N/A                                                               |
| `AddCustomCoverImage` | ugc-image-upload, playlist-modify-public, playlist-modify-private |

#### Search

| Method  | Scopes |
| ------- | ------ |
| `Query` | N/A    |

#### Show

| Method        | Scopes                      |
| ------------- | --------------------------- |
| `Get`         | user-read-playback-position |
| `GetMany`     | N/A                         |
| `GetEpisodes` | user-read-playback-position |
| `GetSaved`    | user-library-read           |
| `Save`        | user-library-modify         |
| `Remove`      | user-library-modify         |
| `CheckSaved`  | user-library-read           |

#### Track

| Method       | Scopes              |
| ------------ | ------------------- |
| `Get`        | N/A                 |
| `GetMany`    | N/A                 |
| `GetSaved`   | user-library-read   |
| `Save`       | user-library-modify |
| `Remove`     | user-library-modify |
| `CheckSaved` | user-library-read   |

#### User

| Method                | Scopes                                          |
| --------------------- | ----------------------------------------------- |
| `GetCurrentUser`      | user-read-private, user-read-email              |
| `GetTopArtists`       | user-top-read                                   |
| `GetTopTracks`        | user-top-read                                   |
| `GetUser`             | N/A                                             |
| `FollowPlaylist`      | playlist-modify-public, playlist-modify-private |
| `UnfollowPlaylist`    | playlist-modify-public, playlist-modify-private |
| `GetFollowedArtists`  | user-follow-read                                |
| `FollowArtists`       | user-follow-modify                              |
| `FollowUsers`         | user-follow-modify                              |
| `UnfollowArtists`     | user-follow-modify                              |
| `UnfollowUsers`       | user-follow-modify                              |
| `IsFollowingArtists`  | user-follow-read                                |
| `IsFollowingPlaylist` | N/A                                             |

## Future Plans

The main goal is to potentially scale the SDK to support other music providers such as Apple Music.
I also want to try keep updating it, though I can't guarantee timely coverage of all API changes.

## License

MIT
