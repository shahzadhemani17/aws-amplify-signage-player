import { LegacyRef } from "react";
import { Expose, Type } from "class-transformer";

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
  isValidScheduled?: boolean;
  @Expose({ name: "ad_integration" })
  adIntegration?: any;
  @Expose({ name: "scheduled_criteria" })
  scheduledCriteria: string;
  @Expose({ name: "is_menu" })
  is_menu?: boolean;
  @Expose({ name: "is_web_url" })
  is_web_url?: boolean;
}

// From main app
export class PlaylistEntryModel {
  id: number;
  @Expose({ name: "created_at" })
  createdAt: string;
  @Expose({ name: "updated_at" })
  updatedAt: string;
  @Expose({ name: "deleted_at" })
  deletedAt: string | null;
  @Expose({ name: "scheduled_from" })
  scheduledFrom: string;
  @Expose({ name: "scheduled_to" })
  scheduledTo: string;
  @Expose({ name: "duration_in_seconds" })
  durationInSeconds: number;
  @Type(() => MediaModel)
  media: MediaModel;
  name: string;
  @Expose({ name: "is_scheduled" })
  isScheduled: boolean;
  @Expose({ name: "playlist_entry_schedule" })
  playlistEntrySchedule: string[];
  position: number;
  @Expose({ name: "app_id" })
  appId: number;
  @Expose({ name: "media_id" })
  mediaId: number;
  @Expose({ name: "playlist_entry_title" })
  playListEntryTitle: string;
  @Expose({ name: "app_entry_id" })
  appEntryId: string;
  @Expose({ name: "app_entry_media_hash" })
  appEntryMediaHash: string;
  @Expose({ name: "ad_integration" })
  @Type(() => AdIntegration)
  adIntegration?: AdIntegration;
  @Expose({ name: "scheduled_criteria" })
  scheduledCriteria: string;
  @Expose({ name: "is_menu" })
  isMenu?: boolean;
  @Expose({ name: "is_web_url" })
  isWebUrl?: boolean;
}

// From main app
export class MediaModel {
  id: number;
  hash: string;
  @Expose({ name: "thumbnail_hash" })
  thumbnailHash: string;
  @Expose({ name: "file_name" })
  fileName: string;
  @Expose({ name: "folder_id" })
  folderID: number;
  @Expose({ name: "created_at" })
  createdAt: string;
  @Expose({ name: "content_type" })
  contentType: string;
  @Expose({ name: "height_in_px" })
  heightInPixels: number;
  @Expose({ name: "width_in_px" })
  widthInPixels: number;
  @Expose({ name: "updated_at" })
  updatedAt: string;

  @Expose({ name: "aspect_ratio" })
  aspectRatio: string;

  @Expose({ name: "original_file_size" })
  originalFileSize: number;

  @Expose({ name: "is_widget" })
  isWidget?: boolean;

  @Expose({ name: "original_file_name" })
  // TODO: added optional to resolve the build issue recheck this later in screen module
  originalFileName: string;
}

export class AdIntegration {
  id: number;
  @Expose({ name: "integration_name" })
  integrationName: string;
  url: string;
  @Type(() => VengoParams)
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

// From main app
export class PlaylistModel {
  name: string;
  id: number;
  @Expose({ name: "created_at" })
  createdAt: string;
  @Expose({ name: "updated_at" })
  updatedAt: string;
  @Expose({ name: "aspect_ratio" })
  aspectRatio: string;
  transition: string;
  @Expose({ name: "default_duration_sec" })
  defaultDurationSec: number;
  @Type(() => PlaylistEntryModel)
  entries: PlaylistEntryModel[];
  @Expose({ name: "is_shared" })
  isShared: false;
  @Expose({ name: "number_of_content" })
  noOfContents: number;
  @Expose({ name: "number_of_screens" })
  noOfScreens: number;
  isSelected?: boolean = false;
  status?: string;
  screens?: number;
  @Expose({ name: "is_deleted" })
  isDeleted: boolean;
  @Expose({ name: "is_system" })
  isSystem: boolean;
  @Expose({ name: "is_newly_created" })
  isNewlyCreated: boolean;
  @Expose({ name: "playlist_owner_id" })
  playlistOwnerId: string;
}

// const convertedPlaylist: PlaylistModel = plainToInstance(
//   PlaylistModel,
//   playlist?.data
// );

export class PlaylistResponse {
  status: ResponseType;
  data: {
    entries: [];
  };
}
