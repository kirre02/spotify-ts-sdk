export type SearchRequest = {
	/**
	 * Your search query
	 * @remarks
	 * You can narrow down your search using field filters. The available filters are album, artist, track, year, upc, tag:hipster, tag:new, isrc, and genre. Each field filter only applies to certain result types.
	 *
	 * The artist and year filters can be used while searching albums, artists and tracks. You can filter on a single year or a range (e.g. 1955-1960).
	 * The album filter can be used while searching albums and tracks.
	 * The genre filter can be used while searching artists and tracks.
	 * The isrc and track filters can be used while searching tracks.
	 * The upc, tag:new and tag:hipster filters can only be used while searching albums.
	 * The tag:new filter will return albums released in the past two weeks
	 * The tag:hipster can be used to return only albums with the lowest 10% popularity.
	 */
	query: string;
	/**
	 * A list of item types to search across. Search results include hits from all the specified item types.
	 */
	types: (
		| "album"
		| "artist"
		| "playlist"
		| "track"
		| "show"
		| "episode"
		| "audiobook"
	)[];
};
