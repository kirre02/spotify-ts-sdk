import { Effect } from "effect";

export default interface ICache {
    get(key: string): Effect.Effect<string | undefined>
    set(key: string, value: string): Effect.Effect<void>
    remove(key: string): Effect.Effect<void>
}