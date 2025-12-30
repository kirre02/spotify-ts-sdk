import { Effect } from "effect"

/**
 * Generates a random string of printable ASCII characters.
 */
export const generateRandomString = (
  length = 128
): Effect.Effect<string, never> =>
  Effect.sync(() => {
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array)
      .map((x) => String.fromCharCode(33 + (x % 94))) 
      .join("")
  })

/**
 * SHA-256 hashes the input string.
 */
export const sha256 = (input: string): Effect.Effect<Uint8Array, Error> =>
  Effect.tryPromise({
    try: async () => {
      const encoder = new TextEncoder()
      const data = encoder.encode(input)
      const hashBuffer = await crypto.subtle.digest("SHA-256", data)
      return new Uint8Array(hashBuffer)
    },
    catch: (e) => new Error(`SHA-256 hashing failed: ${String(e)}`)
  })

/**
 * Encodes a byte array to Base64URL.
 */
export const encodeBase64Url = (
  bytes: Uint8Array
): Effect.Effect<string, never> =>
  Effect.sync(() => {
    let str = ""
    for (const byte of bytes) {
      str += String.fromCharCode(byte)
    }
    const base64 = btoa(str)
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
  })
