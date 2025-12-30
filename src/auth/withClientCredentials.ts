import { Effect, Data, Schema } from "effect"
import {
    type IAuth,
    type AccessToken,
    AccessTokenSchema,
    SpotifyRawTokenSchema
} from "./Iauth"
import { FetchError, JsonError } from "../errors"
import type ICache from "../cache/ICache"

/**
 * Spotify Client Credentials authentication strategy.
 * 
 * Automatically handles token caching and refreshing.
 */
export default class withClientCredentials
    extends Data.TaggedClass("withClientCredentials")
    implements IAuth {

    private static readonly cacheKey =
        "spotify-sdk:ClientCredentials:accessToken"

    /**
     * @param cache - Cache instance for storing tokens.
     * @param clientId - Spotify client ID.
     * @param clientSecret - Spotify client secret.
     * @param scopes - Optional OAuth scopes.
     */
    constructor(
        private readonly cache: ICache,
        private readonly clientId: string,
        private readonly clientSecret: string,
        private readonly scopes: string[] = []
    ) {
        super()
    }

    /**
     * Returns a valid access token, fetching and caching if necessary.
     */
    public getAccessToken(): Promise<AccessToken> {
        return Effect.runPromise(
            this.getCachedToken().pipe(
                Effect.flatMap((cached) =>
                    cached && !this.isExpired(cached)
                        ? Effect.succeed(cached)
                        : this.fetchAndCacheToken()
                )
            )
        )
    }

    // ──────────────────────────────────────────────────────────────
    // Private Helpers
    // ──────────────────────────────────────────────────────────────

    /**
     * Attempts to retrieve and decode a cached access token.
     */
    private getCachedToken(): Effect.Effect<AccessToken | null, never> {
        return this.cache.get(withClientCredentials.cacheKey).pipe(
            Effect.flatMap((rawToken) =>
                rawToken
                    ? Schema.decode(AccessTokenSchema)(JSON.parse(rawToken))
                    : Effect.succeed(null)
            ),
            Effect.catchAll(() => Effect.succeed(null)) // fallback if decode fails
        )
    }

    /**
     * Fetches a new access token and caches it with its expiration.
     */
    private fetchAndCacheToken(): Effect.Effect<AccessToken, Error> {
        return this.fetchNewToken().pipe(
            Effect.flatMap((token) =>
                this.cache
                    .set(
                        withClientCredentials.cacheKey,
                        JSON.stringify(token),
                    )
                    .pipe(Effect.as(token))
            )
        )
    }

    /**
     * Fetches a new access token from Spotify API.
     */
    private fetchNewToken(): Effect.Effect<AccessToken, Error> {
        const url = "https://accounts.spotify.com/api/token"
        const body = new URLSearchParams({
            grant_type: "client_credentials",
            scope: this.scopes.join(" ")
        }).toString()

        return Effect.tryPromise({
            try: () =>
                fetch(url, {
                    method: "POST",
                    headers: {
                        Authorization: `Basic ${Buffer.from(
                            `${this.clientId}:${this.clientSecret}`
                        ).toString("base64")}`,
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body
                }),
            catch: () => new FetchError()
        }).pipe(
            Effect.flatMap((response) => {
                if (!response.ok) {
                    return Effect.fail(
                        new Error(
                            `Spotify token API error: ${response.status} ${response.statusText}`
                        )
                    )
                }
                return Effect.tryPromise({
                    try: () => response.json(),
                    catch: () => new JsonError()
                })
            }),
            Effect.flatMap((data) =>
                // @ts-ignore
                Schema.decode(SpotifyRawTokenSchema)(data).pipe(
                    Effect.flatMap(({ access_token, expires_in }) => {
                        const token: AccessToken = {
                            token: access_token,
                            expiresAt: Date.now() + expires_in * 1000,
                        };
                        return Effect.succeed(token);
                    }),
                    Effect.catchAll(() =>
                        Effect.fail(new Error("Invalid token response shape"))
                    )
                )
            )
        )
    }


    /**
     * Checks if an access token is expired.
     */
    private isExpired(token: AccessToken): boolean {
        return Date.now() >= token.expiresAt - 60 * 1000 // refresh 60s before expiry
    }
}
