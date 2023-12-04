import { LegacyRef } from "react";

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

export interface EntryModel {
  id?: number;
  tag: string;
  url: string;
  duration: number;
  visibility: boolean;
  entryType: any;
  ad_integration?: any;
  position?: any;
  impression?: any;
  vengoEntry?: any;
  scheduled_criteria: string;
  is_menu?: boolean;
  is_web_url?: boolean;
  weburl?: any;
}

// export interface AdIntegration {
//   id: number;
//   integration_name: string;
//   url: string;
//   params: VengoParams[];
// }

// export interface VengoParams {
//   key: string;
//   value: string;
// }

export interface SKPlayerProps {
  entries: EntryModel[];
  transition: string;
  refresh_duration: number;
  playlist_id: number;
  screenId: number;
  backend_url: string;
  screenOnTime: string;
  screenOffTime: string;
  screenRefreshDuration: number;
  isScreenOn: boolean;
  setScreenToOn: (screenOn: boolean) => void;
  originalEntries: any;
}

export interface PlayerPropsModel {
  index: number;
  playlistEntry: EntryModel;
  videoRef?: LegacyRef<HTMLVideoElement>;
  transition: string;
  entry?: any;
}
