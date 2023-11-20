import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  sleep,
  fetchScreenDetailsByDuration,
  uplodPulse,
  isScreenScheduleValid,
  wait
} from "../../helpers/player.helper";
import { HtmlEnum, EntriesModel } from "@models/playerModel";
import {
  SKImage,
  SKIframe,
  SKVideo
} from "@playerComponents/SKPlayer/components/index";
import InlineWorker from "../../../../../lib/InlineWorker";
/* @ts-ignore */
import Modal from "react-modal";
import cookie from "../../../../../public/cookie.png";
import { styles } from "../../../../../styles/player";
import { EmptyPlayer } from "..";
import moment from "moment";
export const SKPlayer = ({
  entries,
  transition,
  refresh_duration,
  playlist_id,
  screenOnTime,
  screenOffTime,
  screenId,
  screenRefreshDuration,
  backend_url,
}: EntriesModel) => {
  const [playlists, setPlaylists] = useState([...entries]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isScreenOn, setScreenToOn] = useState(isScreenScheduleValid(screenOnTime, screenOffTime));

  const vidRef = useRef(null);
  const handlePlayVideo = (vidRef: any) => {
    vidRef?.current?.play();
  };

  const checkScreenSchedule = async () => {
    await wait(10 * 1000);
    const validScreenTime = isScreenScheduleValid(screenOnTime, screenOffTime);
    validScreenTime ? setScreenToOn(true) : setScreenToOn(false);
    if (validScreenTime) {
      fetchScreenDetailsByDuration(playlist_id, refresh_duration, false);

    }
    return checkScreenSchedule();
  };

  const playEntriesWithWorker = () => {
    localStorage.setItem("playlist", JSON.stringify(entries));
    if (window.Worker && navigator.onLine) {
      if (screenId && screenOnTime && screenOffTime) { 
        const inlineWorker = new InlineWorker(
          checkScreenSchedule()
        );
      } else {
        const inlineWorker = new InlineWorker(
          fetchScreenDetailsByDuration(playlist_id, refresh_duration, true)
        );
      }
    }
  }
  
  useEffect(() => {

    if (navigator.cookieEnabled && typeof window.localStorage !== "undefined") {
      setVisiblePlaylist();
      playEntriesWithWorker();
    } else {
      setPlaylists([]);
      //alert("No Playlist Available");
      //playlists.length = 0;
      console.log("pl", playlists);
      setIsOpen(true);
    }
  }, []);

  const setVisiblePlaylist = async () => {
    for (let i = 0; i < playlists.length; i++) {
      playlists[i].visibility = true; // visibility set to true before sleep
      setPlaylists([...playlists]); // update state
      if (playlists[i].tag === "video") {
        handlePlayVideo(vidRef);
      }
      await sleep(playlists[i].duration); // sleep according to playlist duration
      playlists[i].visibility = false; // visibility set to false after sleep
      if (i === playlists.length - 1) {
        // check if last playlist entry
        i = -1; // play from start
      }
    }
  };
  if (!isScreenOn) {
    return <EmptyPlayer message={`Screen On/Off: ${moment(screenOnTime, "h:mm:ss").format("HH:mm")} to ${moment(screenOffTime, "h:mm:ss").format("HH:mm")}`}/>
  }
  return (
    <div>
      {playlists?.map((playlist, index) => {
        switch (playlist.tag) {
          case HtmlEnum.VIDEO:
            return (
              <SKVideo
                videoRef={vidRef}
                playlist={playlist}
                index={index}
                transition={transition}
                key={index}
              />
            );
          case HtmlEnum.iFRAME:
            return (
              <SKIframe
                playlist={playlist}
                index={index}
                transition={transition}
                key={index}
              />
            );
          default:
            return (
              <SKImage
                playlist={playlist}
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
