import React from "react";
import { PlayerPropsModel } from "@models/playerModel";

export const SKIframe = (props: PlayerPropsModel) => {
  const { index, playlist } = props;
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
    />
  )
}
