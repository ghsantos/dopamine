import { Observable } from 'rxjs';
import { AlbumModel } from '../album/album-model';
import { ArtistModel } from '../artist/artist-model';
import { ArtistType } from '../artist/artist-type';
import { GenreModel } from '../genre/genre-model';
import { PlaylistModel } from '../playlist/playlist-model';
import { TrackModel } from '../track/track-model';
import { TrackModels } from '../track/track-models';
import { LoopMode } from './loop-mode';
import { PlaybackProgress } from './playback-progress';
import { PlaybackStarted } from './playback-started';

export abstract class PlaybackServiceBase {
    public abstract playbackQueue: TrackModels;
    public abstract hasPlaybackQueue: boolean;
    public abstract progressChanged$: Observable<PlaybackProgress>;
    public abstract playbackStarted$: Observable<PlaybackStarted>;
    public abstract playbackPaused$: Observable<void>;
    public abstract playbackResumed$: Observable<void>;
    public abstract playbackStopped$: Observable<void>;
    public abstract playbackSkipped$: Observable<void>;
    public abstract currentTrack: TrackModel | undefined;
    public abstract progress: PlaybackProgress;
    public abstract volume: number;
    public abstract loopMode: LoopMode;
    public abstract isShuffled: boolean;
    public abstract isPlaying: boolean;
    public abstract canPause: boolean;
    public abstract canResume: boolean;
    public abstract togglePlayback(): void;
    public abstract toggleLoopMode(): void;
    public abstract toggleIsShuffled(): void;
    public abstract forceShuffled(): void;
    public abstract enqueueAndPlayTracks(tracksToEnqueue: TrackModel[]): void;
    public abstract enqueueAndPlayTracksStartingFromGivenTrack(tracksToEnqueue: TrackModel[], trackToPlay: TrackModel): void;
    public abstract enqueueAndPlayArtist(artistToPlay: ArtistModel, artistType: ArtistType): void;
    public abstract enqueueAndPlayGenre(genreToPlay: GenreModel): void;
    public abstract enqueueAndPlayAlbum(albumToPlay: AlbumModel): void;
    public abstract enqueueAndPlayPlaylistAsync(playlistToPlay: PlaylistModel): Promise<void>;
    public abstract addTracksToQueueAsync(tracksToAdd: TrackModel[]): Promise<void>;
    public abstract addArtistToQueueAsync(artistToAdd: ArtistModel, artistType: ArtistType): Promise<void>;
    public abstract addGenreToQueueAsync(genreToAdd: GenreModel): Promise<void>;
    public abstract addAlbumToQueueAsync(albumToAdd: AlbumModel): Promise<void>;
    public abstract addPlaylistToQueueAsync(playlistToAdd: PlaylistModel): Promise<void>;
    public abstract removeFromQueue(tracksToRemove: TrackModel[]): void;
    public abstract playQueuedTrack(trackToPlay: TrackModel): void;
    public abstract playPrevious(): void;
    public abstract playNext(): void;
    public abstract skipByFractionOfTotalSeconds(fractionOfTotalSeconds: number): void;
    public abstract stopIfPlaying(track: TrackModel): void;
    public abstract pause(): void;
    public abstract resume(): void;
    public abstract toggleMute(): void;
    public abstract initializeAsync(): Promise<void>;
    public abstract saveQueue(): void;
}
