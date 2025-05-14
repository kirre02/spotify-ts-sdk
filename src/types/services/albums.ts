export type GetAlbumRequest = {
	/**
	 * The Spotify ID of the album
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export type GetSeveralAlbumRequest = {
	/**
	 * A list of the Spotify IDs for the albums. Maximum: 20 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type GetAlbumTracksRequest = {
	/**
	 * The Spotify ID of the album.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export type SaveAlbumRequest = {
	/**
	 * A list of the Spotify IDs for the albums. Maximum: 20 IDs
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type RemoveAlbumRequest = {
	/**
	 * A list of the Spotify IDs for the albums. Maximum: 20 IDs
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type CheckSavedAlbumRequest = {
	/**
	 * A list of the Spotify IDs for the albums. Maximum: 20 IDs
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};
