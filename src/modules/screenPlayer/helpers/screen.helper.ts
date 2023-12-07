import { getPlaylistData, getScreenDetails } from "lib/scoop.repo";
import CryptoJS from "crypto-js";
import { plainToInstance } from "class-transformer";
import { ScreenModel } from "@models/screen.model";
import { PlaylistModel } from "@models/playlist.model";

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

export const setLocalStorageForScreenPlayer = (playlistToSave: PlaylistModel, screenData: ScreenModel) => {
  const sha256Hash = CryptoJS.SHA256(
    JSON.stringify(playlistToSave)
  ).toString();
  localStorage?.setItem("playlistHash", sha256Hash);
  screenData &&
  localStorage?.setItem("screenDetail", JSON.stringify(screenData));
}