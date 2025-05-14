export type GetChapterRequest = {
	/**
	 * The Spotify ID for the chapter
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export type GetSeveralChapterRequest = {
	/**
	 * A list of the Spotify IDs of the chapters. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};
