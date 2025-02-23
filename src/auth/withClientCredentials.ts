import { Effect, Data, Schema } from "effect";
import type ICache from "../cache/IChace.js";
import {
    type IAuth,
    type AccessToken,
    AccessTokenSchema
} from "./Iauth.js";
import {FetchError, JsonError} from "../errors";

/**
 * @class withClientCredentials
 * @extends Data.TaggedClass
 * @implements IAuth
 *
 * A service for handling OAuth token management, including caching and fetching new access tokens.
 */
export default class withClientCredentials
    extends Data.TaggedClass("withClientCredentials")
    implements IAuth {

    /**
     * @param {ICache} cache - Cache instance for storing tokens.
     * @param {string} clientId - The client ID for authentication.
     * @param {string} clientSecret - The client secret for authentication.
     */
    constructor(
        private cache: ICache,
        private clientId: string,
        private clientSecret: string,
    ) {
        super();
    }

    /**
     * Retrieves an access token from the cache or fetches a new one if none exists.
     * 
     * @returns {Promise<AccessToken>} A promise that resolves with an access token.
     */
    getOrCreateAccessToken(): Promise<AccessToken> {
        const self = this;

        return Effect.runPromise(
            Effect.gen(function*() {
                const cachedToken = yield* self.cache.get(self.clientId);

                if (cachedToken) {
                    return yield* Schema.decode(AccessTokenSchema)({
                        token: cachedToken,
                        expiresAt: Date.now() + 3600 * 1000,
                    });
                }

                const newToken = yield* self.fetchNewToken();

                yield* self.cache.set(self.clientId, newToken.token);

                return newToken;
            })
        );
    }

    /**
     * Retrieves an access token from the cache.
     * 
     * @returns {Promise<AccessToken | null>} A promise that resolves with the cached access token or null if not found.
     */
    getAccessToken(): Promise<AccessToken | null> {
        const self = this;

        return Effect.runPromise(
            Effect.gen(function*() {
                const cachedToken = yield* self.cache.get(self.clientId);

                if (!cachedToken) return null;

                return yield* Schema.decode(AccessTokenSchema)({
                    token: cachedToken,
                    expiresAt: Date.now() + 3600 * 1000,
                });
            })
        );
    }

    /**
     * Removes the access token from the cache.
     */
    removeAccessToken(): void {
        this.cache.remove(this.clientId);
    }

    /**
     * Fetches a new access token from the authentication server.
     * 
     * @private
     * @returns {Effect.Effect<string>} An Effect that resolves with a new access token.
     */
    private fetchNewToken() {
        const { clientId, clientSecret } = this;

        return Effect.gen(function*() {
            const url = "https://accounts.spotify.com/api/token";
            const params = new URLSearchParams();
            params.append("grant_type", "client_credentials");

            const response = yield* Effect.tryPromise({
                try: () =>
                    fetch(url, {
                        method: "POST",
                        headers: {
                            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: params.toString(),
                    }),
                catch: () => new FetchError(),
            });

            const data = yield* Effect.tryPromise({
                try: () => response.json(),
                catch: () => new JsonError(),
            });

            if (!data.access_token) {
                return yield* Effect.fail(new Error("Invalid token response"));
            }

            return data.access_token;
        });
    }
}

