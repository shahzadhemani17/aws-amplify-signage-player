import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
// import { sleep, isScreenScheduleValid } from "../../helpers/player.helper";
import {
  sleep,
  getVengoEntriesByIntegrations,
  convertVengoEntries,
  isScreenScheduleValid
} from "../../helpers/player.helper";
import { HtmlEnum, EntriesModel } from "@models/playerModel";
import {
  SKImage,
  SKIframe,
  SKVideo
} from "@playerComponents/SKPlayer/components/index";
/* @ts-ignore */
import Modal from "react-modal";
import cookie from "../../../../../public/cookie.png";
import { styles } from "../../../../../styles/player";

import { EmptyPlayer } from "@playerComponents/index";
import moment from "moment";
import { labels } from "@playerComponents/labels";
export const SKPlayer = ({
  entries,
  transition,
  screenOnTime,
  screenOffTime,
  isScreenOn,
  setScreenToOn,
  screenId
}: EntriesModel) => {
  const filterVengoIntegrationEntries = (entries) => {
    return entries.filter((entry) => {
      if (entry.tag === "vengo") {
        return entry;
      }
    });
  };
  const [playlistEntries, setPlaylistEntries] = useState([...entries]);
  console.log(
    "Client: Playlist Entries available for the play",
    playlistEntries
  );

  const [vengoIntegrationEntries] = useState([
    ...filterVengoIntegrationEntries(entries)
  ]);

  const [, setVengoPlaylistEntries] = useState<any>([]);
  const [modalIsOpen, setIsOpen] = useState(false);

  const vidRef = useRef(null);
  const handlePlayVideo = (vidRef: any) => {
    vidRef?.current?.play();
  };

  console.log(
    "Client: on & off time for the screen:",
    "OnTime:",
    screenOnTime || "Empty",
    ", Off Time:",
    screenOffTime || "Empty"
  );

  useEffect(() => {
    setScreenToOn(isScreenScheduleValid(screenOnTime, screenOffTime));
  }, [screenOnTime, screenOffTime]);

  useEffect(() => {
    if (navigator.cookieEnabled && typeof window.localStorage !== "undefined") {
      setVisiblePlaylist();
    } else {
      setPlaylistEntries([]);
      //alert("No Playlist Available");
      //playlists.length = 0;
      console.log("pl", playlistEntries);
      setIsOpen(true);
    }
  }, []);

  const setVisiblePlaylist = async () => {
    for (let i = 0; i < playlistEntries.length; i++) {
      let dataArray;
      if (i === 0) {
        getVengoEntriesByIntegrations(vengoIntegrationEntries).then((data) => {
          if (data) {
            dataArray = convertVengoEntries(data);
            dataArray = dataArray.map((item) => {
              item.visibility = false;
              return item;
            });
            setVengoPlaylistEntries && setVengoPlaylistEntries([...dataArray]);

            // logic: to skip vengo entries which could not be fetched
            if (dataArray?.length) {
              const entries1 = playlistEntries.map((entry1) => {
                if (entry1.entryType === "vengo") {
                  const vengoEntry = dataArray?.find(
                    (entry2) => entry2?.position === entry1?.position
                  );
                  if (vengoEntry?.url) {
                    entry1.vengoEntry = vengoEntry;
                    entry1.visibility = false;
                    entry1.duration = vengoEntry?.duration;
                  } else {
                    entry1.vengoEntry = vengoEntry;
                    entry1.visibility = false;
                    entry1.duration = 0;
                  }
                }
                return entry1;
              });
              setPlaylistEntries([...entries1]); // update state
            }
          }
        });
      }

      setPlaylistEntries([...playlistEntries]); // update state4

      playlistEntries[i].visibility = true; // visibility set to true before sleep
      setPlaylistEntries([...playlistEntries]); // update state4
      if (playlistEntries[i].tag === "video") {
        handlePlayVideo(vidRef);
      }

      if (!!playlistEntries[i].duration) {
        await sleep(playlistEntries[i].duration); // sleep according to playlist duration4
      }
      playlistEntries[i].visibility = false; // visibility set to false after sleep

      if (i === playlistEntries.length - 1) {
        // check if last playlist entry
        i = -1; // play from start
      }
    }
  };

  // if screenId is available, we will consider a screen is attached to the player, and we will check following cases
  // both screenOnTime and screenOffTime should be empty or should have valid time
  // isScreenOn flag should be true which means screen is scheduled
  // Note: if both screenOnTime and screenOffTime are empty it means screen will be played 24/7 on player
  if (
    (!isScreenOn && screenId && screenOnTime && screenOffTime) ||
    (!isScreenOn && screenId && screenOnTime && !screenOffTime) ||
    (!isScreenOn && screenId && !screenOnTime && screenOffTime)
  ) {
    return (
      <EmptyPlayer
        message={
          screenOnTime && screenOffTime
            ? `Screen On/Off: ${moment(screenOnTime, "h:mm:ss").format(
                "HH:mm"
              )} to ${moment(screenOffTime, "h:mm:ss").format("HH:mm")}`
            : labels.setScreenOnOffTime
        }
      />
    );
  }
  return (
    <div>
      {playlistEntries?.map((entry, index) => {
        if (entry.entryType === "vengo") {
          console.log("Client: Vengo Entry", entry);
          entry = entry?.vengoEntry;
          if (entry?.url) {
            entry.visibility = true;
          }
          // entry.visibility = true;
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
                entry={entries.find((entryObj) => entryObj.id === entry.id)}
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
