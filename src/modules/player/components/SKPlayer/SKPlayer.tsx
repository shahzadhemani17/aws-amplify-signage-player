import React, { useState, useEffect, useRef } from "react";
import { sleep } from "../../helpers/player.helper";
import { SKImage, SKIframe, SKVideo } from "@playerComponents/SKPlayer/components/index";

export const SKPlayer = (props: any) => {
  const [playlists, setPlaylists] = useState([...props.entries]);

  const vidRef = useRef(null);

  const handlePlayVideo = (vidRef: any) => {
    vidRef?.current?.play();
  };

  useEffect(() => {
    setVisiblePlaylist();
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
        if (playlist.tag === "video") {
          <SKVideo
            vidRef={vidRef}
            playlist={playlist}
            index={index}
          />
        } else if (playlist.tag === "image") {
          <SKImage
            playlist={playlist}
            index={index}
          />
        } else if (playlist.tag === "iframe") {
          return (
            <SKIframe
              playlist={playlist}
              index={index}
            />
          );
        }
      })}
    </div>
  );
};
