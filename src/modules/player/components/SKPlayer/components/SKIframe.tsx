import React, { useRef, useEffect, useState } from "react";
import { PlayerPropsModel } from "@models/playerModel";
import styles from "../../../../../../styles/Home.module.css";
import { SKTransition } from "@playerComponents/SKPlayer/components/index";
export const SKIframe = (props: PlayerPropsModel) => {
  const { index, playlistEntry, transition, entry } = props;

  if (entry.is_web_url === true || entry.is_menu === true) {
    playlistEntry.url =
      entry.is_menu && !entry.weburl.url.includes("&refresh=true")
        ? entry.weburl.url + "&refresh=true"
        : entry.weburl.url;
  }

  return (
    <SKTransition transition={transition}>
      {playlistEntry.visibility && (
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
          }}
          name="myFrame"
          key={index}
        />
      )}
    </SKTransition>
  );
};
