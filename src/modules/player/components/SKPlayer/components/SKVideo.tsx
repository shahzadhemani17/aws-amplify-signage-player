import React from "react";
import { PlayerPropsModel } from "@models/playerModel";

export const SKVideo = (props: PlayerPropsModel) => {
  const { vidRef, index, playlist } = props;
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
  )
}
