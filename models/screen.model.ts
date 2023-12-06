import { Expose, Type } from "class-transformer";

// import { DeviceModel } from "~/rest/models/device.model";
// import { MediaModel } from "~/rest/models/media.model";

// import { ScreenStatusType } from "~/modules/_core/utils/helper";

export class PulseModel {
  time: number;
  @Expose({ name: "screen_id" })
  screenId: number;
}

export class ScreenModel {
  id: number;
  hash: string;
  name: string;
  note: string;
  volume: number;
  @Type(() => PulseModel)
  pulse: PulseModel;
  // @Type(() => DeviceModel)
  // device: DeviceModel;
  tags: [];
  @Expose({ name: "folder_id" })
  folderId: number;
  @Expose({ name: "folder_name" })
  folderName: string;
  @Expose({ name: "created_at" })
  createdAt: string;
  @Expose({ name: "content_type" })
  contentType: string;
  @Expose({ name: "height_in_px" })
  heightInPixels: number;
  @Expose({ name: "content_type" })
  widthInPixels: number;
  @Expose({ name: "updated_at" })
  updatedAt: string;
  @Expose({ name: "screen_status" })
  // screenStatus: ScreenStatusType;
  // @Expose({ name: "is_paired" })
  // isPaired: ScreenStatusType;
  // @Type(() => MediaModel)
  // media: MediaModel;
  @Expose({ name: "resolution_width_in_px" })
  resolutionWidthInPx: number;
  @Expose({ name: "resolution_height_in_px" })
  resolutionHeightInPx: number;
  description: string;
  @Expose({ name: "screen_mode" })
  screenMode: string;
  @Expose({ name: "device_id" })
  deviceId: number;
  @Expose({ name: "height_from_ground_in_ft" })
  heightFromGroundInFt: number;
  @Expose({ name: "is_ad_enabled" })
  isAdEnabled: boolean;
  @Expose({ name: "is_personal" })
  isPersonal: boolean;
  @Expose({ name: "loop_duration_in_seconds" })
  loopDurationInSeconds: number;
  @Expose({ name: "refresh_duration" })
  refreshDuration: number;
  @Expose({ name: "refresh_cache_duration" })
  refreshCacheDuration: number;
  @Expose({ name: "screen_code" })
  screenCode: string;
  @Expose({ name: "playlist_id" })
  playlistId: number | null;
  @Expose({ name: "media_id" })
  mediaId: number;
  @Expose({ name: "is_double_side" })
  isDoubleSide: boolean;
  @Expose({ name: "screen_on_time" })
  screenOnTime: string;
  @Expose({ name: "screen_off_time" })
  screenOffTime: string;
  @Expose({ name: "timezone_identifier" })
  timezoneIdentifier: string;
  @Expose({ name: "timezone_abbreviation" })
  timezoneAbbreviation: string;
  @Expose({ name: "screen_orientation" })
  screenOrientation: string;
  @Expose({ name: "image_fit" })
  imageFit: string;
  @Expose({ name: "set_date_time_automatically" })
  setDateTimeAutomatically: boolean;
  @Expose({ name: "set_location_automatically" })
  setLocationAutomatically: boolean;
  @Expose({ name: "silent_mode" })
  silentMode: boolean;
  @Expose({ name: "asset_type" })
  assetType: string;
}

export class CreateScreenModel {
  name: number;
  @Expose({ name: "folder_id" })
  folderId: number;
  @Expose({ name: "loop_duration_in_seconds" })
  loopDurationInSeconds: number;
  @Expose({ name: "refresh_duration" })
  refreshDuration: number;
  @Expose({ name: "refresh_cache_duration" })
  refreshCacheDuration: number;
  @Expose({ name: "screen_code" })
  screenCode: string;
  @Expose({ name: "screen_mode" })
  screenMode?: string;
  @Expose({ name: "timezone_abbreviation" })
  timezoneAbbreviation?: string;
  @Expose({ name: "timezone_identifier" })
  timezoneIdentifier?: string;
  @Expose({ name: "user_id" })
  userId?: string;
  @Expose({ name: "organization_id" })
  organizationID?: string;
}

export class ScreenPulse {
  time: number;
  @Expose({ name: "screen_id" })
  screenId: number;
}

export class UpdateScreenCodeModel {
  @Expose({ name: "screen_code" })
  screenCode: number;
  @Expose({ name: "screen_id" })
  screenId: number;
}

export class UpdateScreenFolderModel {
  @Expose({ name: "folder_id" })
  folderId: number;
  @Expose({ name: "screen_ids" })
  screenIds: number[];
}

export class AddDeleteScreenTags {
  @Expose({ name: "screen_id" })
  screenId: number;
  @Expose({ name: "tag_ids" })
  tagIds: number[];
}
