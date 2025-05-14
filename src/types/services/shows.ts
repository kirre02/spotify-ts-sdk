export type GetShowRequest = {
	/**
	 * The Spotify ID for the show
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export type GetSeveralShowRequest = {
	/**
	 * A list of the Spotify IDs for the shows. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type GetShowEpisodeRequest = {
	/**
	 * The Spotify ID for the show
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export type SaveShowRequest = {
	/**
	 * A list of the Spotify IDs for the shows. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type RemoveShowRequest = {
	/**
	 * A list of the Spotify IDs for the shows. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type CheckSavedShowRequest = {
	/**
	 * A list of the Spotify IDs for the shows. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};
