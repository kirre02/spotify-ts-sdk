export type GetTopItemsRequest = {
	/**
	 * The type of entity to return
	 */
	type: "artists" | "tracks";
};

export type GetUserProfileRequest = {
	/**
	 * The user's Spotify user ID
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export type UserFollowPlaylistRequest = {
	/**
	 * The Spotify ID of the playlist
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
	/**
	 * If playlist will be included in user's public playlists (added to profile)
	 *
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/playlists|Working with Playlists}
	 */
	isPublic?: boolean;
};

export type UserUnfollowPlaylistRequest = {
	/**
	 * The Spotify ID of the playlist
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};

export type GetFollowedArtistRequest = {
	/**
	 * The ID type
	 *
	 * @remarks
	 * Currently only artist is supported
	 */
	type: "artist";
};

export type UserFollowRequest = {
	/**
	 * The ID type
	 */
	type: "artist" | "user";
	/**
	 * A list of the artist or the user Spotify IDs. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type UserUnfollowRequest = {
	/**
	 * The ID type
	 */
	type: "artist" | "user";
	/**
	 * A list of the artist or the user Spotify IDs. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type CheckUserFollowRequest = {
	/**
	 * The ID type
	 */
	type: "artist" | "user";
	/**
	 * A list of the artist or the user Spotify IDs. Maximum: 50 IDs.
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	ids: string[];
};

export type CheckUserFollowPlaylistRequest = {
	/**
	 * The Spotify ID of the playlist
	 * @see {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify IDs}
	 */
	id: string;
};
