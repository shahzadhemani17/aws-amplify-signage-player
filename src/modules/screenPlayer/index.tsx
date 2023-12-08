import React, { Fragment, useEffect, useState } from "react";
import { EmptyPlayer, SKPlayer, SplashScreen } from "@playerComponents/index";
import {
  convertJSON,
  getDifferenceOfOnOffTimeByCurrentTime,
  getPlaylistEntries,
  isPlaylistValidMessage,
  isScreenScheduleValid,
  uplodPulse
} from "../player/helpers/player.helper";
import moment from "moment-timezone";
import { ScreenModel } from "../../../models/screen.model";
import "reflect-metadata";
import {
  PlaylistEntryModel,
  PlaylistModel
} from "../../../models/playlist.model";
import { plainToInstance } from "class-transformer";
import SamplePlayer from "../../SamplePlayer";
import SamplePlayerContainer from "../../SamplePlayerContainer";
import { HtmlEnum, PlayerModel } from "../../../models/playerModel";
import { samplePlayerData } from "../../seed-data";
import {
  getScreenDetailsById,
  setLocalStorageForScreenPlayer,
  showPlayerMessage,
  showSplashScreen
} from "./helpers/screen.helper";

export const ScreenPlayer = ({
  playlistData,
  screenData,
  screenId,
  backendUrl,
  message,
}: any) => {

  const [playlistDetails] = useState(
    plainToInstance(PlaylistModel, playlistData?.data)
  );
  let playlistToSave = Object.assign(
    plainToInstance(PlaylistModel, playlistData?.data)
  );

  const [screenDetail, setScreenDetailData] = useState(
    plainToInstance(ScreenModel, screenData?.data)
  );

  moment.tz.setDefault(screenDetail?.timezoneIdentifier);

  const [screenRefreshDuration, setScreenRefreshDuration] = useState(
    screenDetail?.refreshDuration
  );

  const [convertedEntries] = useState(convertJSON(playlistDetails));

  const [refreshDuration, setRefreshDuration] = useState<number>(
    screenDetail?.refreshDuration
  );

  const [isScreenOn, setScreenToOn] = useState(
    isScreenScheduleValid(
      screenDetail?.screenOnTime,
      screenDetail?.screenOffTime
    )
  );

  const filterVengoIntegrationEntries = (entries: any) => {
    return entries.filter((entry) => {
      if (entry.tag === "vengo") {
        return entry;
      }
    });
  };

  const refreshScreenDataAfterDuration = async () => {
    const screenDetail = await getScreenDetailsById(screenId, backendUrl);
    setScreenDetailData(screenDetail);
    setScreenRefreshDuration(screenDetail.refreshDuration);
    setScreenToOn(
      isScreenScheduleValid(
        screenDetail.screenOnTime,
        screenDetail.screenOffTime
      )
    );
  };

  useEffect(() => {
    if (screenDetail) {
      const intervalId = setInterval(() => {
        refreshScreenDataAfterDuration();
      }, refreshDuration * 1000);
      return () => clearInterval(intervalId);
    }
  }, [refreshDuration]);

  useEffect(() => {
    setRefreshDuration(screenRefreshDuration);
    const { offTimeDifference, onTimeDifference } =
      getDifferenceOfOnOffTimeByCurrentTime(
        screenDetail?.screenOffTime,
        screenDetail?.screenOnTime
      );
    // if screen off time is less than screenRefreshDuration than the refresh duration will be screen off time
    if (isScreenOn && screenDetail?.screenOffTime) {
      if (
        offTimeDifference &&
        offTimeDifference < screenRefreshDuration &&
        offTimeDifference > 0
      ) {
        // added one second delay
        setRefreshDuration(offTimeDifference + 1);
      }
    } else if (!isScreenOn && screenDetail?.screenOnTime) {
      if (
        onTimeDifference &&
        onTimeDifference < screenRefreshDuration &&
        onTimeDifference > 0
      ) {
        setRefreshDuration(onTimeDifference + 1);
      }
    }
  }, [screenRefreshDuration]);

  // const response = getPlaylistEntries(playlistData);

  useEffect(() => {
    // if (window.Worker && navigator.onLine) {
    // new InlineWorker(uplodPulse(screenId, backendUrl));
    setLocalStorageForScreenPlayer(playlistToSave, screenDetail);
    // }
  }, []);

  return (
    <Fragment>
      { showSplashScreen(playlistDetails, playlistData.data.message) ? (
        <SplashScreen />
      ) : isScreenOn ? (
          <SamplePlayerContainer
          entries={convertedEntries}
          vengoEntries={filterVengoIntegrationEntries(convertedEntries)}
        />
      ) : (
        <EmptyPlayer message={showPlayerMessage(screenDetail, playlistDetails, isScreenOn)} />
      )}
    </Fragment>
  );
};
