import React from "react";
import { PlayerPropsModel } from "@models/playerModel";
import styles from "../../../../../../styles/Home.module.css";

export const SKVideo = (props: PlayerPropsModel) => {
  const { videoRef, index, playlist } = props;
  return (
    <video
      className={styles.player}
      ref={videoRef}
      autoPlay
      loop
      muted
      key={index}
      style={{
        display: playlist.visibility ? "" : "none",
      }}
    >
      <source src={playlist.url} type="video/mp4" />;
    </video>
  )
}
