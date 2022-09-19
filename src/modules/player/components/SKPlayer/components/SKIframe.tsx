import React from "react";
import { PlayerPropsModel } from "@models/playerModel";
import styles from "../../../../../../styles/Home.module.css";
import { SKTransition } from "@playerComponents/SKPlayer/components/index";

export const SKIframe = (props: PlayerPropsModel) => {
  const { index, playlist, transition } = props;
  return (
    <SKTransition transition={transition}>
      <iframe
        className={styles.player}
        title="sample"
        src={playlist.url}
        name="myFrame"
        key={index}
        style={{
          display: playlist.visibility ? "" : "none",
        }}
      /></SKTransition>
  )
}
