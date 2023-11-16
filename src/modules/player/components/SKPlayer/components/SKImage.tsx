import React from "react";
import { PlayerPropsModel } from "@models/playerModel";
import styles from "../../../../../../styles/Home.module.css";
import { SKTransition } from "@playerComponents/SKPlayer/components/index";

// const filterLocalEntries = (entries) => {
//   return entries.filter((entry) => {
//     if (entry?.ad_integration?.integration_name !== "vengo") {
//       return entry;
//     }
//   });
// }

export const SKImage = (props: PlayerPropsModel) => {
  const { index, playlistEntry, transition } = props;
  return (
    <SKTransition transition={transition}>
      <img
        className={styles.player}
        src={playlistEntry.url}
        alt="sample"
        key={index}
        style={{
          display: playlistEntry.visibility ? "" : "none",
        }}
      />
    </SKTransition>
  );
};
