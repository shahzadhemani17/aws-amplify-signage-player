import React, { useEffect, useState } from "react";
import { HtmlEnum, EntryPlayerModel } from "@models/playerModel";
import {
  SKImage,
  SKIframe,
  SKVideo,
} from "@playerComponents/SKPlayer/components/index";

export const EntryPlayer = ({
  entry,
  transition,
  vidRef,
  index
}: EntryPlayerModel) => {

  if (entry && entry.entryType === "vengo") {
    console.log("Client: Vengo Entry", entry);
    entry = entry?.vengoEntry;
  }  

  switch (entry?.tag) {
    case HtmlEnum.VIDEO:
      return (
        <SKVideo
          videoRef={vidRef}
          playlistEntry={entry}
          index={index}
          transition={transition}
          key={index}
        />
      );
    case HtmlEnum.iFRAME:
      return (
        <SKIframe
          playlistEntry={entry}
          index={index}
          transition={transition}
          key={index}
          // entry={originalEntries.find((entryObj) => entryObj.id === entry.id)}
        />
      );
    default:
      return (
        <SKImage
          playlistEntry={entry}
          index={index}
          transition={transition}
          key={index}
        />
      );
  };
};
