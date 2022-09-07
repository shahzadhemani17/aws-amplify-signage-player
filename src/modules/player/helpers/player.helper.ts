import { HtmlEnum, PlayerModel } from "@models/playerModel";
import { ResponseType } from "@models/playlistResponseModel";
import { PlaylistMessages } from "../player.constant";

const populatePlayer = (
  duration: number,
  id: number,
  tag: string,
  url: string
) => {
  const player: PlayerModel = {
    id: id,
    tag: tag,
    url: url,
    duration: duration * 1000,
    visibility: false,
  };
  return player;
};

export const convertJSON = (playlist: any) => {
  const result: PlayerModel[] = [];
  playlist.entries.sort((a:any, b:any) => parseFloat(a.position) - parseFloat(b.position));
  playlist?.entries.map((entry: any) => {
    if (entry.is_web_url === true || entry.is_menu === true) {
      result.push(
        populatePlayer(
          entry.duration_in_seconds,
          entry.id,
          HtmlEnum.iFRAME,
          entry.weburl.url
        )
      );
    } else {
      entry.media.hash &&
        result.push(
          populatePlayer(
            entry.duration_in_seconds,
            entry.id,
            entry.media.content_type === "video"
              ? HtmlEnum.VIDEO
              : HtmlEnum.IMAGE,
            entry.media.hash
          )
        );
    }
  });
  return result;
};

export const getPlaylistEntries = (playlistData: any) => {
  let convertedPlaylist: PlayerModel[] = [];
  let message: string = "";

  if (playlistData.data.code === "not-found") {
    message = PlaylistMessages.PLAYLIST_NOT_EXISTS;
  } else if (
    Object.keys(playlistData.data).length === 0 &&
    playlistData.status === ResponseType.ERROR
  ) {
    message = PlaylistMessages.SOMETHING_WENT_WRONG;
  } else if (Object.keys(playlistData.data).length === 0) {
    message = PlaylistMessages.PROVIDE_PLAYLIST_ID;
  } else if (playlistData.data.entries.length !== 0) {
    convertedPlaylist = convertJSON(playlistData.data);
  } else {
    message = PlaylistMessages.ENTRIES_NOT_FOUND;
  }
  return { convertedPlaylist, message };
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
