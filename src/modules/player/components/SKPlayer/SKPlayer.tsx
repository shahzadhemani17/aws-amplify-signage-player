import React, { useState, useEffect, useRef } from "react";
import { sleep, fetchScreenDetailsByDuration } from "../../helpers/player.helper";
import { HtmlEnum, EntriesModel } from "@models/playerModel";
import { SKImage, SKIframe, SKVideo } from "@playerComponents/SKPlayer/components/index";
import InlineWorker from "../../../../../lib/InlineWorker";

export const SKPlayer = ({ entries, transition, refresh_duration, playlist_id }: EntriesModel) => {
  const [playlists, setPlaylists] = useState([...entries]);

  const vidRef = useRef(null);

  const handlePlayVideo = (vidRef: any) => {
    vidRef?.current?.play();
  };

  useEffect(() => {
    setVisiblePlaylist();
    if (navigator.cookieEnabled && typeof window.localStorage !== 'undefined') {
      localStorage.setItem('playlist', JSON.stringify(entries));
      if (window.Worker && navigator.onLine) {
        const inlineWorker = new InlineWorker(
          fetchScreenDetailsByDuration(
            playlist_id,
            refresh_duration
          )
        );
      }
    } else {
      setPlaylists([]);
      alert("No Playlist Available");
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

  return (
    <div>
      {playlists?.map((playlist, index) => {
        switch (playlist.tag) {
          case HtmlEnum.VIDEO:
            return <SKVideo
              videoRef={vidRef}
              playlist={playlist}
              index={index}
              transition={transition}
              key={index}
            />
          case HtmlEnum.iFRAME:
            return <SKIframe
              playlist={playlist}
              index={index}
              transition={transition}
              key={index}
            />
          default:
            return <SKImage
              playlist={playlist}
              index={index}
              transition={transition}
              key={index}
            />
        }
      })}
    </div>
  );
};
