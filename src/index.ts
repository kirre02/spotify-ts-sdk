import { AlbumService, AlbumServiceLive } from "@services/album";
import { ArtistService, ArtistServiceLive } from "@services/artist";
import { AudiobookService, AudiobookServiceLive } from "@services/audiobook";
import { CategoryService, CategoryServiceLive } from "@services/category";
import { ChapterService, ChapterServiceLive } from "@services/chapter";
import { EpisodeService, EpisodeServiceLive } from "@services/episode";
import { makeClientCredentialsAuth } from "@auth/withClientCredentials";
import { makePKCEAuth } from "@auth/withPKCE";
import { MarketService, MarketServiceLive } from "@services/market";
import { PlayerService, PlayerServiceLive } from "@services/player";
import { PlaylistService, PlaylistServiceLive } from "@services/playlist";
import { SearchService, SearchServiceLive } from "@services/search";
import { ShowService, ShowServiceLive } from "@services/show";
import { TrackService, TrackServiceLive } from "@services/track";
import { UserService, UserServiceLive } from "@services/user";
import { Cause, Effect, Exit, Layer, ManagedRuntime } from "effect";
import type { ConfigError } from "effect/ConfigError";
import {
	type AuthService,
	PKCEService,
	type StorageAdapter,
} from "@auth/index";
import type { PlatformError } from "@effect/platform/Error";
import type {
	CheckSavedTrackRequest,
	GetSeveralTrackRequest,
	GetTrackRequest,
	RemoveTrackRequest,
	SaveTrackRequest,
} from "@schemas/services/track";
import type {
	AfterBasedPaginationOptions,
	AlbumRetrievalOptions,
	DateRangeOptions,
	DetailedMarketPaginationOptions,
	LocaleOnlyOptions,
	LocalizedPaginationOptions,
	MarketAdditionalTypesOptions,
	MarketExternalOptions,
	MarketFieldOptions,
	MarketOnlyOptions,
	PaginatedMarketOptions,
	PaginationOptions,
	Scopes,
	TimeRangePaginationOptions,
} from "@schemas/options";
import type {
	CheckSavedAlbumRequest,
	GetAlbumRequest,
	GetAlbumTracksRequest,
	GetSeveralAlbumRequest,
	RemoveAlbumRequest,
	SaveAlbumRequest,
} from "@schemas/services/album";
import type {
	GetArtistAlbumRequest,
	GetArtistRequest,
	GetArtistTopTracksRequest,
	GetSeveralArtistRequest,
} from "@schemas/services/artist";
import type {
	CheckSavedAudiobookRequest,
	GetAudiobookChapterRequest,
	GetAudiobookRequest,
	GetSeveralAudiobookRequest,
	RemoveAudiobookRequest,
	SaveAudiobookRequest,
} from "@schemas/services/audiobook";
import type { GetCategoryRequest } from "@schemas/services/category";
import type {
	GetChapterRequest,
	GetSeveralChapterRequest,
} from "@schemas/services/chapter";
import type {
	CheckSavedEpisodeRequest,
	GetEpisodeRequest,
	GetSeveralEpisodeRequest,
	RemoveEpisodeRequest,
	SaveEpisodeRequest,
} from "@schemas/services/episode";
import type {
	AddToPlaybackQueueRequest,
	PausePlaybackRequest,
	SeekToPositionRequest,
	SetPlaybackVolumeRequest,
	SetRepeatModeRequest,
	SkipToNextRequest,
	SkipToPreviousRequest,
	StartOrResumePlaybackRequest,
	TogglePlaybackShuffleRequest,
	TransferPlaybackRequest,
} from "@schemas/services/player";
import type {
	GetUserProfileRequest,
	IsFollowingArtistsRequest,
	IsFollowingPlaylistRequest,
	IsFollowingUsersRequest,
	UserFollowArtistsRequest,
	UserFollowPlaylistRequest,
	UserFollowUsersRequest,
	UserUnfollowArtistsRequest,
	UserUnfollowPlaylistRequest,
	UserUnfollowUsersRequest,
} from "@schemas/services/user";
import type {
	CheckSavedShowRequest,
	GetSeveralShowRequest,
	GetShowEpisodeRequest,
	GetShowRequest,
	RemoveShowRequest,
	SaveShowRequest,
} from "@schemas/services/show";
import type { SearchRequest } from "@schemas/services/search";
import type {
	AddPlaylistItemRequest,
	AddPlaylistCoverImageRequest,
	ChangeDetailsRequest,
	CreatePlaylistRequest,
	GetPlaylistCoverImageRequest,
	GetPlaylistItemRequest,
	GetPlaylistRequest,
	GetUserPlaylistRequest,
	RemovePlaylistItemRequest,
	UpdatePlaylistItemRequest,
} from "@schemas/services/playlist";

type AppServices =
	| AlbumService
	| ArtistService
	| AudiobookService
	| CategoryService
	| ChapterService
	| EpisodeService
	| MarketService
	| PlayerService
	| PlaylistService
	| SearchService
	| ShowService
	| TrackService
	| UserService
	| AuthService;

class BetterMusicClient {
	private readonly runtime: ManagedRuntime.ManagedRuntime<
		AppServices,
		ConfigError | PlatformError
	>;

	constructor(
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
		this.runtime = ManagedRuntime.make(appLayer);
	}

	private async run<A, E>(
		effect: Effect.Effect<A, E, AppServices>,
	): Promise<A> {
		const exit = await this.runtime.runPromiseExit(effect);

		if (Exit.isSuccess(exit)) {
			return exit.value;
		}

		throw Cause.squash(exit.cause);
	}

	get album() {
		return {
			get: (request: GetAlbumRequest, options?: MarketOnlyOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* AlbumService;
						return yield* s.get(request, options);
					}),
				),
			getMany: (request: GetSeveralAlbumRequest, options?: MarketOnlyOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* AlbumService;
						return yield* s.getMany(request, options);
					}),
				),
			getTracks: (
				request: GetAlbumTracksRequest,
				options?: PaginatedMarketOptions,
			) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* AlbumService;
						return yield* s.getTracks(request, options);
					}),
				),
			getSaved: (options?: PaginatedMarketOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* AlbumService;
						return yield* s.getSaved(options);
					}),
				),
			save: (request: SaveAlbumRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* AlbumService;
						return yield* s.save(request);
					}),
				),
			remove: (request: RemoveAlbumRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* AlbumService;
						return yield* s.remove(request);
					}),
				),
			checkSaved: (request: CheckSavedAlbumRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* AlbumService;
						return yield* s.checkSaved(request);
					}),
				),
			getNewReleases: (options?: PaginationOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* AlbumService;
						return yield* s.getNewReleases(options);
					}),
				),
		};
	}
	get artist() {
		return {
			get: (request: GetArtistRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* ArtistService;
						return yield* s.get(request);
					}),
				),
			getMany: (request: GetSeveralArtistRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* ArtistService;
						return yield* s.getMany(request);
					}),
				),
			getAlbums: (
				request: GetArtistAlbumRequest,
				options?: AlbumRetrievalOptions,
			) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* ArtistService;
						return yield* s.getAlbums(request, options);
					}),
				),
			getTopTracks: (
				request: GetArtistTopTracksRequest,
				options?: MarketOnlyOptions,
			) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* ArtistService;
						return yield* s.getTopTracks(request, options);
					}),
				),
		};
	}
	get audiobook() {
		return {
			get: (request: GetAudiobookRequest, options?: MarketOnlyOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* AudiobookService;
						return yield* s.get(request, options);
					}),
				),
			getMany: (
				request: GetSeveralAudiobookRequest,
				options?: MarketOnlyOptions,
			) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* AudiobookService;
						return yield* s.getMany(request, options);
					}),
				),
			getChapters: (
				request: GetAudiobookChapterRequest,
				options?: PaginatedMarketOptions,
			) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* AudiobookService;
						return yield* s.getChapters(request, options);
					}),
				),
			getSaved: (options?: PaginationOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* AudiobookService;
						return yield* s.getSaved(options);
					}),
				),
			save: (request: SaveAudiobookRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* AudiobookService;
						return yield* s.save(request);
					}),
				),
			remove: (request: RemoveAudiobookRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* AudiobookService;
						return yield* s.remove(request);
					}),
				),
			checkSaved: (request: CheckSavedAudiobookRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* AudiobookService;
						return yield* s.checkSaved(request);
					}),
				),
		};
	}
	get category() {
		return {
			get: (request: GetCategoryRequest, options?: LocaleOnlyOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* CategoryService;
						return yield* s.get(request, options);
					}),
				),
			getMany: (options?: LocalizedPaginationOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* CategoryService;
						return yield* s.getMany(options);
					}),
				),
		};
	}
	get chapter() {
		return {
			get: (request: GetChapterRequest, options?: MarketOnlyOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* ChapterService;
						return yield* s.get(request, options);
					}),
				),
			getMany: (
				request: GetSeveralChapterRequest,
				options?: MarketOnlyOptions,
			) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* ChapterService;
						return yield* s.getMany(request, options);
					}),
				),
		};
	}
	get episode() {
		return {
			get: (request: GetEpisodeRequest, options?: MarketOnlyOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* EpisodeService;
						return yield* s.get(request, options);
					}),
				),
			getMany: (
				request: GetSeveralEpisodeRequest,
				options?: MarketOnlyOptions,
			) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* EpisodeService;
						return yield* s.getMany(request, options);
					}),
				),
			getSaved: (options?: PaginatedMarketOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* EpisodeService;
						return yield* s.getSaved(options);
					}),
				),
			save: (request: SaveEpisodeRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* EpisodeService;
						return yield* s.save(request);
					}),
				),
			remove: (request: RemoveEpisodeRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* EpisodeService;
						return yield* s.remove(request);
					}),
				),
			checkSaved: (request: CheckSavedEpisodeRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* EpisodeService;
						return yield* s.checkSaved(request);
					}),
				),
		};
	}
	get market() {
		return {
			getAll: () =>
				this.run(
					Effect.gen(function* () {
						const s = yield* MarketService;
						return yield* s.getAll();
					}),
				),
		};
	}
	get player() {
		return {
			getPlaybackState: (options?: MarketAdditionalTypesOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlayerService;
						return yield* s.getPlaybackState(options);
					}),
				),
			transferPlayback: (request: TransferPlaybackRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlayerService;
						return yield* s.transferPlayback(request);
					}),
				),
			getDevices: () =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlayerService;
						return yield* s.getDevices();
					}),
				),
			getCurrentlyPlaying: (options?: MarketAdditionalTypesOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlayerService;
						return yield* s.getCurrentlyPlaying(options);
					}),
				),
			startOrResumePlayback: (request: StartOrResumePlaybackRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlayerService;
						return yield* s.startOrResumePlayback(request);
					}),
				),
			pausePlayback: (request: PausePlaybackRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlayerService;
						return yield* s.pausePlayback(request);
					}),
				),
			skipToNext: (request: SkipToNextRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlayerService;
						return yield* s.skipToNext(request);
					}),
				),
			skipToPrevious: (request: SkipToPreviousRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlayerService;
						return yield* s.skipToPrevious(request);
					}),
				),
			seekToPosition: (request: SeekToPositionRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlayerService;
						return yield* s.seekToPosition(request);
					}),
				),
			setRepeatMode: (request: SetRepeatModeRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlayerService;
						return yield* s.setRepeatMode(request);
					}),
				),
			setPlaybackVolume: (request: SetPlaybackVolumeRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlayerService;
						return yield* s.setPlaybackVolume(request);
					}),
				),
			togglePlaybackShuffle: (request: TogglePlaybackShuffleRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlayerService;
						return yield* s.togglePlaybackShuffle(request);
					}),
				),
			getRecentlyPlayed: (options?: DateRangeOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlayerService;
						return yield* s.getRecentlyPlayed(options);
					}),
				),
			getQueue: () =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlayerService;
						return yield* s.getQueue();
					}),
				),
			addToPlaybackQueue: (request: AddToPlaybackQueueRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlayerService;
						return yield* s.addToPlaybackQueue(request);
					}),
				),
		};
	}
	get playlist() {
		return {
			get: (request: GetPlaylistRequest, options?: MarketFieldOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlaylistService;
						return yield* s.get(request, options);
					}),
				),
			changeDetails: (request: ChangeDetailsRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlaylistService;
						return yield* s.changeDetails(request);
					}),
				),
			getItems: (
				request: GetPlaylistItemRequest,
				options?: DetailedMarketPaginationOptions,
			) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlaylistService;
						return yield* s.getItems(request, options);
					}),
				),
			updateItems: (request: UpdatePlaylistItemRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlaylistService;
						return yield* s.updateItems(request);
					}),
				),
			add: (request: AddPlaylistItemRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlaylistService;
						return yield* s.add(request);
					}),
				),
			remove: (request: RemovePlaylistItemRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlaylistService;
						return yield* s.remove(request);
					}),
				),
			getPlaylists: (options?: PaginationOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlaylistService;
						return yield* s.getPlaylists(options);
					}),
				),
			getUsersPlaylists: (
				request: GetUserPlaylistRequest,
				options?: PaginationOptions,
			) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlaylistService;
						return yield* s.getUsersPlaylists(request, options);
					}),
				),
			create: (request: CreatePlaylistRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlaylistService;
						return yield* s.create(request);
					}),
				),
			getCoverImage: (request: GetPlaylistCoverImageRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlaylistService;
						return yield* s.getCoverImage(request);
					}),
				),
			addCustomCoverImage: (request: AddPlaylistCoverImageRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* PlaylistService;
						return yield* s.addCustomCoverImage(request);
					}),
				),
		};
	}
	get search() {
		return {
			query: (request: SearchRequest, options?: MarketExternalOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* SearchService;
						return yield* s.query(request, options);
					}),
				),
		};
	}
	get show() {
		return {
			get: (request: GetShowRequest, options?: MarketOnlyOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* ShowService;
						return yield* s.get(request, options);
					}),
				),
			getMany: (request: GetSeveralShowRequest, options?: MarketOnlyOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* ShowService;
						return yield* s.getMany(request, options);
					}),
				),
			getEpisodes: (
				request: GetShowEpisodeRequest,
				options?: PaginatedMarketOptions,
			) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* ShowService;
						return yield* s.getEpisodes(request, options);
					}),
				),
			getSaved: (options?: PaginationOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* ShowService;
						return yield* s.getSaved(options);
					}),
				),
			save: (request: SaveShowRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* ShowService;
						return yield* s.save(request);
					}),
				),
			remove: (request: RemoveShowRequest, options?: MarketOnlyOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* ShowService;
						return yield* s.remove(request, options);
					}),
				),
			checkSaved: (request: CheckSavedShowRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* ShowService;
						return yield* s.checkSaved(request);
					}),
				),
		};
	}
	get track() {
		return {
			get: (request: GetTrackRequest, options?: MarketOnlyOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* TrackService;
						return yield* s.get(request, options);
					}),
				),
			getMany: (request: GetSeveralTrackRequest, options?: MarketOnlyOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* TrackService;
						return yield* s.getMany(request, options);
					}),
				),
			getSaved: (options?: PaginatedMarketOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* TrackService;
						return yield* s.getSaved(options);
					}),
				),
			save: (request: SaveTrackRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* TrackService;
						return yield* s.save(request);
					}),
				),
			remove: (request: RemoveTrackRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* TrackService;
						return yield* s.remove(request);
					}),
				),
			checkSaved: (request: CheckSavedTrackRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* TrackService;
						return yield* s.checkSaved(request);
					}),
				),
		};
	}
	get user() {
		return {
			getCurrentUser: () =>
				this.run(
					Effect.gen(function* () {
						const s = yield* UserService;
						return yield* s.getCurrentUser();
					}),
				),
			getTopArtists: (options?: TimeRangePaginationOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* UserService;
						return yield* s.getTopArtists(options);
					}),
				),
			getTopTracks: (options?: TimeRangePaginationOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* UserService;
						return yield* s.getTopTracks(options);
					}),
				),
			getUser: (request: GetUserProfileRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* UserService;
						return yield* s.getUser(request);
					}),
				),
			followPlaylist: (request: UserFollowPlaylistRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* UserService;
						return yield* s.followPlaylist(request);
					}),
				),
			unfollowPlaylist: (request: UserUnfollowPlaylistRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* UserService;
						return yield* s.unfollowPlaylist(request);
					}),
				),
			getFollowedArtists: (options?: AfterBasedPaginationOptions) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* UserService;
						return yield* s.getFollowedArtists(options);
					}),
				),
			followArtists: (request: UserFollowArtistsRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* UserService;
						return yield* s.followArtists(request);
					}),
				),
			followUsers: (request: UserFollowUsersRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* UserService;
						return yield* s.followUsers(request);
					}),
				),
			unfollowArtists: (request: UserUnfollowArtistsRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* UserService;
						return yield* s.unfollowArtists(request);
					}),
				),
			unfollowUsers: (request: UserUnfollowUsersRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* UserService;
						return yield* s.unfollowUsers(request);
					}),
				),
			isFollowingArtists: (request: IsFollowingArtistsRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* UserService;
						return yield* s.isFollowingArtists(request);
					}),
				),
			isFollowingUsers: (request: IsFollowingUsersRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* UserService;
						return yield* s.isFollowingUsers(request);
					}),
				),
			isFollowingPlaylist: (request: IsFollowingPlaylistRequest) =>
				this.run(
					Effect.gen(function* () {
						const s = yield* UserService;
						return yield* s.isFollowingPlaylist(request);
					}),
				),
		};
	}
}

export const BetterMusic = {
	withClientCredentials(adapter: StorageAdapter) {
		return new BetterMusicClient(makeClientCredentialsAuth(adapter));
	},
	withPKCE(adapter: StorageAdapter, scopes: Scopes[]) {
		scopes = [...new Set(scopes)];
		const layer = makePKCEAuth(adapter, scopes);
		const runtime = ManagedRuntime.make(layer);

		return {
			auth: {
				getAuthorizationUrl: () =>
					runtime.runPromise(
						Effect.gen(function* () {
							const pkce = yield* PKCEService;
							return yield* pkce.getAuthorizationUrl;
						}),
					),
				exchangeCodeForTokens: (params: { code: string; state: string }) =>
					runtime.runPromise(
						Effect.gen(function* () {
							const pkce = yield* PKCEService;
							return yield* pkce.exchangeCodeForTokens(params);
						}),
					),
			},
			client: new BetterMusicClient(layer),
		};
	},
};
