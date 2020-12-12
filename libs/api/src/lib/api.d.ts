export interface IBaseArgsRaw {
  url: string;
  params: Record<string, unknown>;
  type: string;
  method: 'GET' | 'POST';
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
