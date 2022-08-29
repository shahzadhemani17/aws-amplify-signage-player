import React, { Fragment, useEffect } from "react";
import { EmptyPlayer, SKPlayer } from "@playerComponents/index";
import { getPlaylistEntries } from "./helpers/player.helper";

export const Player = ({ playlistData }: any) => {
  const response = getPlaylistEntries(playlistData);
  return (
    <Fragment>
      {playlistData.data.entries && playlistData.data.entries.length ? (
        <SKPlayer entries={response.convertedPlaylist} />
      ) : (
        <EmptyPlayer message={response.message} />
      )}
    </Fragment>
  );
};
