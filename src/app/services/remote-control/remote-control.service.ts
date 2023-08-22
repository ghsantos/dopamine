import { Injectable, Type } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BasePlaybackService } from '../playback/base-playback.service';
import { PlaybackStarted } from '../playback/playback-started';
import { Logger } from '../../common/logger';
import { BaseRemoteControlService } from './base-remote-control.service';
import { BasePlaybackInformationService } from '../playback-information/base-playback-information.service';
import { PlaybackInformation } from '../playback-information/playback-information';
import { PlaybackProgress } from '../playback/playback-progress';

const INITIAL_TRACK_STATE = {
  isPlaying: false,
  artist: '',
  trackTitle: '',
  albumTitle: '',
}

@Injectable()
export class RemoteControlService implements BaseRemoteControlService {

  constructor(
    private socket: Socket,
    private playbackService: BasePlaybackService,
    private playbackInformationService: BasePlaybackInformationService,
    private logger: Logger
  ) {
    
  }

  private currentTrack = INITIAL_TRACK_STATE

  public test() {
    // this.playbackService.playNext()
    this.logger.warn(`constructor`, 'RemoteControlService', 'onPlayPause')
    this.socket.on('playpause', () => this.onPlayPause())
    this.socket.on('next', () => this.onNext())
    this.socket.on('prev', () => this.onPrev())

    // this.playbackService.playbackResumed$.subscribe
    this.playbackService.playbackStarted$.subscribe((playbackStarted: PlaybackStarted) => this.onPlaybackStarted(playbackStarted))
    this.playbackService.playbackResumed$.subscribe(() => this.onTogglePlayback(true))
    this.playbackService.playbackPaused$.subscribe(() => this.onTogglePlayback(false))
    this.playbackService.playbackStopped$.subscribe(() => this.onPlaybackStopped())

    this.playbackService.progressChanged$.subscribe((playbackProgress: PlaybackProgress) => this.sendPlaybackProgress(playbackProgress))

    // this.playbackInformationService.playingPreviousTrack$.subscribe((playbackInformation: PlaybackInformation) => {
    //   // this.changeMetadata(playbackInformation);
    // })

    // this.sendTrackState()
  }

  private onPlayPause() {
    this.logger.warn(`onPlayPause`, 'RemoteControlService', 'onPlayPause')
    this.playbackService.togglePlayback()
  }

  private onNext() {
    this.logger.warn(`onNext`, 'RemoteControlService', 'onNext')
    this.playbackService.playNext()
  }

  private onPrev() {
    this.logger.warn(`onPrev`, 'RemoteControlService', 'onPrev')
    this.playbackService.playPrevious()
  }

  private onPlaybackStarted(playbackStarted: PlaybackStarted) {
    this.currentTrack = {
      isPlaying: true,
      artist: playbackStarted.currentTrack.rawFirstArtist,
      trackTitle: playbackStarted.currentTrack.rawTitle,
      albumTitle: playbackStarted.currentTrack.rawAlbumTitle,
    }

    this.sendTrackState()
    this.sendImageCover()
  }

  private onPlaybackStopped() {
    this.currentTrack = INITIAL_TRACK_STATE

    this.sendTrackState()
    // this.sendImageCover()
  }

  private onTogglePlayback(isPlaying: boolean) {
    this.currentTrack = {
      ...this.currentTrack,
      isPlaying,
    }

    this.sendTrackState()
  }

  private sendTrackState() {
    console.log(this.socket.ioSocket)
    
    this.socketEmit('trackstate', this.currentTrack)
  }
  
  private sendImageCover() {
    this.playbackInformationService.getCurrentPlaybackInformationAsync().then(value => {
      this.socketEmit('upload', value.imageUrl)
    })
  }

  private sendPlaybackProgress(playbackProgress: PlaybackProgress) {
    const progress = {
      progressPercent: playbackProgress.progressPercent,
      progressSeconds: playbackProgress.progressSeconds,
      totalSeconds: playbackProgress.totalSeconds
    }

    this.socketEmit('playbackprogress', progress)
  }

  private socketEmit(action: string, arg: any) {
    if (this.socket.ioSocket.connected) {
      this.socket.emit(action, arg)
    } else {
      this.logger.warn(`No socket connection available - ${action}`, 'RemoteControlService', 'socketEmit')
    }
  }
}
