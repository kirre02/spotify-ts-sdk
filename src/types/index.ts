import {
	ActionsSchema,
	AddedBySchema,
	AlbumBaseSchema,
	AlbumSchema,
	AlbumTrackSchema,
	ArtistSchema,
	AudioAnalysisSchema,
	AudioFeaturesSchema,
	AudiobookSchema,
	AuthorSchema,
	BarSchema,
	BeatSchema,
	CategorySchema,
	ChapterSchema,
	ContextSchema,
	CopyrightSchema,
	DeviceSchema,
	EpisodeSchema,
	ErrorSchema,
	ExternalIdsSchema,
	ExternalUrlsSchema,
	FeaturedPlaylistsSchema,
	FollowedArtistSchema,
	FollowersSchema,
	ImageSchema,
	LinkedFromSchema,
	MetaSchema,
	NarratorSchema,
	NewReleasesSchema,
	PageSchema,
	PlayHistorySchema,
	PlaybackStateSchema,
	PlaylistBaseSchema,
	PlaylistSchema,
	PlaylistTrackSchema,
	QueueSchema,
	RecentlyPlayedTracksSchema,
	RecommendationSeedSchema,
	RecommendationsResponseSchema,
	RestrictionsSchema,
	ResumePointSchema,
	SavedAlbumSchema,
	SavedEpisodeSchema,
	SavedShowSchema,
	SavedTrackSchema,
	SearchResultsMapSchema,
	SectionSchema,
	SegmentSchema,
	ShowSchema,
	SimplifiedAlbumSchema,
	SimplifiedArtistSchema,
	SimplifiedAudiobookSchema,
	SimplifiedChapterSchema,
	SimplifiedEpisodeSchema,
	SimplifiedPlaylistSchema,
	SimplifiedShowSchema,
	SimplifiedTrackSchema,
	SnapshotReferenceSchema,
	TatumSchema,
	TrackAnalysisSchema,
	TrackItemSchema,
	TrackReferenceSchema,
	TrackSchema,
	UserProfileSchema,
	UserReferenceSchema,
	UserSchema,
} from "./schemas";

export type SpotifyError = typeof ErrorSchema.Type;

type Enumerate<
	N extends number,
	Acc extends number[] = [],
> = Acc["length"] extends N
	? Acc[number] | N
	: Enumerate<N, [...Acc, Acc["length"]]>;
export type Range<F extends number, T extends number> =
	| Exclude<
			Enumerate<T>,
			Enumerate<F> extends infer E
				? E extends number
					? E extends F
						? never
						: E
					: never
				: never
	  >
	| F;

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object
	? (Without<T, U> & U) | (Without<U, T> & T)
	: T | U;

export type Page<T> = ReturnType<typeof PageSchema<T>>;
type Copyright = typeof CopyrightSchema.Type;
export type Image = typeof ImageSchema.Type;
type Restrictions = typeof RestrictionsSchema.Type;
type ExternalIds = typeof ExternalIdsSchema.Type;
type ExternalUrls = typeof ExternalUrlsSchema.Type;
type Followers = typeof FollowersSchema.Type;
type LinkedFrom = typeof LinkedFromSchema.Type;
type SimplifiedArtist = typeof SimplifiedArtistSchema.Type;
export type Artist = typeof ArtistSchema.Type;
export type FollowedArtist = typeof FollowedArtistSchema.Type;
type AlbumBase = typeof AlbumBaseSchema.Type;
export type SimplifiedAlbum = typeof SimplifiedAlbumSchema.Type;
type NewReleases = typeof NewReleasesSchema.Type;
type Author = typeof AuthorSchema.Type;
type Narrator = typeof NarratorSchema.Type;
export type SimplifiedAudiobook = typeof SimplifiedAudiobookSchema.Type;
type ResumePoint = typeof ResumePointSchema.Type;
export type Category = typeof CategorySchema.Type;
export type SimplifiedChapter = typeof SimplifiedChapterSchema.Type;
export type Audiobook = typeof AudiobookSchema.Type;
export type Chapter = typeof ChapterSchema.Type;
export type SimplifiedEpisode = typeof SimplifiedEpisodeSchema.Type;
export type SimplifiedShow = typeof SimplifiedShowSchema.Type;
export type Episode = typeof EpisodeSchema.Type;
export type SavedEpisode = typeof SavedEpisodeSchema.Type;
export type Show = typeof ShowSchema.Type;
export type SavedShow = typeof SavedShowSchema.Type;
type SimplifiedTrack = typeof SimplifiedTrackSchema.Type;
export type Album = typeof AlbumSchema.Type;
export type SavedAlbum = typeof SavedAlbumSchema.Type;
type AlbumTrack = typeof AlbumTrackSchema.Type;
export type Track = typeof TrackSchema.Type;
export type SavedTrack = typeof SavedTrackSchema.Type;
type AudioFeatures = typeof AudioFeaturesSchema.Type;
type Meta = typeof MetaSchema.Type;
type TrackAnalysis = typeof TrackAnalysisSchema.Type;
type Bar = typeof BarSchema.Type;
type Beat = typeof BeatSchema.Type;
type Section = typeof SectionSchema.Type;
type Segment = typeof SegmentSchema.Type;
type Tatum = typeof TatumSchema.Type;
type AudioAnalysis = typeof AudioAnalysisSchema.Type;
type RecommendationSeed = typeof RecommendationSeedSchema.Type;
type RecommendationResponse = typeof RecommendationsResponseSchema.Type;
type SnapshotReference = typeof SnapshotReferenceSchema.Type;
type UserReference = typeof UserReferenceSchema.Type;
type PlaylistBase = typeof PlaylistBaseSchema.Type;
type AddedBy = typeof AddedBySchema.Type;
type TrackItem = typeof TrackItemSchema.Type;
export type PlaylistTrack = typeof PlaylistTrackSchema.Type;
export type Playlist = typeof PlaylistSchema.Type;
type TrackReference = typeof TrackReferenceSchema.Type;
export type SimplifiedPlaylist = typeof SimplifiedPlaylistSchema.Type;
export type SearchResults = typeof SearchResultsMapSchema.Type;
type FeaturedPlaylists = typeof FeaturedPlaylistsSchema.Type;
export type User = typeof UserSchema.Type;
type UserProfile = typeof UserProfileSchema.Type;
type Actions = typeof ActionsSchema.Type;
export type Device = typeof DeviceSchema.Type;
type Context = typeof ContextSchema.Type;
export type PlaybackState = typeof PlaybackStateSchema.Type;
export type PlayHistory = typeof PlayHistorySchema.Type;
type RecentlyPlayedTracks = typeof RecentlyPlayedTracksSchema.Type;
export type Queue = typeof QueueSchema.Type;
