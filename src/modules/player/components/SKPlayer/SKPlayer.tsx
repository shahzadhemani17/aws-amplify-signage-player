import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  sleep,
  fetchScreenDetailsByDuration,
  getVengoEntriesByIntegrations,
  convertVengoEntries,
} from "../../helpers/player.helper";
import { HtmlEnum, EntriesModel } from "@models/playerModel";
import {
  SKImage,
  SKIframe,
  SKVideo,
} from "@playerComponents/SKPlayer/components/index";
import InlineWorker from "../../../../../lib/InlineWorker";
/* @ts-ignore */
import Modal from "react-modal";
import cookie from "../../../../../public/cookie.png";
import { styles } from "../../../../../styles/player";
import MyWorker from "../../../../../lib/MyWorker";

export const SKPlayer = ({
  entries,
  transition,
  refresh_duration,
  playlist_id,
}: EntriesModel) => {
  const filterLocals = (entries) => {
    return entries.filter((entry) => {
      if (entry.entyType !== "vengo") {
        return entry;
      }
    });
  };

  const filterVengs = (entries) => {
    return entries.filter((entry) => {
      if (entry.entyType === "vengo") {
        return entry;
      }
    });
  };

  const filterLocalEntries = (entries) => {
    return entries.filter((entry) => {
      if (entry.tag !== "vengo") {
        return entry;
      }
    });
  };

  const filterVengoIntegrationEntries = (entries) => {
    return entries.filter((entry) => {
      if (entry.tag === "vengo") {
        return entry;
      }
    });
  };

  const [playlistEntries, setPlaylistEntries] = useState([...entries]);
  const [localPlaylistEntries, setLocalPlaylistEntries] = useState([
    ...filterLocalEntries(entries),
  ]);
  const [vengoIntegrationEntries, setVengoIntegrationEntries] = useState([
    ...filterVengoIntegrationEntries(entries),
  ]);
  console.log("entries SK PLAYER", vengoIntegrationEntries);

  const [vengoPlaylistEntries, setVengoPlaylistEntries] = useState<any>([]);
  console.log("entries SK PLAYER", vengoPlaylistEntries);
  const [iteratableEntries, setIteratableEntries] = useState<any>([
    ...filterLocalEntries(entries),
  ]);

  console.log("iteratableEntries...........", iteratableEntries);

  const [modalIsOpen, setIsOpen] = useState(false);
  // const [worker, setWorker] = useState<Worker | null>(null);
  const workerRef = React.useRef<MyWorker | null>(null);
  // const [apiResponse, setApiResponse] = useState<any | null>(null);

  const startWorker = () => {
    const onDataReceived = (data: any) => {
      setVengoPlaylistEntries(data);
      console.log("vengoPlaylistEntries 999999999999999999999", data);
      // setIteratableEntries([...localPlaylistEntries, ...data]);
    };
    workerRef.current = new MyWorker(onDataReceived);
    workerRef.current.fetchData("fetchData", vengoIntegrationEntries);
  };

  const vidRef = useRef(null);

  const handlePlayVideo = (vidRef: any) => {
    vidRef?.current?.play();
  };

  useEffect(() => {
    if (navigator.cookieEnabled && typeof window.localStorage !== "undefined") {
      setVisiblePlaylist();
      localStorage.setItem("playlist", JSON.stringify(entries));
      if (window.Worker && navigator.onLine) {
        const inlineWorker = new InlineWorker(
          fetchScreenDetailsByDuration(playlist_id, refresh_duration)
        );
      }
    } else {
      setPlaylistEntries([]);
      console.log("pl", playlistEntries);
      setIsOpen(true);
    }
  }, []);

  const setVisiblePlaylist = async () => {
    for (let i = 0; i < iteratableEntries.length; i++) {
      console.log(i, "111111111111111111111111111", iteratableEntries[i]);
      let dataArray;
      if (i === 0) {
        // startWorker();
        getVengoEntriesByIntegrations(vengoIntegrationEntries).then((data) => {
          if (data && data.every((item) => item !== null)) {
            dataArray = convertVengoEntries(data);
            dataArray = dataArray.map((item) => {
              item.visibility = false;
              return item;
            });
            setVengoPlaylistEntries([...dataArray]);
            setIteratableEntries([...localPlaylistEntries, ...dataArray]); // update state
          }
        });
      }
      iteratableEntries[i].visibility = true; // visibility set to true before sleep
      setIteratableEntries([...localPlaylistEntries, ...vengoPlaylistEntries]); // update state4
      console.log(i, "11111111111112222222222", iteratableEntries[i]);
      if (iteratableEntries[i].tag === "video") {
        handlePlayVideo(vidRef);
      }
      await sleep(iteratableEntries[i].duration); // sleep according to playlist duration
      console.log(i, "111111111111333333333333333", iteratableEntries[i]);
      iteratableEntries[i].visibility = false; // visibility set to false after sleep
      console.log(i, "1111111111114444444444444444", iteratableEntries[i]);

      if (i === iteratableEntries.length - 1) {
        // check if last playlist entry
        i = -1; // play from start
      }
    }
  };

  // it filter the vengo entries and add into playlist entries

  return (
    <div>
      {iteratableEntries?.map((entry, index) => {
        switch (entry.tag) {
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
        }
      })}

      <Modal
        isOpen={modalIsOpen}
        style={styles.modalStyles}
        contentLabel="Example Modal"
      >
        <div style={styles.container}>
          <Image width="150px" height="150px" src={cookie} alt="as" />
          <h1 style={{ color: "black" }}>We use cookies</h1>
          <h3 style={styles.h3}>
            This website uses cookies to ensure you get the best experience on
            our website. So please enable cookies to continue.
          </h3>
        </div>
      </Modal>
    </div>
  );
};
