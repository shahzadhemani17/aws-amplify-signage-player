import React, { useEffect, useState } from "react";
import { PlayerPropsModel } from "@models/playerModel";
import styles from "../../../../../../styles/Home.module.css";
import { SKTransition } from "@playerComponents/SKPlayer/components/index";
import { getQueryParams } from "lib/scoop.repo";
type Visibility = "hidden" | "visible";
export const SKIframe = (props: PlayerPropsModel) => {
  const { index, playlistEntry, transition, entry } = props;
  const [iframeDisplay, setIframeDisplay] = useState<Visibility | undefined>(
    "hidden"
  );

  useEffect(() => {
    // Check if the 'entry' is a web URL or a menu
    if (entry.isWebUrl === true || entry.isMenu === true) {
      const { refreshCacheDuration } = getQueryParams();
      /* 
        Only add refresh param for 2 extension app
        Menu:           APP ID:   2
        Multi Playlist: APP ID:  12
      */
      playlistEntry.url =
        [2, 12].includes(entry.appId) && refreshCacheDuration !== null
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
      <div
        style={{
          width: "100%",
          height: "100vh",
          background: "black"
        }}
      >
        <iframe
          className={styles.player}
          title="sample"
          src={playlistEntry.url}
          onLoad={() => {
            setIframeDisplay("visible");
          }}
          scrolling="no"
          style={{
            border: 0,
            overflow: "hidden",
            overflowX: "hidden",
            overflowY: "hidden",
            visibility: iframeDisplay
          }}
          name="myFrame"
          key={index}
        />
      </div>
    </SKTransition>
  );
};
