import { Expose } from "class-transformer";

// export class DeviceModel {
//   id: number;
//   name: number;
//   locale: string;
//   manufacturer: string;
//   model: string;
//   storage: number;
//   ram: string;
//   uuid: string;

//   @Expose({ name: "location_lat" })
//   locationLatitude: number;
//   @Expose({ name: "location_lng" })
//   locationLongitude: number;
//   @Expose({ name: "app_version" })
//   appVersion: number;
//   @Expose({ name: "available_storage" })
//   availableStorage: number;
//   @Expose({ name: "created_at" })
//   createdAt: string;
// }

export class PlaylistResponse {
  status: ResponseType;
  data: {
    entries: [];
  };
}
