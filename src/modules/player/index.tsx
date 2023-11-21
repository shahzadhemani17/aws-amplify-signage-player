import React, { Fragment, useEffect, useState } from "react";
import { EmptyPlayer, SKPlayer, SplashScreen } from "@playerComponents/index";
import {
  getPlaylistEntries,
  uplodPulse,
} from "./helpers/player.helper";
import { ErrorTypes } from "../../../pages";
import InlineWorker from "../../../lib/InlineWorker";
import { getScreenDetails } from "lib/scoop.repo";
import CryptoJS from 'crypto-js';

export const Player = ({ playlistData, screenData, screenId, backendUrl }: any) => {
  console.log("PLAYER PLAYLISTdATA", playlistData, screenData);
  let screenDetail = screenData?.data;
  const [screenRefreshDuration, setScreenRefreshDuration] = useState(screenDetail?.refresh_duration);
  const [screenDetailData, setScreenDetailData] = useState(screenDetail);

  const refreshScreenDataAfterDuration = async () => {
    const localScreenDetails = localStorage.getItem("screenDetail");
    const screenDetailResponse = await getScreenDetails(
      screenId,
      backendUrl
    );
      const screenResponse = await screenDetailResponse.json();
      screenDetail = screenResponse.data;
    if (localScreenDetails !== JSON.stringify(screenDetail)) {
      const parsedScreenDetail = JSON.parse(localScreenDetails as string);
      if (parsedScreenDetail.playlist_id !== screenDetail.playlist_id) {
        window.location.reload();
      }
      setScreenDetailData(screenDetail);
      setScreenRefreshDuration(screenDetail.refresh_duration);
      localStorage.setItem("screenDetail", JSON.stringify(screenDetail));
    }
  }

  useEffect(() => {
    if (screenId) {
      const getScreenDetails = () => {
        const inlineWorker = new InlineWorker(
          refreshScreenDataAfterDuration()
        );
      };
  
      const intervalId = setInterval(() => {
        getScreenDetails();
      }, screenRefreshDuration * 1000);
  
      return () => clearInterval(intervalId);
    }
  }, []);


  const response = getPlaylistEntries(playlistData);

  useEffect(() => {
    if (window.Worker && navigator.onLine && screenId) {
      screenId && new InlineWorker(uplodPulse(screenId, backendUrl));
    }
    const sha256Hash = CryptoJS.SHA256(JSON.stringify(playlistData.data)).toString();
    localStorage?.setItem("playlistHash", sha256Hash);
  }, []);

  return (
    <Fragment>
      {ErrorTypes.Playlist_Not_Attached_Error === playlistData.message ? (
        <SplashScreen />
      ) : playlistData.data.entries && playlistData.data.entries.length ? (
        <SKPlayer
          entries={response.convertedPlaylist}
          transition={response.transition}
          refresh_duration={response.refresh_duration}
          playlist_id={playlistData.data.id}
          screenId={screenId}
          screenOnTime={screenDetailData?.screen_on_time}
          screenOffTime={screenDetailData?.screen_off_time}
          screenRefreshDuration={screenRefreshDuration}
          backend_url={backendUrl}
        />
      ) : (
        <EmptyPlayer message={response.message} />
      )}
    </Fragment>
  );
};
