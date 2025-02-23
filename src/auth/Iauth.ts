import { Schema as S } from "effect"

export const AccessTokenSchema = S.Struct({
    token: S.String,
    expiresAt: S.Number,
})

export type AccessToken = S.Schema.Type<typeof AccessTokenSchema>

export interface IAuth {
    getOrCreateAccessToken(): Promise<AccessToken>;
    getAccessToken(): Promise<AccessToken | null>;
    removeAccessToken(): void;
}

