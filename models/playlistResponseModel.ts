export enum ResponseType {
  SUCCESS = "success",
  ERROR = "error",
}

export interface PlaylistResponse {
  status: ResponseType;
  data: {
    entries: any[];
  };
}
