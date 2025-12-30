import { Effect } from "effect"
import type ICache from "./ICache"

export class MemoryCache implements ICache {
  private store = new Map<string, string>()

  get(key: string): Effect.Effect<string | undefined> {
    return Effect.sync(() => this.store.get(key))
  }

  set(key: string, value: string): Effect.Effect<void> {
    return Effect.sync(() => {
      this.store.set(key, value)
    })
  }

  remove(key: string): Effect.Effect<void> {
    return Effect.sync(() => {
      this.store.delete(key)
    })
  }
}