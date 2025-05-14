import { Schema } from "effect";
import { AlbumService } from "@services/albums";
import { ArtistService } from "@services/artists";
import { AudiobookService } from "@services/audiobooks";
import { CategoryService } from "@services/categories";
import { ChapterService } from "@services/chapters";
import { EpisodeService } from "@services/episodes";
import { MarketService } from "@services/markets";
import { PlayerService } from "@services/players";
import { PlaylistService } from "@services/playlists";
import { SearchService } from "@services/searches";
import { ShowService } from "@services/shows";
import { TrackService } from "@services/tracks";
import { UserService } from "@services/users";

interface PKCEAuth {
	type: "PKCE";
	clientId: Schema.String;
	redirectUri: Schema.String;
}

interface ClientCredentialsAuth {
	type: "ClientCredentials";
	clientId: Schema.String;
	clientSecret: Schema.String;
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
