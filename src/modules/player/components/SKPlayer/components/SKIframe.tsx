import React from "react";
import { PlayerPropsModel } from "@models/playerModel";
import styles from "../../../../../../styles/Home.module.css";

export const SKIframe = (props: PlayerPropsModel) => {
  const { index, playlist } = props;
  return (
    <iframe
      className={styles.player}
      title="sample"
      src={playlist.url}
      name="myFrame"
      key={index}
      style={{
        display: playlist.visibility ? "" : "none",
      }}
    />
  )
}
