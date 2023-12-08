import { getPlaylistData, getScreenDetails } from "lib/scoop.repo";
import CryptoJS from "crypto-js";
import { plainToInstance } from "class-transformer";
import { ScreenModel } from "@models/screen.model";
import { PlaylistModel } from "@models/playlist.model";
import moment from "moment-timezone";
import { isPlaylistValidMessage } from "src/modules/player/helpers/player.helper";
import { ErrorTypes } from "pages";
import { labels } from "@playerComponents/labels";

export const getScreenDetailsById = async (screenId, backendUrl) => {
  const localScreenDetails = localStorage.getItem("screenDetail");
  const screenDetailResponse = await getScreenDetails(screenId, backendUrl);
  const screenResponse = await screenDetailResponse.json();
  const screenDetail = screenResponse.data;
  const screenDetailObj: any = plainToInstance(ScreenModel, screenDetail);
  if (
    localScreenDetails &&
    localScreenDetails !== JSON.stringify(screenDetailObj)
  ) {
    const parsedScreenDetail = JSON.parse(localScreenDetails as string);
    if (parsedScreenDetail.playlistId !== screenDetailObj.playlistId) {
      window.location.reload();
    }
  }
  if (screenDetailObj.playlistId) {
    const playlistDataRsponse = await getPlaylistData(
      screenDetailObj?.playlistId ?? screenDetailObj?.data?.playlist_id,
      backendUrl,
      screenId
    );
    const playlistResponse = await playlistDataRsponse.json();
    const playlistDetailObj = plainToInstance(PlaylistModel, playlistResponse);

    const playlistHash = localStorage.getItem("playlistHash");

    if (
      playlistHash !==
      CryptoJS.SHA256(JSON.stringify(playlistDetailObj)).toString()
    ) {
      localStorage?.setItem(
        "playlistHash",
        CryptoJS.SHA256(JSON.stringify(playlistDetailObj)).toString()
      );
      window.location.reload();
    }
  }
  return screenDetailObj;
};

export const showScreenMessage = (isScreenOn: boolean, screenOnTime: string, screenOffTime: string) => {
  return !isScreenOn &&
  ((screenOnTime && screenOffTime) ||
    (screenOnTime && !screenOffTime) ||
    (!screenOnTime && screenOffTime))
}

export const showPlayerMessage = (screenDetail: ScreenModel, playlistDetails: PlaylistModel, isScreenOn) => {
  let message = "";
  const {screenOnTime, screenOffTime} = screenDetail;
  if (
    showScreenMessage(isScreenOn, screenOnTime, screenOffTime)
  ) {
    message = screenOnTime && screenOffTime ? `Screen On/Off: ${moment(screenOnTime, "h:mm:ss").format("HH:mm")} to ${moment(screenOffTime, "h:mm:ss").format("HH:mm")}` : labels.setScreenOnOffTime;
    return message;
  }
  message = isPlaylistValidMessage(playlistDetails);
  return message;
};

export const showSplashScreen = (playlistDetails: PlaylistModel, notAttachedMessage: any) => {
  const noPlaylistAttached = ErrorTypes.Playlist_Not_Attached_Error === notAttachedMessage;
  const noEntriesFound = !playlistDetails.entries || playlistDetails.entries?.length === 0;
  return noPlaylistAttached || noEntriesFound;
}


export const setLocalStorageForScreenPlayer = (playlistToSave: PlaylistModel, screenData: ScreenModel) => {
  const sha256Hash = CryptoJS.SHA256(
    JSON.stringify(playlistToSave)
  ).toString();
  localStorage?.setItem("playlistHash", sha256Hash);
  screenData &&
  localStorage?.setItem("screenDetail", JSON.stringify(screenData));
}