import { AlbumService, AlbumServiceLive } from "@services/album";
import { ArtistService, ArtistServiceLive } from "@services/artist";
import { AudiobookService, AudiobookServiceLive } from "@services/audiobook";
import { CategoryService, CategoryServiceLive } from "@services/category";
import { ChapterService, ChapterServiceLive } from "@services/chapter";
import { EpisodeService, EpisodeServiceLive } from "@services/episode";
import { makeClientCredentialsAuth } from "auth/withClientCredentials";
import { MarketService, MarketServiceLive } from "@services/market";
import { PlayerService, PlayerServiceLive } from "@services/player";
import { PlaylistService, PlaylistServiceLive } from "@services/playlist";
import { SearchService, SearchServiceLive } from "@services/search";
import { ShowService, ShowServiceLive } from "@services/show";
import { TrackService, TrackServiceLive } from "@services/track";
import { UserService, UserServiceLive } from "@services/user";
import { Effect, Layer } from "effect";
import type { ConfigError } from "effect/ConfigError";
import type { AuthService } from "auth";
import type { PlatformError } from "@effect/platform/Error";

export function BetterMusic() {
	return Effect.gen(function* () {
		const album = yield* AlbumService;
		const artist = yield* ArtistService;
		const audiobook = yield* AudiobookService;
		const category = yield* CategoryService;
		const chapter = yield* ChapterService;
		const episode = yield* EpisodeService;
		const market = yield* MarketService;
		const player = yield* PlayerService;
		const playlist = yield* PlaylistService;
		const search = yield* SearchService;
		const show = yield* ShowService;
		const track = yield* TrackService;
		const user = yield* UserService;

		return {
			album,
			artist,
			audiobook,
			category,
			chapter,
			episode,
			market,
			player,
			playlist,
			search,
			show,
			track,
			user,
		};
	});
}

export function BetterMusicClientCredentials() {
	return createClient(makeClientCredentialsAuth());
}

function createClient(
	authLayer: Layer.Layer<AuthService, ConfigError | PlatformError>,
) {
	const servicesLayer = Layer.mergeAll(
		AlbumServiceLive,
		ArtistServiceLive,
		AudiobookServiceLive,
		CategoryServiceLive,
		ChapterServiceLive,
		EpisodeServiceLive,
		MarketServiceLive,
		PlayerServiceLive,
		PlaylistServiceLive,
		SearchServiceLive,
		ShowServiceLive,
		TrackServiceLive,
		UserServiceLive,
	);

	const appLayer = Layer.merge(servicesLayer, authLayer);

	return appLayer;
}
