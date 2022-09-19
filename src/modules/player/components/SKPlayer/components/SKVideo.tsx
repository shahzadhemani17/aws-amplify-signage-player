import React from "react";
import { PlayerPropsModel } from "@models/playerModel";
import styles from "../../../../../../styles/Home.module.css";
import { SKTransition } from "@playerComponents/SKPlayer/components/index";

export const SKVideo = (props: PlayerPropsModel) => {
  const { videoRef, index, playlist, transition } = props;
  return (
    <SKTransition transition={transition}>
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
      </video></SKTransition>
  )
}
