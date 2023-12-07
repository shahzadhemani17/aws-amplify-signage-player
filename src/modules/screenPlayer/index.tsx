import React, { Fragment, useEffect, useState } from "react";
import { EmptyPlayer, SKPlayer, SplashScreen } from "@playerComponents/index";
import {
  convertJSON,
  getDifferenceOfOnOffTimeByCurrentTime,
  getPlaylistEntries,
  isScreenScheduleValid,
  uplodPulse,
} from "../player/helpers/player.helper";
import moment from "moment-timezone";
import { ScreenModel } from "../../../models/screen.model";
import "reflect-metadata";
import {
  PlaylistEntryModel,
  PlaylistModel,
} from "../../../models/playlist.model";
import { plainToInstance } from "class-transformer";
import SamplePlayer from "../../SamplePlayer";
import SamplePlayerContainer from "../../SamplePlayerContainer";
import { HtmlEnum, PlayerModel } from "../../../models/playerModel";
import { samplePlayerData } from "../../seed-data";
import { getScreenDetailsById, setLocalStorageForScreenPlayer } from "./helpers/screen.helper";

export const ScreenPlayer = ({
  playlistData,
  screenData,
  screenId,
  backendUrl,
}: any) => {
  const [playlistDetails] = useState(
    plainToInstance(PlaylistModel, playlistData?.data)
  );
  let playlistToSave = Object.assign(plainToInstance(PlaylistModel, playlistData?.data));


  console.log("playlistDetails.........0", playlistData?.data);

  console.log("playlistDetails.........1", playlistDetails);

  const [screenDetail, setScreenDetailData] = useState( plainToInstance(ScreenModel, screenData?.data));


  console.log("screenDetail.........1", screenDetail);

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


  if (screenId) {
    moment.tz.setDefault(screenDetail?.timezoneIdentifier);
  }

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

  // useEffect(() => {
  //   setRefreshDuration(screenRefreshDuration);
  //   const { offTimeDifference, onTimeDifference } =
  //     getDifferenceOfOnOffTimeByCurrentTime(
  //       screenDetail?.screenOffTime,
  //       screenDetail?.screenOnTime
  //     );
  //   // if screen off time is less than screenRefreshDuration than the refresh duration will be screen off time
  //   if (isScreenOn && screenDetail?.screenOffTime) {
  //     if (
  //       offTimeDifference &&
  //       offTimeDifference < screenRefreshDuration &&
  //       offTimeDifference > 0
  //     ) {
  //       // added one second delay
  //       setRefreshDuration(offTimeDifference + 1);
  //     }
  //   } else if (!isScreenOn && screenDetail?.screenOnTime) {
  //     if (
  //       onTimeDifference &&
  //       onTimeDifference < screenRefreshDuration &&
  //       onTimeDifference > 0
  //     ) {
  //       setRefreshDuration(onTimeDifference + 1);
  //     }
  //   }
  // }, [screenRefreshDuration]);

  // const response = getPlaylistEntries(playlistData);

  useEffect(() => {
    // if (window.Worker && navigator.onLine) {
      // new InlineWorker(uplodPulse(screenId, backendUrl));
      setLocalStorageForScreenPlayer(playlistToSave, screenDetail)
    // }
  }, []);

  //   return (
  //     <Fragment>
  //       {ErrorTypes.Playlist_Not_Attached_Error === playlistData.message ? (
  //         <SplashScreen />
  //       ) : playlistData.data.entries && playlistData.data.entries.length ? (
  //         <SKPlayer
  //           entries={response.convertedPlaylist}
  //           transition={response.transition}
  //           refresh_duration={response.refresh_duration}
  //           playlist_id={playlistData.data.id}
  //           screenId={screenId}
  //           screenOnTime={screenDetailData?.screenOnTime}
  //           screenOffTime={screenDetailData?.screenOffTime}
  //           screenRefreshDuration={screenRefreshDuration}
  //           backend_url={backendUrl}
  //           isScreenOn={isScreenOn}
  //           setScreenToOn={setScreenToOn}
  //           originalEntries={playlistData.data.entries}
  //         />
  //       ) : (
  //         <EmptyPlayer message={response.message} />
  //       )}
  //     </Fragment>
  //   );
  // };
  return (
    <SamplePlayerContainer
      entries={convertedEntries}
      vengoEntries={filterVengoIntegrationEntries(convertedEntries)}
    />
  );
};
