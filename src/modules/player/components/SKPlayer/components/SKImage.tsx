import React from "react";
import { PlayerPropsModel } from "@models/playerModel";
import styles from "../../../../../../styles/Home.module.css";
import { SKTransition } from "@playerComponents/SKPlayer/components/index";

export const SKImage = (props: PlayerPropsModel) => {
  const { index, playlistEntry, transition } = props;
  return (
    <SKTransition transition={transition}>
      <img
        className={styles.player}
        src={playlistEntry?.url}
        alt="sample"
        key={index}
      />
    </SKTransition>
  );
};
