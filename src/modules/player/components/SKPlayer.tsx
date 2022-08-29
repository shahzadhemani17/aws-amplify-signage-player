import React, { useState, useEffect, useRef } from "react";
import { sleep } from "../helpers/player.helper";

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
          return (
            <video
              ref={vidRef}
              autoPlay
              loop
              muted
              key={index}
              style={{
                height: "99vh",
                objectFit: "cover",
                width: "100%",
                display: playlist.visibility ? "" : "none",
              }}
            >
              <source src={playlist.url} type="video/mp4" />;
            </video>
          );
        } else if (playlist.tag === "image") {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={playlist.url}
              alt="sample"
              key={index}
              style={{
                width: "100%",
                height: "99vh",
                objectFit: "cover",
                display: playlist.visibility ? "" : "none",
              }}
            />
          );
        } else if (playlist.tag === "iframe") {
          return (
            <iframe
              title="sample"
              src={playlist.url}
              name="myFrame"
              key={index}
              style={{
                height: "99vh",
                objectFit: "contain",
                width: "100%",
                display: playlist.visibility ? "" : "none",
              }}
            ></iframe>
          );
        }
      })}
    </div>
  );
};
