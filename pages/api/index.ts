import axios from "axios";

const axiosRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer ghfutrd754d6ufiytfg97tf968"
  },
});

export const registerDevice = async (uuid: string) => {
  const body = {
    "OS": "string",
    "app_flavour": "string",
    "app_version": "string",
    "available_storage": 0,
    "ip": "string",
    "locale": "string",
    "location_lat": 0,
    "location_lng": 0,
    "manufacturer": "string",
    "media_player": "string",
    "model": "string",
    "name": "string",
    "os_version": "string",
    "ram": "string",
    "serial_no": "string",
    "storage": 0,
    "uuid": uuid
  }
  const { data } = await axiosRequest.post(
    `https://api-v2.dev.skoopsignage.dev/devices/register`,
    body
  );
  return data;
};

export const getScreenByShortCode = async (screenShortCode: string) => {
  const { data } = await axiosRequest.get(
    `https://api-v2.dev.skoopsignage.dev/screenCodes/${screenShortCode}`,
  );
  return data;
};
