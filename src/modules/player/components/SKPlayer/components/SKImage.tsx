import React from "react";
import { PlayerPropsModel } from "@models/playerModel";
import styles from "../../../../../../styles/Home.module.css";

export const SKImage = (props: PlayerPropsModel) => {
  const { index, playlist } = props;
  return (
    <img
      className={styles.player}
      src={playlist.url}
      alt="sample"
      key={index}
      style={{
        display: playlist.visibility ? "" : "none",
      }}
    />
  )
}
