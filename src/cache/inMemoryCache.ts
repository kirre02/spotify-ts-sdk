import { Data, Effect } from "effect";
import ICache from "./IChace.js";

export default class InMemoryCache extends Data.TaggedClass("InMemoryCache") implements ICache {
    private cache = new Map<string, string>()

    get(key: string): Effect.Effect<string | undefined> {
        const value = this.cache.get(key)
        return Effect.succeed(value)
    }

    set(key: string, value: string): Effect.Effect<void> {
        return Effect.succeed(this.cache.set(key, value))
    }

    remove(key: string): Effect.Effect<void> {
        return Effect.succeed(this.cache.delete(key))
    }
}
