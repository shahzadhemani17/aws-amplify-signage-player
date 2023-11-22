import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  sleep,
  fetchScreenDetailsByDuration,
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
  console.log("entries SK PLAYER", entries);
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
  const [vengoPlaylistEntries, setVengoPlaylistEntries] = useState([]);
  console.log("entries SK PLAYER", vengoPlaylistEntries);

  const [modalIsOpen, setIsOpen] = useState(false);
  // const [worker, setWorker] = useState<Worker | null>(null);
  const workerRef = React.useRef<MyWorker | null>(null);
  // const [apiResponse, setApiResponse] = useState<any | null>(null);

  const startWorker = () => {
    const onDataReceived = (data: any) => {
      setVengoPlaylistEntries(data);
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
    for (let i = 0; i < playlistEntries.length; i++) {
      if (i === 0) {
        startWorker();
      }
      playlistEntries[i].visibility = true; // visibility set to true before sleep
      setPlaylistEntries([...playlistEntries]); // update state
      if (playlistEntries[i].tag === "video") {
        handlePlayVideo(vidRef);
      }
      await sleep(playlistEntries[i].duration); // sleep according to playlist duration
      playlistEntries[i].visibility = false; // visibility set to false after sleep
      if (i === playlistEntries.length - 1) {
        // check if last playlist entry
        i = -1; // play from start
      }
    }
  };

  // it filter the vengo entries and add into playlist entries

  return (
    <div>
      {localPlaylistEntries?.map((entry, index) => {
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
