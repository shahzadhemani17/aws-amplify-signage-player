import React from "react";
import { PlayerPropsModel } from "@models/playerModel";
import styles from "../../../../../../styles/Home.module.css";
import { SKTransition } from "@playerComponents/SKPlayer/components/index";

export const SKIframe = (props: PlayerPropsModel) => {
  const { index, playlistEntry, transition } = props;
  return (
    <SKTransition transition={transition}>
      <iframe
        className={styles.player}
        title="sample"
        src={playlistEntry.url}
        scrolling="no"
        style={{
          border: 0,
          overflow: "hidden",
          overflowX: "hidden",
          overflowY: "hidden",
          display: playlistEntry.visibility ? "" : "none",
        }}
        name="myFrame"
        key={index}
      />
    </SKTransition>
  );
};
