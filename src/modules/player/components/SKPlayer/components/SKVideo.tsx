import React from "react";
import { PlayerPropsModel } from "@models/playerModel";
import styles from "../../../../../../styles/Home.module.css";
import { SKTransition } from "@playerComponents/SKPlayer/components/index";

export const SKVideo = (props: PlayerPropsModel) => {
  const { videoRef, index, playlistEntry, transition } = props;
  return (
    <SKTransition transition={transition}>
      <video
        className={styles.player}
        ref={videoRef}
        autoPlay
        loop
        playsInline
        muted
        key={index}
        style={{
          display: playlistEntry.visibility ? "" : "none",
        }}
      >
        <source src={playlistEntry.url} type="video/mp4" />;
      </video>
    </SKTransition>
  );
};
