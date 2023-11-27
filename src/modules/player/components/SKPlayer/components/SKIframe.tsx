import React, { useRef, useEffect, useState } from "react";
import { PlayerPropsModel } from "@models/playerModel";
import styles from "../../../../../../styles/Home.module.css";
import { SKTransition } from "@playerComponents/SKPlayer/components/index";
export const SKIframe = (props: PlayerPropsModel) => {
  const { index, playlist, transition } = props;
  return (
    <SKTransition transition={transition}>
      {playlist.visibility && (
        <iframe
          className={styles.player}
          title="sample"
          src={playlist.url}
          scrolling="no"
          style={{
            border: 0,
            overflow: "hidden",
            overflowX: "hidden",
            overflowY: "hidden"
          }}
          name="myFrame"
          key={index}
        />
      )}
    </SKTransition>
  );
};
