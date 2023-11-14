import React, { Fragment, useEffect } from "react";
import { EmptyPlayer, SKPlayer, SplashScreen } from "@playerComponents/index";
import { getPlaylistEntries } from "./helpers/player.helper";

export const Player = ({ playlistData }: any) => {
  console.log("PLAYER PLAYLISTdATA", playlistData);
  const response = getPlaylistEntries(playlistData);
  return (
    <Fragment>
      <SplashScreen screenId="ABC123" />
      {/* {playlistData.data.entries && playlistData.data.entries.length ? (
        <SKPlayer
          entries={response.convertedPlaylist}
          transition={response.transition}
          refresh_duration={response.refresh_duration}
          playlist_id={playlistData.data.id}
        />
      ) : (
        <EmptyPlayer message={response.message} />
      )} */}
    </Fragment>
  );
};
