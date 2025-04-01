import { AlbumService } from "./services/AlbumService";
import { ArtistService } from "./services/ArtistService";
import { AudiobookService } from "./services/AudiobookService";
import { CategoryService } from "./services/CategoryService";
import { ChapterService } from "./services/ChapterService";
import { EpisodeService } from "./services/EpisodeService";
import { MarketService } from "./services/MarketService";
import { PlayerService } from "./services/PlayerService";
import { PlaylistService } from "./services/PlaylistService";
import { SearchService } from "./services/SearchService";
import { ShowService } from "./services/ShowService";
import { TrackService } from "./services/TrackService";
import { UserService } from "./services/UserService";

interface PKCEAuth {
  type: "PKCE";
  clientId: string;
  redirectUri: string;
}

interface ClientCredentialsAuth {
  type: "ClientCredentials";
  clientId: string;
  clientSecret: string;
}

type AuthStrategy = PKCEAuth | ClientCredentialsAuth;

export function Client({ auth }: { auth: AuthStrategy }) {
  return {
    album: new AlbumService(),
    artist: new ArtistService(),
    audiobook: new AudiobookService(),
    category: new CategoryService(),
    chapter: new ChapterService(),
    episode: new EpisodeService(),
    market: new MarketService(),
    player: new PlayerService(),
    playlist: new PlaylistService(),
    search: new SearchService(),
    show: new ShowService(),
    track: new TrackService(),
    user: new UserService(),
  };
}
