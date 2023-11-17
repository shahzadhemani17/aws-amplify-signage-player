import React, { Fragment, useEffect } from "react";
import { EmptyPlayer, SKPlayer, SplashScreen } from "@playerComponents/index";
import {
  fetchScreenDetailsByDuration,
  getPlaylistEntries,
  uplodPulse,
} from "./helpers/player.helper";
import { ErrorTypes } from "../../../pages";
import InlineWorker from "../../../lib/InlineWorker";

export const Player = ({ playlistData, screenId, backendUrl }: any) => {
  console.log("PLAYER PLAYLISTdATA", playlistData);
  const response = getPlaylistEntries(playlistData);
  useEffect(() => {
    if (window.Worker && navigator.onLine && screenId) {
      screenId && new InlineWorker(uplodPulse(screenId, backendUrl));
    }
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
          screen_id={screenId}
          backend_url={backendUrl}
        />
      ) : (
        <EmptyPlayer message={response.message} />
      )}
    </Fragment>
  );
};
