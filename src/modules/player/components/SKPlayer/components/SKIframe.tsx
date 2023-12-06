import React, { useRef, useEffect, useState } from "react";
import { PlayerPropsModel } from "@models/playerModel";
import styles from "../../../../../../styles/Home.module.css";
import { SKTransition } from "@playerComponents/SKPlayer/components/index";
import { getQueryParams } from "lib/scoop.repo";

type SKIframeProps = {
  index: number;
  playlistEntry: {
    url: string;
  };
  transition: string;
  entry: string;
};
type Visibility = "hidden" | "visible";
export const SKIframe = (props: SKIframeProps) => {
  const { index, playlistEntry, transition, entry } = props;
  const [iframeDisplay, setIframeDisplay] = useState<Visibility | undefined>(
    "hidden"
  );

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
          src={`${playlistEntry.url}&refresh=true`}
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
