type Page<TItemType> = {
  href: string;
  items: TItemType[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
};

type Copyright = {
  text: string;
  type: string;
};

type Image = {
  url: string;
  height: number;
  width: number;
};

type Restrictions = {
  reason: string;
};

type ExternalIds = {
  isrc: string;
  ean: string;
  upc: string;
};

type ExternalUrls = {
  spotify: string;
};

type Followers = {
  href: string | null;
  total: number;
};

type SearchResultsMap = {
  albums: SimplifiedAlbum;
  artists: Artist;
  tracks: Track;
  playlists: SimplifiedPlaylist;
  shows: SimplifiedShow;
  episodes: SimplifiedEpisode;
  audiobooks: SimplifiedAudiobook;
};

type LinkedFrom = {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
};

type SimplifiedArtist = {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

type Artist = SimplifiedArtist & {
  followers: Followers;
  genres: string[];
  images: Image[];
  popularity: number;
};

type Artists = {
  artists: Artist[];
};

type FollowedArtists = {
  artists: Artist[];
};

type AlbumBase = {
  album_type: string;
  available_markets: string[];
  copyrights: Copyright[];
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  label: string;
  name: string;
  popularity: number;
  release_date: string;
  release_date_precision: string;
  restrictions?: Restrictions;
  total_tracks: number;
  type: string;
  uri: string;
};

type SimplifiedAlbum = AlbumBase & {
  album_group: string;
  artists: SimplifiedArtist[];
};

type SavedAlbum = {
  added_at: string;
  album: Album;
};

type Album = AlbumBase & {
  artists: Artist[];
  tracks: Page<SimplifiedTrack>;
};

type Albums = {
  albums: Album[];
};

type AlbumTrack = {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: SimplifiedTrack[];
};

type NewReleases = {
  albums: Page<SimplifiedAlbum>;
};

type Author = {
  name: string;
};

type Narrator = {
  name: string;
};

type SimplifiedAudiobook = {
  authors: Author[];
  available_markets: string[];
  copyrights: Copyright[];
  description: string;
  edition: string;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  html_description: string;
  id: string;
  images: Image[];
  languages: string[];
  media_type: string;
  name: string;
  narrators: Narrator[];
  publisher: string;
  total_chapters: number;
  type: string;
  uri: string;
};

type Audiobook = SimplifiedAudiobook & {
  chapters: Page<SimplifiedChapter>;
};

type Audiobooks = {
  audiobooks: Audiobook[];
};

type ResumePoint = {
  fully_played: boolean;
  resume_position_ms: number;
};

type Category = {
  href: string;
  icons: Image[];
  id: string;
  name: string;
};

type Categories = {
  categories: Page<Category>;
};

type SimplifiedChapter = {
  available_markets: string[];
  chapter_number: number;
  description: string;
  html_description: string;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  is_playable: boolean;
  languages: string[];
  name: string;
  release_date: string;
  release_date_precision: string;
  resume_point: ResumePoint;
  type: string;
  uri: string;
  restrictions: Restrictions;
};

type Chapters = {
  chapters: Chapter[];
};

type Chapter = SimplifiedChapter & {
  audiobook: SimplifiedAudiobook;
};

type SimplifiedEpisode = {
  description: string;
  html_description: string;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  is_externally_hosted: boolean;
  is_playable: boolean;
  language: string;
  languages: string[];
  name: string;
  release_date: string;
  release_date_precision: string;
  resume_point: ResumePoint;
  type: string;
  uri: string;
  restrictions: Restrictions;
};

type Episode = SimplifiedEpisode & {
  show: SimplifiedShow;
};

type Episodes = {
  episodes: Episode[];
};

type SavedEpisode = {
  added_at: string;
  episode: Episode;
};

type SimplifiedShow = {
  available_markets: string[];
  copyrights: Copyright[];
  description: string;
  html_description: string;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  is_externally_hosted: boolean;
  languages: string[];
  media_type: string;
  name: string;
  publisher: string;
  type: string;
  uri: string;
  total_episodes: number;
};

type Show = SimplifiedShow & {
  episodes: Page<SimplifiedEpisode>;
};

type Shows = {
  shows: Show[];
};

type SavedShow = {
  added_at: string;
  show: SimplifiedShow;
};

type SimplifiedTrack = {
  artists: SimplifiedArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  episode: boolean;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  track: boolean;
  track_number: number;
  is_playable: boolean;
  linked_from: LinkedFrom;
  restrictions: Restrictions;
  type: string;
  uri: string;
};

type SavedTrack = {
  added_at: string;
  track: Track;
};

type Track = SimplifiedTrack & {
  album: SimplifiedAlbum;
  external_ids: ExternalIds;
  popularity: number;
};

type Tracks = {
  tracks: Track[];
};

type TopTracksResult = {
  tracks: Track[];
};

type AudioFeatures = {
  acousticness: number;
  analysis_url: string;
  danceability: number;
  duration_ms: number;
  energy: number;
  id: string;
  instrumentalness: number;
  key: number;
  liveness: number;
  loudness: number;
  mode: number;
  speechiness: number;
  tempo: number;
  time_signature: number;
  track_href: string;
  type: string;
  uri: string;
  valence: number;
};

type AudioFeaturesCollection = {
  audio_features: AudioFeatures[];
};

type AudioAnalysis = {
  meta: Meta;
  track: TrackAnalysis;
  bars: Bar[];
  beats: Beat[];
  sections: Section[];
  segments: Segment[];
  tatums: Tatum[];
};

type Meta = {
  analyzer_version: string;
  platform: string;
  detailed_status: string;
  status_code: number;
  timestamp: number;
  analysis_time: number;
  input_process: number;
};

type TrackAnalysis = {
  num_samples: number;
  duration: number;
  sample_md5: string;
  offset_seconds: number;
  window_seconds: number;
  analysis_sample_rate: number;
  analysis_channels: number;
  end_of_fade_in: number;
  end_of_fade_out: number;
  loudness: number;
  tempo: number;
  tempo_confidence: number;
  time_signature: number;
  time_signature_confidence: number;
  key: number;
  key_confidence: number;
  mode: number;
  mode_confidence: number;
  codestring: string;
  code_version: number;
  echoprintstring: string;
  echoprint_version: number;
  synchstring: string;
  synch_version: number;
  rhythmstring: string;
  rhythm_version: number;
};

type Bar = {
  start: number;
  duration: number;
  confidence: number;
};

type Beat = {
  start: number;
  duration: number;
  confidence: number;
};

type Section = {
  start: number;
  duration: number;
  confidence: number;
  loudness: number;
  tempo: number;
  tempo_confidence: number;
  key: number;
  key_confidence: number;
  mode: number;
  mode_confidence: number;
  time_signature: number;
  time_signature_confidence: number;
};

type Segment = {
  start: number;
  duration: number;
  confidence: number;
  loudness_start: number;
  loudness_max: number;
  loudness_max_time: number;
  loudness_end: number;
  pitches: number[];
  timbre: number[];
};

type Tatum = {
  start: number;
  duration: number;
  confidence: number;
};

type RecommendationSeed = {
  afterFilteringSize: number;
  afterRelinkingSize: number;
  href: string;
  id: string;
  initialPoolSize: number;
  type: string;
};

type RecommendationsResponse = {
  seeds: RecommendationSeed[];
  tracks: Track[];
};

type SnapshotReference = {
  snapshot_id: string;
};

type PlaylistBase = {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: UserReference;
  primary_color: string;
  public: boolean;
  snapshot_id: string;
  type: string;
  uri: string;
};

type PlaylistedTrack<Item extends TrackItem = TrackItem> = {
  added_at: string;
  added_by: AddedBy;
  is_local: boolean;
  primary_color: string;
  track: Item;
};

type AddedBy = {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
};

type Playlist<Item extends TrackItem = TrackItem> = PlaylistBase & {
  tracks: Page<PlaylistedTrack<Item>>;
};

type FeatureedPlaylists = {
  message: string;
  playlists: Page<SimplifiedPlaylist>;
};

type SimplifiedPlaylist = PlaylistBase & {
  tracks: TrackReference | null;
};

type TrackReference = {
  href: string;
  total: number;
};

type UserReference = {
  display_name: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
};

type User = {
  display_name: string;
  email: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  type: string;
  uri: string;
};

type UserProfile = User & {
  country: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  product: string;
};

type TrackItem = Track | Episode;

type Actions = {
  interrupting_playback: boolean;
  pausing: boolean;
  resuming: boolean;
  seeking: boolean;
  skipping_next: boolean;
  skipping_prev: boolean;
  toggling_repeat_context: boolean;
  toggling_shuffle: boolean;
  toggling_repeat_track: boolean;
  transferring_playback: boolean;
};

type PlaybackState = {
  device: Device;
  repeat_state: string;
  shuffle_state: boolean;
  context: Context | null;
  timestamp: number;
  progress_ms: number;
  is_playing: boolean;
  item: TrackItem;
  currently_playing_type: string;
  actions: Actions;
};

type Device = {
  id: string | null;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number | null;
};

type Devices = {
  devices: Device[];
};

type Context = {
  type: string;
  href: string;
  external_urls: ExternalUrls;
  uri: string;
};

type RecentlyPlayedTracks = {
  href: string;
  limit: number;
  next: string | null;
  cursors: {
    after: string;
    before: string;
  };
  total: number;
  items: PlayHistory[];
};

type PlayHistory = {
  track: Track;
  played_at: string;
  context: Context;
};

type Queue = {
  currently_playing: TrackItem | null;
  queue: TrackItem[];
};
