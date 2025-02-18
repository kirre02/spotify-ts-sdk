import { Effect } from "effect";

export default interface ICache {
    get(key: string): Effect.Effect<String | undefined>
    set(key: string, value: string): Effect.Effect<void>
    remove(key: string): Effect.Effect<void>
}
