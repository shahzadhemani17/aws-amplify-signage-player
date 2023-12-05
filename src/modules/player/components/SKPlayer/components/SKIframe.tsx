import React, { useRef, useEffect, useState } from "react";
import { PlayerPropsModel } from "@models/playerModel";
import styles from "../../../../../../styles/Home.module.css";
import { SKTransition } from "@playerComponents/SKPlayer/components/index";
import { getQueryParams } from "lib/scoop.repo";
export const SKIframe = (props: PlayerPropsModel) => {
  const { index, playlistEntry, transition, entry } = props;
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
          overflowY: "hidden"
        }}
        name="myFrame"
        key={index}
      />
    </SKTransition>
  );
};
