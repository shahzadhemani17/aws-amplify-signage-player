import React, { useEffect, useState } from "react";
import SamplePlayer from "./SamplePlayer";

import {
  convertVengoEntries,
  getVengoEntriesByIntegrations,
} from "./modules/player/helpers/player.helper";

const SamplePlayerContainer = ({ entries, vengoEntries }: any) => {
  const [playlistEntries, setPlaylistEntries] = useState(entries);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);

  console.log("entries.............8", entries);
  console.log("vengoEntries.............8", vengoEntries);

  useEffect(() => {
    if (currentEntryIndex === 0) {
      console.log("vengo-data 1", vengoEntries, currentEntryIndex);
      getVengoEntriesByIntegrations(vengoEntries).then((data) => {
        let dataArray = convertVengoEntries(data);
        if (dataArray?.length) {
          const entries1 = playlistEntries.map((entry1) => {
            if (entry1.entryType === "vengo") {
              const vengoEntry = dataArray?.find(
                (entry2) => entry2?.position === entry1?.position
              );
              console.log("vengoEntry", vengoEntry);
              entry1 = vengoEntry;

              if (vengoEntry?.url) {
                entry1.duration = vengoEntry?.duration;
              } else {
                entry1.duration = 0;
              }
            }
            return entry1;
          });
          setPlaylistEntries([...entries1]); // update state
        }
        console.log("vengo-data 2", data, dataArray);
      });
    }
    /*
      To avoid rendering with setPlaylistEntries dependency
      i've added eslint disbale next line
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEntryIndex, vengoEntries]);

  useEffect(() => {
    console.log("playlistEntries", playlistEntries);
    const interval = setInterval(() => {
      setCurrentEntryIndex(
        (prevIndex) => (prevIndex + 1) % playlistEntries.length
      );
    }, playlistEntries[currentEntryIndex]?.duration);

    return () => clearInterval(interval);
  }, [currentEntryIndex, playlistEntries]);

  return (
    <div>
      <SamplePlayer entry={playlistEntries[currentEntryIndex]} />
    </div>
  );
};

export default SamplePlayerContainer;
