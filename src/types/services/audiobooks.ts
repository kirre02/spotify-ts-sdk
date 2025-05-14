export type GetAudiobookRequest = {
	/**
	 * The Spotify ID for the audiobook.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export type GetSeveralAudiobookRequest = {
	/**
	 * A list of the Spotify IDs for the audiobooks. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type GetAudiobookChapterRequest = {
	/**
	 * The Spotify ID for the audiobook.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export type SaveAudiobookRequest = {
	/**
	 * A list of the Spotify IDs of the audiobooks. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type RemoveAudiobookRequest = {
	/**
	 * A list of the Spotify IDs of the audiobooks. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type CheckSavedAudiobookRequest = {
	/**
	 * A list of the Spotify IDs for the audiobooks. Maximum: 50 IDs
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};
