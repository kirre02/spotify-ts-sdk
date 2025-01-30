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

type SimplifiedTrack = {
  artists: SimplifiedArtist[];
  available_markets: string[];
  dics_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: LinkedFrom;
  restrictions: Restrictions;
  name: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
};

type Track = SimplifiedTrack & {
  album: SimplifiedAlbum;
  external_ids: ExternalIds;
  popularity: number;
};

type TopTracksResult = {
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
