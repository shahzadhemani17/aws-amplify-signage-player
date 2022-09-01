import React from "react";
import { PlayerPropsModel } from "@models/playerModel";

export const SKImage = (props: PlayerPropsModel) => {
  const { index, playlist } = props;
  return (
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
  )
}
