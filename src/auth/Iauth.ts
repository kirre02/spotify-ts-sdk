import { Schema as S } from "effect"

export const AccessTokenSchema = S.Struct({
    token: S.String,
    expiresAt: S.Number,
})

export type AccessToken = S.Schema.Type<typeof AccessTokenSchema>

export const SpotifyRawTokenSchema = S.Struct({
  access_token: S.String,
  expires_in: S.Number,
});

/**
 * Represents an authentication strategy that can provide an access token.
 */
export interface IAuth {
    /**
     * Returns a valid access token, fetching or refreshing it as needed.
     */
    getAccessToken(): Promise<AccessToken>
}

