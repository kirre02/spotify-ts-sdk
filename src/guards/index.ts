import { IllegalArgumentException } from "effect/Cause";

export function guardString(input: string, label: string) {
  if (input == null) throw new IllegalArgumentException(`${label} must not be null or undefined`);
  if (typeof input !== "string") throw new IllegalArgumentException(`${label} must be a string`);
  if (input.trim().length === 0) throw new IllegalArgumentException(`${label} must not be empty`);
}

export function guardArrays(input: unknown, label: string) {
  if (!Array.isArray(input)) throw new IllegalArgumentException(`${label} must be an array`);
  if (input.length === 0) throw new IllegalArgumentException(`${label} must not be empty`);
  if (new Set(input).size !== input.length)
    throw new IllegalArgumentException(`${label} must not contain duplicates`);
}

export function guardId(id: string, label: string) {
  guardString(id, label);
  if (id.startsWith("spotify:"))
    throw new IllegalArgumentException(`${label} must be a Spotify ID, not a URI`);
  if (id.includes("open.spotify.com"))
    throw new IllegalArgumentException(`${label} must be a SpotifyID, not a URL`);
  if (!/^[0-9A-Za-z]{22}$/.test(id.trim()))
    throw new IllegalArgumentException(`${label} must be a valid 22-character Spotify ID`);
}

export function guardIds(ids: string[], label: string, max: number) {
  guardArrays(ids, label);
  if (ids.length > max) throw new IllegalArgumentException(`${label} exceeds maximum of ${max}`);
  for (const [i, id] of ids.entries()) {
    guardId(id, `${label}[${i}]`);
  }
}

export function guardTimestampedIds(
  ids: {
    id: string;
    added_at: string;
  }[],
  label: string,
  max: number,
) {
  guardArrays(ids, label);
  if (ids.length > max) throw new IllegalArgumentException(`${label} exceeds maximum of ${max}`);
  for (const [i, id] of ids.entries()) {
    guardId(id.id, `${label}[${i}]`);
    if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/.test(id.added_at))
      throw new IllegalArgumentException(
        `${label}[${i}].added_at must be a valid ISO 8601 UTC timestamp`,
      );
  }
}

export function guardLimit(limit: number, max: number, label: string) {
  if (!Number.isInteger(limit))
    throw new IllegalArgumentException(`${label} Limit must be an integer`);
  if (limit < 1 || limit > max)
    throw new IllegalArgumentException(`${label} Limit must be between 1 and ${max}`);
}

export function guardOffset(offset: number, label: string) {
  if (!Number.isInteger(offset))
    throw new IllegalArgumentException(`${label} Offset must be an integer`);
  if (offset < 0) throw new IllegalArgumentException(`${label} Offset must not be negative`);
}

export function guardLocale(locale: string, label: string) {
  guardString(locale, `${label} Locale`);
  if (!/^[a-zA-Z]{2}_[a-zA-Z]{2}$/.test(locale.trim()))
    throw new IllegalArgumentException(`${label} Locale must be in the format "es_MX"`);
}

export function guardMarket(market: string, label: string) {
  guardString(market, `${label} Market`);
  if (!/^[A-Z]{2}$/.test(market.trim()))
    throw new IllegalArgumentException(
      `${label} Market must be a two letter code (ISO 3166-1 alpha 2)`,
    );
}

export function guardAdditionalTypes(input: string[], label: string) {
  guardArrays(input, label);
  if (input.some((index) => index.trim() !== "episode" && index.trim() !== "track"))
    throw new IllegalArgumentException(
      `${label} Additional types can only contain "episode" or "track"`,
    );
}

export function guardTimestamp(timestamp: number, label: string) {
  if (!Number.isInteger(timestamp))
    throw new IllegalArgumentException(`${label} Timestamp must be an integer`);
  if (timestamp < 0) throw new IllegalArgumentException(`${label} Timestamp can not be negative`);
}

export function guardFields(fields: string, label: string) {
  guardString(fields, `${label} Fields`);
}

export function guardContextUri(contextUri: string, label: string) {
  guardString(contextUri, label);
  if (!contextUri.trim().startsWith("spotify:"))
    throw new IllegalArgumentException(`${label} must be a Spotify URI (e.g. spotify:album:...)`);
  const type = contextUri.trim().split(":")[1];
  if (type !== "album" && type !== "artist" && type !== "playlist") {
    throw new IllegalArgumentException(`${label} must be one of album, artist or playlist`);
  }
}

export function guardSpotifyUri(uri: string, label: string) {
  guardString(uri, label);
  if (!uri.trim().startsWith("spotify:"))
    throw new IllegalArgumentException(`${label} must be a Spotify URI (e.g. spotify:track:...)`);
  if (!/^spotify:[a-z]+:[0-9A-Za-z]{22}$/.test(uri.trim()))
    throw new IllegalArgumentException(
      `${label} must be a valid Spotify URI in the format spotify:<type>:<id>`,
    );
}

export function guardUris(uris: string[], label: string) {
  guardArrays(uris, label);
  for (const [i, uri] of uris.entries()) {
    guardSpotifyUri(uri, `${label}[${i}]`);
  }
}
