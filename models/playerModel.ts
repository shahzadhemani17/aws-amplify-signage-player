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
}

export interface PlayerModel {
  id: number;
  tag: string;
  url: string;
  duration: number;
  visibility: boolean;
}

export interface EntriesModel {
  entries: PlayerModel[];
  transition: string;
  refresh_duration: number;
  playlist_id: number;
  screenId: number;
  backend_url: string;
  screenOnTime: string;
  screenOffTime: string;
  screenRefreshDuration: number;
}

export interface PlayerPropsModel {
  index: number;
  playlist: PlayerModel;
  videoRef?: LegacyRef<HTMLVideoElement>;
  transition: string;
}
