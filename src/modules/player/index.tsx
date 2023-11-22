import React, { Fragment, useEffect, useState } from "react";
import { EmptyPlayer, SKPlayer, SplashScreen } from "@playerComponents/index";
import {
  getPlaylistEntries,
  isScreenScheduleValid,
  uplodPulse,
} from "./helpers/player.helper";
import { ErrorTypes } from "../../../pages";
import InlineWorker from "../../../lib/InlineWorker";
import { getPlaylistData, getScreenDetails } from "lib/scoop.repo";
import CryptoJS from 'crypto-js';

export const Player = ({ playlistData, screenData, screenId, backendUrl }: any) => {
  console.log("PLAYER PLAYLISTdATA", playlistData, screenData);
  let screenDetail = screenData?.data;
  const [screenRefreshDuration, setScreenRefreshDuration] = useState(screenDetail?.refresh_duration);
  const [isScreenOn, setScreenToOn] = useState(isScreenScheduleValid(screenDetail.screen_on_time, screenDetail.screen_off_time));
  const [screenDetailData, setScreenDetailData] = useState(screenDetail);

  const refreshScreenDataAfterDuration = async () => {
    const localScreenDetails = localStorage.getItem("screenDetail");
    const screenDetailResponse = await getScreenDetails(
      screenId,
      backendUrl
    );
    const screenResponse = await screenDetailResponse.json();
    const screenDetail = screenResponse.data;
    setScreenDetailData(screenDetail);
    setScreenRefreshDuration(screenDetail.refresh_duration);
    setScreenToOn(isScreenScheduleValid(screenDetail.screen_on_time, screenDetail.screen_off_time))
    if (localScreenDetails !== JSON.stringify(screenDetail)) {
      const parsedScreenDetail = JSON.parse(localScreenDetails as string);
      if (parsedScreenDetail.playlist_id !== screenDetail.playlist_id) {
        window.location.reload();
      }
    }
    const playlistDataRsponse = await getPlaylistData(
      screenDetail?.playlist_id ?? screenDetail?.data?.playlist_id,
      backendUrl
    );
    const playlistResponse = await playlistDataRsponse.json();

    const playlistHash = localStorage.getItem("playlistHash");

    if (playlistHash !== CryptoJS.SHA256(JSON.stringify(playlistResponse)).toString()) {
      window.location.reload();
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
  }, [screenRefreshDuration]);

  const response = getPlaylistEntries(playlistData);

  useEffect(() => {
    if (window.Worker && navigator.onLine && screenId) {
      screenId && new InlineWorker(uplodPulse(screenId, backendUrl));
    }
    const sha256Hash = CryptoJS.SHA256(JSON.stringify(playlistData.data)).toString();
    localStorage?.setItem("playlistHash", sha256Hash);
    localStorage?.setItem("screenDetail", JSON.stringify(screenData.data));
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
          isScreenOn={isScreenOn}
          setScreenToOn={setScreenToOn}
        />
      ) : (
        <EmptyPlayer message={response.message} />
      )}
    </Fragment>
  );
};
