import { LegacyRef } from "react";
import { Expose } from "class-transformer";

export enum EntryType {
  IS_WEB = "is_web_url",
  IS_MENU = "is_menu",
  IS_AD_SLOT = "is_ad_slot",
  IS_RSS_FEED = "is_rss_feed",
}

export enum HtmlEnum {
  IMAGE = "image",
  iFRAME = "iframe",
  VIDEO = "video",
  VENGO = "vengo",
}

export class EntryModel {
  id?: number;
  tag: string;
  url: string;
  duration: number;
  visibility: boolean;
  entryType: any;
  position?: any;
  impression?: any;
  vengoEntry?: any;
  weburl?: any;
  @Expose({ name: "ad_integration" })
  adIntegration?: any;
  @Expose({ name: "scheduled_criteria" })
  scheduledCriteria: string;
  @Expose({ name: "is_menu" })
  is_menu?: boolean;
  @Expose({ name: "is_web_url" })
  is_web_url?: boolean;
}

export class AdIntegration {
  id: number;
  @Expose({ name: "integration_name" })
  integrationName: string;
  url: string;
  params: VengoParams[];
}

export class VengoParams {
  key: string;
  value: string;
}

export class SKPlayerProps {
  entries: EntryModel[];
  transition: string;
  @Expose({ name: "refresh_duration" })
  refreshDuration: number;
  @Expose({ name: "playlist_id" })
  playlist_id: number;
  screenId: number;
  @Expose({ name: "backend_url" })
  backendUrl: string;
  screenOnTime: string;
  screenOffTime: string;
  screenRefreshDuration: number;
  isScreenOn: boolean;
  setScreenToOn: (screenOn: boolean) => void;
  originalEntries: any;
}

export class PlayerPropsModel {
  index: number;
  playlistEntry: EntryModel;
  videoRef?: LegacyRef<HTMLVideoElement>;
  transition: string;
  entry?: any;
}
