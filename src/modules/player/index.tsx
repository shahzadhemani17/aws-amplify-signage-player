import React, { Fragment, useEffect } from "react";
import { EmptyPlayer, SKPlayer } from "@playerComponents/index";
import { getPlaylistEntries } from "./helpers/player.helper";

export const Player = ({ playlistData, screenId }: any) => {
  const response = getPlaylistEntries(playlistData);
  return (
    <Fragment>
      {playlistData.data.entries && playlistData.data.entries.length ? (
        <SKPlayer
          entries={response.convertedPlaylist}
          transition={response.transition}
          refresh_duration={response.refresh_duration}
          playlist_id={playlistData.data.id}
          screen_id={screenId}
        />
      ) : (
        <EmptyPlayer message={response.message} />
      )}
    </Fragment>
  );
};
