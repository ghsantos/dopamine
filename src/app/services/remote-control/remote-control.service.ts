import { Injectable, Type } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BasePlaybackService } from '../playback/base-playback.service';
import { PlaybackStarted } from '../playback/playback-started';
import { Logger } from '../../common/logger';
import { BaseRemoteControlService } from './base-remote-control.service';


@Injectable()
export class RemoteControlService implements BaseRemoteControlService {

  constructor(
    private socket: Socket,
    private playbackService: BasePlaybackService,
    private logger: Logger
  ) {
    
  }

  private currentTrack = {
    isPlaying: false,
    artist: '',
    trackTitle: '',
    albumTitle: '',
  }

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
    playbackStarted.currentTrack

    this.currentTrack = {
      isPlaying: true,
      artist: playbackStarted.currentTrack.rawFirstArtist,
      trackTitle: playbackStarted.currentTrack.rawTitle,
      albumTitle: playbackStarted.currentTrack.rawAlbumTitle,
    }

    this.sendTrackState()
  }

  private onTogglePlayback(isPlaying: boolean) {
    this.currentTrack = {
      ...this.currentTrack,
      isPlaying,
    }

    this.sendTrackState()
  }

  private sendTrackState() {
    this.socket.emit('trackstate', this.currentTrack)
  }
}
