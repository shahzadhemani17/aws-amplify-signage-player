import React, { useEffect, useState } from "react";
import SamplePlayer from "./SamplePlayer";
import { v4 as uuidv4 } from 'uuid';

import {
  getVengoEntriesByIntegrations,
  convertVengoEntries
} from "./modules/player/helpers/player.helper";
import InlineWorker from "lib/InlineWorker";
import { getScreenByShortCode, registerDevice } from "pages/api";
import { ChildWorker } from "@playerComponents/ChildWorker";

const SamplePlayerContainer = ({ entries, vengoEntries }: any) => {
  const [playlistEntries, setPlaylistEntries] = useState(entries);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const [screenInterval, setScreenInterval] = useState<number>(0);

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
    }, playlistEntries[currentEntryIndex].duration);

    return () => clearInterval(interval);
  }, [currentEntryIndex, playlistEntries]);

  let worker;

  useEffect(() => {
      worker = new InlineWorker(
        runWorker()
      );

      // Terminate the worker when the component is unmounted
      return () => {
        worker.terminate();
      };
  }, []);

  const runWorker = async () => {
    const device = localStorage.getItem('device');
    // if (!device) {
    //   const uuid = uuidv4();
    //   const createdDevice = await registerDevice(uuid); // Assuming registerDevice is a function
    //   localStorage.setItem('device', JSON.stringify(createdDevice));
    //   const screenObj = await getScreenByShortCode(createdDevice.uuid);
    //   console.log("1:getScreenByShortCode::", screenObj); 

    // } else {
    //   const deviceFound = JSON.parse(device);
    //   const screenObj = await getScreenByShortCode(deviceFound.uuid);
    //   console.log("2:getScreenByShortCode::", deviceFound, "/n", screenObj);
    //   // Your logic for the else case
    // }

    setInterval(async () => {
      console.log("after 20 sec");
      const deviceFound = JSON.parse(device as string);
      const screenObj = await getScreenByShortCode(deviceFound.uuid);
      setScreenInterval((prev) => {
        return prev + 1;
      });
      worker.terminate();
    }, 20 * 1000);
  }

  console.log("screenInterval::", screenInterval);

  return (
    <div>
      <ChildWorker interval={screenInterval}/>
      {/* <SamplePlayer entry={playlistEntries[currentEntryIndex]} /> */}
    </div>
  );
};

export default SamplePlayerContainer;
