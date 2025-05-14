export type GetEpisodeRequest = {
	/**
	 * The Spotify ID for the episode.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export type GetSeveralEpisodeRequest = {
	/**
	 * A list of the Spotify IDs for the episodes. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};
