export interface IBaseArgsRaw {
  url: string;
  params: Record<string, unknown>;
  type: string;
  method: 'GET' | 'POST' | 'DELETE';
  additionalHeaders: Record<string, unknown>;
  setParamsAsFormData: boolean;
  paramsBuilder: () => IBaseArgs;
}

export type IBaseArgs = Readonly<Partial<IBaseArgsRaw>>;

export interface IPlaylist {
  uuid: string;
  title: string;
  numberOfTracks: number;
  numberOfVideos: number;
  creator: Creator;
  description: string;
  duration: number;
  lastUpdated: string;
  created: string;
  type: string;
  publicPlaylist: boolean;
  url: string;
  image: string;
  popularity: number;
  squareImage: string;
  promotedArtists?: PromotedArtistsEntity[] | null;
  lastItemAddedAt: string;
  isDuplicate?: boolean;
  devID?: string;
}

export interface IPlaylistItem {
  id: number;
  title: string;
  duration: number;
  replayGain: number;
  peak: number;
  allowStreaming: boolean;
  streamReady: boolean;
  streamStartDate: string;
  premiumStreamingOnly: boolean;
  trackNumber: number;
  volumeNumber: number;
  version?: null;
  popularity: number;
  copyright: string;
  description?: null;
  url: string;
  isrc: string;
  editable: boolean;
  explicit: boolean;
  audioQuality: string;
  audioModes?: string[] | null;
  artist: ArtistsEntityOrArtist;
  artists?: ArtistsEntityOrArtist[] | null;
  album: Album;
  mixes: Mixes;
  dateAdded: string;
  index: number;
  itemUuid: string;
}

export interface ArtistsEntityOrArtist {
  id: number;
  name: string;
  type: string;
}
export interface Album {
  id: number;
  title: string;
  cover: string;
  videoCover?: null;
  releaseDate: string;
}
export interface Mixes {
  MASTER_TRACK_MIX: string;
  TRACK_MIX: string;
}

export interface Creator {
  id: number;
  name: string;
  type?: null;
}
export interface PromotedArtistsEntity {
  id: number;
  name: string;
  type: string;
}
