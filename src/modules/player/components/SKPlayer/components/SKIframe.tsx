import React, { useRef, useEffect, useState } from "react";
import { PlayerPropsModel } from "@models/playerModel";
import styles from "../../../../../../styles/Home.module.css";
import { SKTransition } from "@playerComponents/SKPlayer/components/index";
export const SKIframe = (props: PlayerPropsModel) => {
  const { index, playlistEntry, transition } = props;
  return (
    <SKTransition transition={transition}>
      {/* TODO The following check is the solution for the timer loading issue
        but apparently, it causing ripple for the menu height. 
        So for time being decided to revert the change. And we need to remove
        the display atrribute */
      /* {playlist.visibility && ()} */}
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
