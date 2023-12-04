import React, { useRef, useEffect, useState } from "react";
import { PlayerPropsModel } from "@models/playerModel";
import styles from "../../../../../../styles/Home.module.css";
import { SKTransition } from "@playerComponents/SKPlayer/components/index";
import { getQueryParams } from "lib/scoop.repo";
export const SKIframe = (props: PlayerPropsModel) => {
  const { index, playlistEntry, transition, entry } = props;

  useEffect(() => {
    // Check if the 'entry' is a web URL or a menu
    if (entry.is_web_url === true || entry.is_menu === true) {
      const { refreshCacheDuration } = getQueryParams();
      /* 
        Only add refresh param for 2 extension app
        Menu:           APP ID:   2
        Multi Playlist: APP ID:  12
      */
      playlistEntry.url =
        [2, 12].includes(entry.app_id) && refreshCacheDuration !== null
          ? `${entry.weburl.url}&refresh=${refreshCacheDuration}`
          : entry.weburl.url;
    }
    console.log(
      "Client: Playlist Entry with Is web & menu set to true",
      playlistEntry
    );
  }, [playlistEntry, entry]);

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
            overflowY: "hidden"
          }}
          name="myFrame"
          key={index}
        />
      )}
    </SKTransition>
  );
};
