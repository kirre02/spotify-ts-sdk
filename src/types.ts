export type Page<TItemType> = {
  href: string;
  items: TItemType[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
};

export type Copyright = {
  text: string;
  type: string;
};

export type Image = {
  url: string;
  height: number;
  width: number;
};

export type Restrictions = {
  reason: string;
};

export type ExternalIds = {
  isrc: string;
  ean: string;
  upc: string;
};

export type ExternalUrls = {
  spotify: string;
};

export type Followers = {
  href: string | null;
  total: number;
};

export type LinkedFrom = {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
};

export type SimplifiedArtist = {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

export type Artist = SimplifiedArtist & {
  followers: Followers;
  genres: string[];
  images: Image[];
  popularity: number;
};

export type Artists = {
  artists: Artist[];
};

export type AlbumBase = {
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

export type SimplifiedAlbum = AlbumBase & {
  album_group: string;
  artists: SimplifiedArtist[];
};

export type SavedAlbum = {
  added_at: string;
  album: Album;
};

export type Album = AlbumBase & {
  artists: Artist[];
  tracks: Page<SimplifiedTrack>;
};

export type Albums = {
  albums: Album[];
};

export type AlbumTrack = {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: SimplifiedTrack[];
};

export type NewReleases = {
  albums: Page<SimplifiedAlbum>;
};

export type Author = {
  name: string;
};

export type Narrator = {
  name: string;
};

export type SimplifiedAudiobook = {
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

export type Audiobook = SimplifiedAudiobook & {
  chapters: Page<SimplifiedChapter>;
};

export type Audiobooks = {
  audiobooks: Audiobook[];
};

export type ResumePoint = {
  fully_played: boolean;
  resume_position_ms: number;
};

export type Category = {
  href: string;
  icons: Image[];
  id: string;
  name: string;
};

export type Categories = {
  categories: Page<Category>;
};

export type SimplifiedChapter = {
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

export type Chapters = {
  chapters: Chapter[];
};

export type Chapter = SimplifiedChapter & {
  audiobook: SimplifiedAudiobook;
};

export type SimplifiedEpisode = {
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

export type Episode = SimplifiedEpisode & {
  show: SimplifiedShow;
};

export type Episodes = {
  episodes: Episode[];
};

export type SavedEpisode = {
  added_at: string;
  episode: Episode;
};

export type SimplifiedTrack = {
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

export type Track = SimplifiedTrack & {
  album: SimplifiedAlbum;
  external_ids: ExternalIds;
  popularity: number;
};

export type TopTracksResult = {
  tracks: Track[];
};
