export type GetTrackRequest = {
	/**
	 * The Spotify ID for the track
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export type GetSeveralTrackRequest = {
	/**
	 * A list of the Spotify IDs for the tracks. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type SaveTrackRequest = {
	/**
	 * A list of the Spotify IDs for the tracks. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type RemoveTrackRequest = {
	/**
	 * A list of the Spotify IDs for the tracks. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type CheckSavedTrackRequest = {
	/**
	 * A list of the Spotify IDs for the tracks. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};
