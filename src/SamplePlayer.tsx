import { HtmlEnum } from "@models/playerModel";
import {
  SKImage,
  SKIframe,
  SKVideo,
} from "@playerComponents/SKPlayer/components/index";

const SamplePlayer = ({ entry }: any) => {
  switch (entry?.tag) {
    case HtmlEnum.VIDEO:
      return (
        <SKVideo
          // videoRef={vidRef}
          playlistEntry={entry}
          index={entry?.id}
          transition={"FLIP"}
          key={entry?.id}
        />
      );
    case HtmlEnum.iFRAME:
      return (
        <SKIframe
          playlistEntry={entry}
          index={entry?.id}
          transition={"FLIP"}
          key={entry.id}
          entry={entry}
        />
      );
    default:
      return (
        <SKImage
          playlistEntry={entry}
          index={entry?.id}
          transition={"FLIP"}
          key={entry?.id}
        />
      );
  }
};

export default SamplePlayer;
