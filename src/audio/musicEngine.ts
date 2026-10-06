/**
 * Audio Engine & Jukebox for Estación Versalles
 * Clean multi-track sequential and on-demand player for all official game soundtracks.
 */

export interface SoundtrackTrack {
  id: string;
  title: string;
  subtitle: string;
  file: string;
  theme: string;
  estimatedDuration: string;
}

export const STATION_PLAYLIST: SoundtrackTrack[] = [
  {
    id: 'locked-pressure',
    title: 'Locked Pressure Chamber',
    subtitle: 'Tema Principal de la Estación',
    file: '/assets/Locked_Pressure_Chamber.mp3',
    theme: 'Atmósfera de Confinamiento y Fusión Nuclear',
    estimatedDuration: '02:36',
  },
  {
    id: 'beautiful-void',
    title: 'Beautiful Void',
    subtitle: 'Navegación Espacial Profunda',
    file: '/assets/Beautiful Void.mp3',
    theme: 'Exploración Orbital y Silencio Cósmico',
    estimatedDuration: '03:18',
  },
  {
    id: 'deep-space-arpeggio',
    title: 'Deep Space Arpeggio',
    subtitle: 'Cómputo Cuántico y Telemetría',
    file: '/assets/Deep Space Arpeggio.mp3',
    theme: 'Arpegios Sintetizados y Lógica Booleana',
    estimatedDuration: '02:54',
  },
  {
    id: 'deep-space-scan',
    title: 'Deep Space Scan',
    subtitle: 'Guerra Electrónica & Radar',
    file: '/assets/Deep Space Scan.mp3',
    theme: 'Escaneo de Frecuencias y Detección de Amenazas',
    estimatedDuration: '02:45',
  },
  {
    id: 'evolution-machine',
    title: 'Evolution of the Machine',
    subtitle: 'Operaciones de Combate e IA',
    file: '/assets/Evolution of the Machine.mp3',
    theme: 'Sincronización Autómata y Hangar de Cazas',
    estimatedDuration: '03:32',
  },
];

class SpaceMusicEngine {
  private audioElement: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.55;
  private currentTrackIndex: number = 0;
  private listeners: Array<() => void> = [];
  private trackChangeListeners: Array<(track: SoundtrackTrack, index: number) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.audioElement.loop = false; // We advance to next track when song finishes!
      this.audioElement.volume = this.volume;

      // Handle track ending: automatically play next track in playlist loop
      this.audioElement.addEventListener('ended', () => {
        this.nextTrack(true);
      });

      // Load initial track
      const initialTrack = STATION_PLAYLIST[0];
      this.audioElement.src = initialTrack.file;
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      const idx = this.listeners.indexOf(listener);
      if (idx !== -1) this.listeners.splice(idx, 1);
    };
  }

  public onTrackChange(callback: (track: SoundtrackTrack, index: number) => void) {
    this.trackChangeListeners.push(callback);
    return () => {
      const idx = this.trackChangeListeners.indexOf(callback);
      if (idx !== -1) this.trackChangeListeners.splice(idx, 1);
    };
  }

  private notify() {
    this.listeners.forEach(l => {
      try { l(); } catch {}
    });
  }

  private notifyTrackChange() {
    const track = this.getCurrentTrack();
    this.trackChangeListeners.forEach(cb => {
      try { cb(track, this.currentTrackIndex); } catch {}
    });
    this.notify();
  }

  public getPlaylist(): SoundtrackTrack[] {
    return STATION_PLAYLIST;
  }

  public getCurrentTrack(): SoundtrackTrack {
    return STATION_PLAYLIST[this.currentTrackIndex] || STATION_PLAYLIST[0];
  }

  public getCurrentIndex(): number {
    return this.currentTrackIndex;
  }

  public playTrack(target: number | string, autoPlay = true) {
    let index = typeof target === 'number' 
      ? target 
      : STATION_PLAYLIST.findIndex(t => t.id === target || t.title.toLowerCase() === target.toLowerCase());

    if (index < 0 || index >= STATION_PLAYLIST.length) {
      index = 0;
    }

    this.currentTrackIndex = index;
    const track = STATION_PLAYLIST[index];

    if (this.audioElement) {
      this.audioElement.src = track.file;
      this.audioElement.load();
      if (autoPlay && !this.isMuted) {
        this.play();
      }
    }

    this.notifyTrackChange();
  }

  public nextTrack(autoPlay = true) {
    const nextIdx = (this.currentTrackIndex + 1) % STATION_PLAYLIST.length;
    this.playTrack(nextIdx, autoPlay);
  }

  public prevTrack(autoPlay = true) {
    const prevIdx = (this.currentTrackIndex - 1 + STATION_PLAYLIST.length) % STATION_PLAYLIST.length;
    this.playTrack(prevIdx, autoPlay);
  }

  public play(): boolean {
    if (!this.audioElement) {
      this.isPlaying = false;
      return false;
    }

    if (!this.audioElement.src || this.audioElement.src === '') {
      this.audioElement.src = this.getCurrentTrack().file;
    }

    this.audioElement.play().then(() => {
      this.isPlaying = true;
      this.notify();
    }).catch(err => {
      console.warn('Audio playback waiting for user interaction:', err);
    });
    return this.isPlaying;
  }

  public pause() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.isPlaying = false;
    this.notify();
  }

  public stop() {
    this.pause();
    if (this.audioElement) {
      this.audioElement.currentTime = 0;
    }
  }

  public start() {
    this.play();
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.audioElement) {
      this.audioElement.muted = muted;
    }
    if (muted && this.isPlaying) {
      this.pause();
    }
    this.notify();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
    this.notify();
  }

  public hasCustomTrack(): boolean {
    return true;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setTension(_tense: boolean) {
    // Sound tracks play cleanly without distortion
  }

  public setTrack(_track: string) {
    // Retained for API compatibility
  }
}

export const musicEngine = new SpaceMusicEngine();
