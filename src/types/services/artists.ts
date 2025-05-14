export type GetArtistRequest = {
	/**
	 * The Spotify ID of the artist.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export type GetSeveralArtistRequest = {
	/**
	 * A list of the Spotify IDs for the artists. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type GetArtistAlbumRequest = {
	/**
	 * The Spotify ID of the artist.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export type GetArtistTopTracksRequest = {
	/**
	 * The Spotify ID of the artist.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};
