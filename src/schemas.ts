import { Schema as S } from "effect";

export const PageSchema = <T>(itemSchema: S.Schema<T>) =>
  S.Struct({
    href: S.String,
    limit: S.Number,
    next: S.NullOr(S.String),
    offset: S.Number,
    previous: S.NullOr(S.String),
    total: S.Number,
    items: S.Array(itemSchema),
  });

export type Page<T> = S.Schema.Type<ReturnType<typeof PageSchema<T>>>;

const CopyrightSchema = S.Struct({
  text: S.String,
  type: S.String,
});

type Copyright = S.Schema.Type<typeof CopyrightSchema>;

export const ImageSchema = S.Struct({
  url: S.String,
  height: S.Number,
  width: S.Number,
});

export type Image = S.Schema.Type<typeof ImageSchema>;

const RestrictionsSchema = S.Struct({
  reason: S.String,
});

type Restrictions = S.Schema.Type<typeof RestrictionsSchema>;

const ExternalIdsSchema = S.Struct({
  isrc: S.String,
  ean: S.String,
  upc: S.String,
});

type ExternalIds = S.Schema.Type<typeof ExternalIdsSchema>;

const ExternalUrlsSchema = S.Struct({
  spotify: S.String,
});

type ExternalUrls = S.Schema.Type<typeof ExternalUrlsSchema>;

const FollowersSchema = S.Struct({
  href: S.NullOr(S.String),
  total: S.Number,
});

type Followers = S.Schema.Type<typeof FollowersSchema>;

const LinkedFromSchema = S.Struct({
  external_urls: ExternalUrlsSchema,
  href: S.String,
  id: S.String,
  type: S.String,
  uri: S.String,
});

type LinkedFrom = S.Schema.Type<typeof LinkedFromSchema>;

const SimplifiedArtistSchema = S.Struct({
  external_urls: ExternalUrlsSchema,
  href: S.String,
  id: S.String,
  name: S.String,
  type: S.String,
  uri: S.String,
});

type SimplifiedArtist = S.Schema.Type<typeof SimplifiedArtistSchema>;

export const ArtistSchema = S.extend(
  SimplifiedArtistSchema,
  S.Struct({
    followers: FollowersSchema,
    genres: S.Array(S.String),
    images: S.Array(ImageSchema),
    popularity: S.Number,
  }),
);

export type Artist = S.Schema.Type<typeof ArtistSchema>;

const AlbumBaseSchema = S.Struct({
  album_type: S.String,
  available_markets: S.Array(S.String),
  copyrights: S.Array(CopyrightSchema),
  external_ids: ExternalIdsSchema,
  external_urls: ExternalUrlsSchema,
  genres: S.Array(S.String),
  href: S.String,
  id: S.String,
  images: S.Array(ImageSchema),
  label: S.String,
  name: S.String,
  popularity: S.Number,
  release_date: S.String,
  release_date_precision: S.String,
  restrictions: S.optional(RestrictionsSchema),
  total_tracks: S.Number,
  type: S.String,
  uri: S.String,
});

type AlbumBase = S.Schema.Type<typeof AlbumBaseSchema>;

export const SimplifiedAlbumSchema = S.extend(
  AlbumBaseSchema,
  S.Struct({
    album_group: S.String,
    artists: S.Array(SimplifiedArtistSchema),
  }),
);

export type SimplifiedAlbum = S.Schema.Type<typeof SimplifiedAlbumSchema>;

const NewReleasesSchema = S.Struct({
  albums: PageSchema(SimplifiedAlbumSchema),
});

type NewReleases = S.Schema.Type<typeof NewReleasesSchema>;

const AuthorSchema = S.Struct({
  name: S.String,
});

type Author = S.Schema.Type<typeof AuthorSchema>;

const NarratorSchema = S.Struct({
  name: S.String,
});

type Narrator = S.Schema.Type<typeof NarratorSchema>;

const SimplifiedAudiobookSchema = S.Struct({
  authors: S.Array(AuthorSchema),
  available_markets: S.Array(S.String),
  copyrights: S.Array(CopyrightSchema),
  description: S.String,
  edition: S.String,
  explicit: S.Boolean,
  external_urls: ExternalUrlsSchema,
  href: S.String,
  html_description: S.String,
  id: S.String,
  images: S.Array(ImageSchema),
  languages: S.Array(S.String),
  media_type: S.String,
  name: S.String,
  narrators: S.Array(NarratorSchema),
  publisher: S.String,
  total_chapters: S.Number,
  type: S.String,
  uri: S.String,
});

type SimplifiedAudiobook = S.Schema.Type<typeof SimplifiedAudiobookSchema>;

const ResumePointSchema = S.Struct({
  fully_played: S.Boolean,
  resume_position_ms: S.Number,
});

type ResumePoint = S.Schema.Type<typeof ResumePointSchema>;

export const CategorySchema = S.Struct({
  href: S.String,
  icons: S.Array(ImageSchema),
  id: S.String,
  name: S.String,
});

export type Category = S.Schema.Type<typeof CategorySchema>;

export const SimplifiedChapterSchema = S.Struct({
  available_markets: S.Array(S.String),
  chapter_number: S.Number,
  description: S.String,
  html_description: S.String,
  duration_ms: S.Number,
  explicit: S.Boolean,
  external_urls: ExternalUrlsSchema,
  href: S.String,
  id: S.String,
  images: S.Array(ImageSchema),
  is_playable: S.Boolean,
  languages: S.Array(S.String),
  name: S.String,
  release_date: S.String,
  release_date_precision: S.String,
  resume_point: ResumePointSchema,
  type: S.String,
  uri: S.String,
  restrictions: RestrictionsSchema,
});

export type SimplifiedChapter = S.Schema.Type<typeof SimplifiedChapterSchema>;

export const AudiobookSchema = S.extend(
  SimplifiedAudiobookSchema,
  S.Struct({
    chapters: PageSchema(SimplifiedChapterSchema),
  }),
);

export type Audiobook = S.Schema.Type<typeof AudiobookSchema>;

export const ChapterSchema = S.extend(
  SimplifiedChapterSchema,
  S.Struct({
    audiobook: SimplifiedAudiobookSchema,
  }),
);

export type Chapter = S.Schema.Type<typeof ChapterSchema>;

const SimplifiedEpisodeSchema = S.Struct({
  description: S.String,
  html_description: S.String,
  duration_ms: S.Number,
  explicit: S.Boolean,
  external_urls: ExternalUrlsSchema,
  href: S.String,
  id: S.String,
  images: S.Array(ImageSchema),
  is_externally_hosted: S.Boolean,
  is_playable: S.Boolean,
  language: S.String,
  languages: S.Array(S.String),
  name: S.String,
  release_date: S.String,
  release_date_precision: S.String,
  resume_point: ResumePointSchema,
  type: S.String,
  uri: S.String,
  restrictions: RestrictionsSchema,
});

type SimplifiedEpisode = S.Schema.Type<typeof SimplifiedEpisodeSchema>;

const SimplifiedShowSchema = S.Struct({
  available_markets: S.Array(S.String),
  copyrights: S.Array(CopyrightSchema),
  description: S.String,
  html_description: S.String,
  explicit: S.Boolean,
  external_urls: ExternalUrlsSchema,
  href: S.String,
  id: S.String,
  images: S.Array(ImageSchema),
  is_externally_hosted: S.Boolean,
  languages: S.Array(S.String),
  media_type: S.String,
  name: S.String,
  publisher: S.String,
  type: S.String,
  uri: S.String,
  total_episodes: S.Number,
});

type SimplifiedShow = S.Schema.Type<typeof SimplifiedShowSchema>;

export const EpisodeSchema = S.extend(
  SimplifiedEpisodeSchema,
  S.Struct({
    show: SimplifiedShowSchema,
  }),
);

export type Episode = S.Schema.Type<typeof EpisodeSchema>;

const SavedEpisodeSchema = S.Struct({
  added_at: S.String,
  episode: EpisodeSchema,
});

type SavedEpisode = S.Schema.Type<typeof SavedEpisodeSchema>;

const ShowSchema = S.extend(
  SimplifiedShowSchema,
  S.Struct({
    episodes: PageSchema(SimplifiedEpisodeSchema),
  }),
);

type Show = S.Schema.Type<typeof ShowSchema>;

const SavedShowSchema = S.Struct({
  added_at: S.String,
  show: SimplifiedShowSchema,
});

type SavedShow = S.Schema.Type<typeof SavedShowSchema>;

const SimplifiedTrackSchema = S.Struct({
  artists: S.Array(SimplifiedArtistSchema),
  available_markets: S.Array(S.String),
  disc_number: S.Number,
  duration_ms: S.Number,
  episode: S.Boolean,
  explicit: S.Boolean,
  external_urls: ExternalUrlsSchema,
  href: S.String,
  id: S.String,
  is_local: S.Boolean,
  name: S.String,
  track: S.Boolean,
  track_number: S.Number,
  is_playable: S.Boolean,
  linked_from: LinkedFromSchema,
  restrictions: RestrictionsSchema,
  type: S.String,
  uri: S.String,
});

type SimplifiedTrack = S.Schema.Type<typeof SimplifiedTrackSchema>;

export const AlbumSchema = S.extend(
  AlbumBaseSchema,
  S.Struct({
    artists: S.Array(ArtistSchema),
    tracks: PageSchema(SimplifiedTrackSchema),
  }),
);

export type Album = S.Schema.Type<typeof AlbumSchema>;

const SavedAlbumSchema = S.Struct({
  added_at: S.String,
  album: AlbumSchema,
});

type SavedAlbum = S.Schema.Type<typeof SavedAlbumSchema>;

const AlbumTrackSchema = S.Struct({
  href: S.String,
  limit: S.Number,
  next: S.String,
  offset: S.Number,
  previous: S.String,
  total: S.Number,
  items: S.Array(SimplifiedTrackSchema),
});

type AlbumTrack = S.Schema.Type<typeof AlbumTrackSchema>;

export const TrackSchema = S.extend(
  SimplifiedTrackSchema,
  S.Struct({
    album: SimplifiedAlbumSchema,
    external_ids: ExternalIdsSchema,
    popularity: S.Number,
  }),
);

export type Track = S.Schema.Type<typeof TrackSchema>;

const SavedTrackSchema = S.Struct({
  added_at: S.String,
  track: TrackSchema,
});

type SavedTrack = S.Schema.Type<typeof SavedTrackSchema>;

const AudioFeaturesSchema = S.Struct({
  acousticness: S.Number,
  analysis_url: S.String,
  danceability: S.Number,
  duration_ms: S.Number,
  energy: S.Number,
  id: S.String,
  instrumentalness: S.Number,
  key: S.Number,
  liveness: S.Number,
  loudness: S.Number,
  mode: S.Number,
  speechiness: S.Number,
  tempo: S.Number,
  time_signature: S.Number,
  track_href: S.String,
  type: S.String,
  uri: S.String,
  valence: S.Number,
});

type AudioFeatures = S.Schema.Type<typeof AudioFeaturesSchema>;

const MetaSchema = S.Struct({
  analyzer_version: S.String,
  platform: S.String,
  detailed_status: S.String,
  status_code: S.Number,
  timestamp: S.Number,
  analysis_time: S.Number,
  input_process: S.Number,
});

type Meta = S.Schema.Type<typeof MetaSchema>;

const TrackAnalysisSchema = S.Struct({
  num_samples: S.Number,
  duration: S.Number,
  sample_md5: S.String,
  offset_seconds: S.Number,
  window_seconds: S.Number,
  analysis_sample_rate: S.Number,
  analysis_channels: S.Number,
  end_of_fade_in: S.Number,
  end_of_fade_out: S.Number,
  loudness: S.Number,
  tempo: S.Number,
  tempo_confidence: S.Number,
  time_signature: S.Number,
  time_signature_confidence: S.Number,
  key: S.Number,
  key_confidence: S.Number,
  mode: S.Number,
  mode_confidence: S.Number,
  codestring: S.String,
  code_version: S.Number,
  echoprintstring: S.String,
  echoprint_version: S.Number,
  synchstring: S.String,
  synch_version: S.Number,
  rhythmstring: S.String,
  rhythm_version: S.Number,
});

type TrackAnalysis = S.Schema.Type<typeof TrackAnalysisSchema>;

const BarSchema = S.Struct({
  start: S.Number,
  duration: S.Number,
  confidence: S.Number,
});

type Bar = S.Schema.Type<typeof BarSchema>;

const BeatSchema = S.Struct({
  start: S.Number,
  duration: S.Number,
  confidence: S.Number,
});

type Beat = S.Schema.Type<typeof BeatSchema>;

const SectionSchema = S.Struct({
  start: S.Number,
  duration: S.Number,
  confidence: S.Number,
  loudness: S.Number,
  tempo: S.Number,
  tempo_confidence: S.Number,
  key: S.Number,
  key_confidence: S.Number,
  mode: S.Number,
  mode_confidence: S.Number,
  time_signature: S.Number,
  time_signature_confidence: S.Number,
});

type Section = S.Schema.Type<typeof SectionSchema>;

const SegmentSchema = S.Struct({
  start: S.Number,
  duration: S.Number,
  confidence: S.Number,
  loudness_start: S.Number,
  loudness_max: S.Number,
  loudness_max_time: S.Number,
  loudness_end: S.Number,
  pitches: S.Array(S.Number),
  timbre: S.Array(S.Number),
});

type Segment = S.Schema.Type<typeof SegmentSchema>;

const TatumSchema = S.Struct({
  start: S.Number,
  duration: S.Number,
  confidence: S.Number,
});

type Tatum = S.Schema.Type<typeof TatumSchema>;

const AudioAnalysisSchema = S.Struct({
  meta: MetaSchema,
  track: TrackAnalysisSchema,
  bars: S.Array(BarSchema),
  beats: S.Array(BeatSchema),
  sections: S.Array(SectionSchema),
  segments: S.Array(SegmentSchema),
  tatums: S.Array(TatumSchema),
});

type AudioAnalysis = S.Schema.Type<typeof AudioAnalysisSchema>;

const RecommendationSeedSchema = S.Struct({
  afterFilteringSize: S.Number,
  afterRelinkingSize: S.Number,
  href: S.String,
  id: S.String,
  initialPoolSize: S.Number,
  type: S.String,
});

type RecommendationSeed = S.Schema.Type<typeof RecommendationSeedSchema>;

const RecommendationsResponseSchema = S.Struct({
  seeds: S.Array(RecommendationSeedSchema),
  tracks: S.Array(TrackSchema),
});

type RecommendationResponse = S.Schema.Type<
  typeof RecommendationsResponseSchema
>;

const SnapshotReferenceSchema = S.Struct({
  snapshot_id: S.String,
});

type SnapshotReference = S.Schema.Type<typeof SnapshotReferenceSchema>;

const UserReferenceSchema = S.Struct({
  display_name: S.String,
  external_urls: ExternalUrlsSchema,
  href: S.String,
  id: S.String,
  type: S.String,
  uri: S.String,
});

type UserReference = S.Schema.Type<typeof UserReferenceSchema>;

const PlaylistBaseSchema = S.Struct({
  collaborative: S.Boolean,
  description: S.String,
  external_urls: ExternalUrlsSchema,
  followers: FollowersSchema,
  href: S.String,
  id: S.String,
  images: S.Array(ImageSchema),
  name: S.String,
  owner: UserReferenceSchema,
  primary_color: S.String,
  public: S.Boolean,
  snapshot_id: S.String,
  type: S.String,
  uri: S.String,
});

type PlaylistBase = S.Schema.Type<typeof PlaylistBaseSchema>;

const AddedBySchema = S.Struct({
  external_urls: ExternalUrlsSchema,
  href: S.String,
  id: S.String,
  type: S.String,
  uri: S.String,
});

type AddedBy = S.Schema.Type<typeof AddedBySchema>;

const TrackItemSchema = S.Union(TrackSchema, EpisodeSchema);

type TrackItem = S.Schema.Type<typeof TrackItemSchema>;

export const PlaylistTrackSchema = S.Struct({
  added_at: S.String,
  added_by: AddedBySchema,
  is_local: S.Boolean,
  primary_color: S.String,
  track: TrackItemSchema,
});

export type PlaylistTrack = S.Schema.Type<typeof PlaylistTrackSchema>;

export const PlaylistSchema = S.extend(
  PlaylistBaseSchema,
  S.Struct({
    tracks: PageSchema(PlaylistTrackSchema),
  }),
);

export type Playlist = S.Schema.Type<typeof PlaylistSchema>;

const TrackReferenceSchema = S.Struct({
  href: S.String,
  total: S.Number,
});

type TrackReference = S.Schema.Type<typeof TrackReferenceSchema>;

export const SimplifiedPlaylistSchema = S.extend(
  PlaylistBaseSchema,
  S.Struct({
    tracks: S.NullOr(TrackReferenceSchema),
  }),
);

export type SimplifiedPlaylist = S.Schema.Type<typeof SimplifiedPlaylistSchema>;

export const SearchResultsMapSchema = S.Struct({
  albums: SimplifiedAlbumSchema,
  artists: ArtistSchema,
  tracks: TrackSchema,
  playlists: SimplifiedPlaylistSchema,
  shows: SimplifiedShowSchema,
  episodes: SimplifiedEpisodeSchema,
  audiobooks: SimplifiedAudiobookSchema,
});

export type SearchResults = S.Schema.Type<typeof SearchResultsMapSchema>;

const FeaturedPlaylistsSchema = S.Struct({
  message: S.String,
  playlists: PageSchema(SimplifiedPlaylistSchema),
});

type FeaturedPlaylists = S.Schema.Type<typeof FeaturedPlaylistsSchema>;

const UserSchema = S.Struct({
  display_name: S.String,
  email: S.String,
  external_urls: ExternalUrlsSchema,
  followers: FollowersSchema,
  href: S.String,
  id: S.String,
  images: S.Array(ImageSchema),
  type: S.String,
  uri: S.String,
});

type User = S.Schema.Type<typeof UserSchema>;

const UserProfileSchema = S.extend(
  UserSchema,
  S.Struct({
    country: S.String,
    explicit_content: S.Struct({
      filter_enabled: S.Boolean,
      filter_locked: S.Boolean,
    }),
    product: S.String,
  }),
);

type UserProfile = S.Schema.Type<typeof UserProfileSchema>;

const ActionsSchema = S.Struct({
  interrupting_playback: S.Boolean,
  pausing: S.Boolean,
  resuming: S.Boolean,
  seeking: S.Boolean,
  skipping_next: S.Boolean,
  skipping_prev: S.Boolean,
  toggling_repeat_context: S.Boolean,
  toggling_shuffle: S.Boolean,
  toggling_repeat_track: S.Boolean,
  transferring_playback: S.Boolean,
});

type Actions = S.Schema.Type<typeof ActionsSchema>;

export const DeviceSchema = S.Struct({
  id: S.NullOr(S.String),
  is_active: S.Boolean,
  is_private_session: S.Boolean,
  is_restricted: S.Boolean,
  name: S.String,
  type: S.String,
  volume_percent: S.NullOr(S.Number),
});

export type Device = S.Schema.Type<typeof DeviceSchema>;

const ContextSchema = S.Struct({
  type: S.String,
  href: S.String,
  external_urls: ExternalUrlsSchema,
  uri: S.String,
});

type Context = S.Schema.Type<typeof ContextSchema>;

export const PlaybackStateSchema = S.Struct({
  device: DeviceSchema,
  repeat_state: S.String,
  shuffle_state: S.Boolean,
  context: S.NullOr(ContextSchema),
  timestamp: S.Number,
  progress_ms: S.Number,
  is_playing: S.Boolean,
  item: TrackItemSchema,
  currently_playing_type: S.String,
  actions: ActionsSchema,
});

export type PlaybackState = S.Schema.Type<typeof PlaybackStateSchema>;

export const PlayHistorySchema = S.Struct({
  track: TrackSchema,
  played_at: S.String,
  context: ContextSchema,
});

export type PlayHistory = S.Schema.Type<typeof PlayHistorySchema>;

const RecentlyPlayedTracksSchema = S.Struct({
  href: S.String,
  limit: S.Number,
  next: S.NullOr(S.String),
  cursors: S.Struct({
    after: S.String,
    before: S.String,
  }),
  total: S.Number,
  items: S.Array(PlayHistorySchema),
});

type RecentlyPlayedTracks = S.Schema.Type<typeof RecentlyPlayedTracksSchema>;

export const QueueSchema = S.Struct({
  currently_playing: S.NullOr(TrackItemSchema),
  queue: S.Array(TrackItemSchema),
});

export type Queue = S.Schema.Type<typeof QueueSchema>;
