import React, { useRef, useEffect, useState } from "react";
import { PlayerPropsModel } from "@models/playerModel";
import styles from "../../../../../../styles/Home.module.css";
import { SKTransition } from "@playerComponents/SKPlayer/components/index";
export const SKIframe = (props: PlayerPropsModel) => {
  const { index, playlist, transition } = props;
  const [contentLoaded, setContentLoaded] = useState(false);
  return (
    <SKTransition transition={transition}>
      <iframe
        className={styles.player}
        title="sample"
        src={playlist.visibility ? playlist.url : ""}
        onLoad={() => {
          setContentLoaded(true);
        }}
        scrolling="no"
        style={{
          border: 0,
          overflow: "hidden",
          overflowX: "hidden",
          overflowY: "hidden",
          display: contentLoaded && playlist.visibility ? "" : "none"
        }}
        name="myFrame"
        key={index}
      />
    </SKTransition>
  );
};
