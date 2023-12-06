import React, { useCallback, useEffect, useRef, useState } from "react";
import SamplePlayer from "./SamplePlayer";

import {
  getVengoEntriesByIntegrations,
  convertVengoEntries
} from "./modules/player/helpers/player.helper";
import { duration } from "moment";

const SamplePlayerContainer = ({ entries, vengoEntries }: any) => {
  const [playlistEntries, setPlaylistEntries] = useState(entries);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);

  const isFirstRender = useRef(true);

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

  function isNegative(num) {
    return num <= 0;
  }

  const handleImpression = useCallback((previousEntry) => {
    if (
      previousEntry.entryType === "vengo" &&
      !isNegative(previousEntry.duration)
    ) {
      console.log(
        "Callback triggered impression",
        previousEntry.entryType,
        previousEntry.tag,
        previousEntry.duration
      );
    }
  }, []);

  useEffect(() => {
    console.log("playlistEntries", playlistEntries);
    const interval = setInterval(() => {
      setCurrentEntryIndex(
        (prevIndex) => (prevIndex + 1) % playlistEntries.length
      );
    }, playlistEntries[currentEntryIndex].duration);

    // return () => clearInterval(interval);

    return () => {
      clearInterval(interval);

      if (isFirstRender.current) {
        console.log("Callback triggered for the first time");
        isFirstRender.current = false;
      } else {
        handleImpression(playlistEntries[currentEntryIndex]);
      }
    };
  }, [currentEntryIndex, handleImpression, playlistEntries]);

  return (
    <div>
      <SamplePlayer entry={playlistEntries[currentEntryIndex]} />
    </div>
  );
};

export default SamplePlayerContainer;
