import { Data, Effect } from "effect"
import type ICache from "../cache/ICache"
import {
  generateRandomString,
  sha256,
  encodeBase64Url
} from "./pkceUtils"

/**
 * Configuration object for SpotifyPKCEAuth.
 * @typedef {Object} SpotifyAuthConfig
 * @property {string} clientId - Spotify client ID.
 * @property {string} redirectUri - Redirect URI registered with Spotify.
 * @property {string} scope - OAuth scopes requested.
 */
export interface SpotifyAuthConfig {
  clientId: string
  redirectUri: string
  scope: string
}

/**
 * Spotify OAuth 2.0 PKCE authentication handler.
 * 
 * Handles PKCE flow by generating code verifier & challenge,
 * creating authorization URLs, exchanging codes for tokens,
 * and caching tokens and verifiers.
 * 
 * Uses an injected cache for storing PKCE verifiers and tokens.
 * All methods return Effect-based asynchronous computations.
 */
export class SpotifyPKCEAuth extends Data.TaggedClass("withPKCE") {
  /**
   * @param {SpotifyAuthConfig} config - Spotify authentication configuration.
   * @param {ICache} cache - Cache instance for storing verifiers and tokens.
   */
  constructor(
    private config: SpotifyAuthConfig,
    private cache: ICache
  ) {
    super()
  }

  /**
   * Generates a PKCE code verifier and its corresponding challenge.
   * @returns {Effect.Effect<{ verifier: string; challenge: string }, Error>}
   * An Effect that resolves with the verifier and challenge pair.
   */
  generatePKCE(): Effect.Effect<{ verifier: string; challenge: string }, Error> {
    return generateRandomString().pipe(
      Effect.flatMap((verifier) =>
        sha256(verifier).pipe(
          Effect.flatMap((hash) =>
            encodeBase64Url(hash).pipe(
              Effect.map((challenge) => ({ verifier, challenge }))
            )
          )
        )
      )
    )
  }

  /**
   * Creates a Spotify authorization URL for the user, saving the verifier in cache.
   * @param {string} userId - Unique identifier for the user.
   * @returns {Effect.Effect<string, Error>} 
   * An Effect that resolves to the full Spotify authorization URL.
   */
  createAuthorizationUrl(userId: string): Effect.Effect<string, Error> {
    return this.generatePKCE().pipe(
      Effect.tap(({ verifier }) =>
        this.cache.set(`verifier:${userId}`, verifier)
      ),
      Effect.map(({ challenge }) => {
        const params = new URLSearchParams({
          client_id: this.config.clientId,
          response_type: "code",
          redirect_uri: this.config.redirectUri,
          code_challenge_method: "S256",
          code_challenge: challenge,
          scope: this.config.scope
        })
        return `https://accounts.spotify.com/authorize?${params.toString()}`
      })
    )
  }

  /**
   * Exchanges an authorization code for an access token.
   * @param {string} userId - Unique identifier for the user.
   * @param {string} code - Authorization code received from Spotify.
   * @returns {Effect.Effect<any, Error>} 
   * An Effect that resolves with the token response object.
   */
  exchangeCodeForToken(userId: string, code: string): Effect.Effect<any, Error> {
    return this.cache.get(`verifier:${userId}`).pipe(
      Effect.flatMap((verifier) =>
        verifier
          ? Effect.succeed(verifier)
          : Effect.fail(new Error("Missing PKCE verifier for user"))
      ),
      Effect.flatMap((verifier) => {
        const params = new URLSearchParams({
          client_id: this.config.clientId,
          grant_type: "authorization_code",
          code,
          redirect_uri: this.config.redirectUri,
          code_verifier: verifier
        })

        return Effect.tryPromise({
          try: async () => {
            const response = await fetch("https://accounts.spotify.com/api/token", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: params.toString()
            })
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`)
            }
            return response.json()
          },
          catch: (err) => new Error(`Token exchange failed: ${String(err)}`)
        }).pipe(
          Effect.tap(() => this.cache.remove(`verifier:${userId}`)),
          Effect.tap((tokenResponse) =>
            this.cache.set(`token:${userId}`, JSON.stringify(tokenResponse))
          )
        )
      })
    )
  }

  /**
   * Retrieves the stored access token for a user from the cache.
   * @param {string} userId - Unique identifier for the user.
   * @returns {Effect.Effect<any | undefined, Error>}
   * An Effect that resolves with the parsed token object or undefined if not found.
   */
  getStoredToken(userId: string): Effect.Effect<any | undefined, Error> {
    return this.cache.get(`token:${userId}`).pipe(
      Effect.flatMap((tokenStr) => {
        if (!tokenStr) return Effect.succeed(undefined)
        try {
          return Effect.succeed(JSON.parse(tokenStr))
        } catch {
          return Effect.fail(new Error("Invalid token format in cache"))
        }
      })
    )
  }
}
