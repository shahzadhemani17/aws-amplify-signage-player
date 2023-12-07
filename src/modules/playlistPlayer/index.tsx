import React, { useState } from "react";
import { convertJSON } from "../player/helpers/player.helper";
import "reflect-metadata";
import { PlaylistModel } from "../../../models/playlist.model";
import { plainToInstance } from "class-transformer";
import SamplePlayerContainer from "../../SamplePlayerContainer";

export const PlaylistPlayer = ({ playlistData }: any) => {
  const [playlistDetails] = useState(
    plainToInstance(PlaylistModel, playlistData?.data)
  );

  const [convertedEntries] = useState(convertJSON(playlistDetails));

  return <SamplePlayerContainer entries={convertedEntries} />;
};
