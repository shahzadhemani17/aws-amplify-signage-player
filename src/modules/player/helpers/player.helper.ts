import { HtmlEnum, PlayerModel } from "@models/playerModel";
import { ResponseType, PlaylistResponse } from "@models/playlistResponseModel";
import { PlaylistMessages } from "../player.constant";
import moment from "moment-timezone";
// import { getPlaylistData, getQueryParams, postPulse } from "lib/scoop.repo";
import {
  getPlaylistData,
  getQueryParams,
  getVengoEntries,
  postPulse,
} from "lib/scoop.repo";
import CryptoJS from "crypto-js";
const populatePlayer = (
  index: number,
  duration: number,
  id: number,
  tag: string,
  url: string,
  entryType: any,
  scheduledCriteria: string,
  ad_integration?: any,
  position?: any,
  impression?: any,
  app_id?: any
) => {
  const player: PlayerModel = {
    id: id,
    tag: tag,
    url: url,
    duration: duration * 1000,
    visibility: false,
    entryType,
    ad_integration,
    position,
    impression,
    scheduled_criteria: scheduledCriteria || ""
  };
  return player;
};
export const convertJSON = (playlist: any) => {
  const result: PlayerModel[] = [];
  playlist.entries.sort(
    (a: any, b: any) => parseFloat(a.position) - parseFloat(b.position)
  );
  playlist?.entries.map((entry: any, index: number) => {
    if (entry.is_web_url === true || entry.is_menu === true) {
      result.push(
        populatePlayer(
          index,
          entry.duration_in_seconds,
          entry.id,
          HtmlEnum.iFRAME,
          entry.weburl.url,
          "skoop",
          entry.scheduled_criteria,
          entry?.ad_integration,
          entry.position,
          entry?.impression,
          entry?.app_id
        )
      );
    } else if (entry?.media?.hash) {
      entry.media.hash &&
        result.push(
          populatePlayer(
            index,
            entry.duration_in_seconds,
            entry.id,
            entry.media.content_type === "video"
              ? HtmlEnum.VIDEO
              : HtmlEnum.IMAGE,
            entry.media.hash,
            "skoop",
            entry.scheduled_criteria,
            entry?.ad_integration,
            entry.position,
            entry?.impression,
          )
        );
    } else if (entry?.ad_integration?.integration_name === "vengo") {
      result.push(
        populatePlayer(
          index,
          entry.duration_in_seconds,
          entry.id,
          HtmlEnum.VENGO,
          entry.media.hash,
          "vengo",
          entry.scheduled_criteria,
          entry?.ad_integration,
          entry.position,
          entry?.impression,
        )
      );
    }
  });
  return result;
};

export const convertVengoEntries = (entries: any) => {
  const result: PlayerModel[] = [];
  entries.sort(
    (a: any, b: any) => parseFloat(a.position) - parseFloat(b.position)
  );
  entries.map((entry: any, index: number) => {
    result.push(
      populatePlayer(
        index,
        entry.duration_in_seconds,
        entry.id,
        entry.media?.content_type === "video" ? HtmlEnum.VIDEO : HtmlEnum.IMAGE,
        entry.media?.hash,
        "vengo",
        entry?.scheduled_criteria,
        entry?.ad_integration,
        entry.position,
        entry?.impression,
      )
    );
  });
  return result;
};

export const isScreenScheduleValid = (screenOnTime, screenOffTime) => {
  const format = "hh:mm:ss"; // Use 'HH' for 24-hour format
  const time = moment();
  const beforeTime = moment(screenOnTime, format);
  let afterTime = moment(screenOffTime, format);
  // If screenOffTime is before screenOnTime, add a day to screenOff
  if (afterTime.isBefore(beforeTime)) {
    afterTime = afterTime.add(1, 'day');
  }
  return time.isBetween(beforeTime, afterTime) || time.isSame(beforeTime);
};

export const getPlaylistEntries = (playlistData: any) => {
  let convertedPlaylist: PlayerModel[] = [];
  let transition: string = "";
  let message: string = "";
  let is_edited: number = 0;
  let refresh_duration: number = 0;
  if (playlistData.data.code === "not-found") {
    message = PlaylistMessages.PLAYLIST_NOT_EXISTS;
  } else if (
    Object.keys(playlistData.data).length === 0 &&
    playlistData.status === ResponseType.ERROR
  ) {
    message = PlaylistMessages.SOMETHING_WENT_WRONG;
  } else if (Object.keys(playlistData.data).length === 0) {
    message = PlaylistMessages.PROVIDE_PLAYLIST_ID;
  } else if (playlistData.data.entries?.length !== 0) {
    const playlistClone = playlistData?.data?.entries
      ? [...playlistData.data.entries]
      : [];
    const scheduledEntries = checkScheduledPlayList(playlistClone);
    convertedPlaylist = convertJSON(scheduledEntries.playListWithValidEntries);
    transition = playlistData.data.transition;
    is_edited = playlistData.data.is_edited;
    refresh_duration = playlistData.data.default_duration_sec;
  } else {
    message = PlaylistMessages.ENTRIES_NOT_FOUND;
  }
  return {
    convertedPlaylist,
    message,
    transition,
    is_edited,
    refresh_duration,
  };
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const checkValidMomentDates = (type: string, dates: any) => {
  const currentDate = moment().format("DD/MM/YYYY");
  const compareDate = moment(currentDate, "DD/MM/YYYY");
  if (type === "inBetween") {
    let sDate = moment(dates.date_from).format("DD/MM/YYYY");
    let eDate = moment(dates.date_to).format("DD/MM/YYYY");
    const startDate = moment(sDate, "DD/MM/YYYY");
    const endDate = moment(eDate, "DD/MM/YYYY");
    return compareDate.isBetween(startDate, endDate);
  }
  if (type === "isSame") {
    let sDate = moment(dates.date_from).format("DD/MM/YYYY");
    let eDate = moment(dates.date_to).format("DD/MM/YYYY");
    const startDate = moment(sDate, "DD/MM/YYYY");
    const endDate = moment(eDate, "DD/MM/YYYY");
    return compareDate.isSame(startDate) || compareDate.isSame(endDate);
  }
  if (type === "withinTime") {
    const time = moment().format("HH:mm:ss");
    const compareTime = moment(time, "hh:mm:ss");
    const beforeTime = moment(dates.time_from, "hh:mm:ss");
    const afterTime = moment(dates.time_to, "hh:mm:ss");
    return compareTime.isBetween(beforeTime, afterTime);
  }
};

export const getEntrySchedule = (entry: any) => {
  const { scheduled_criteria } = entry;
  if (scheduled_criteria === "") {
    entry.isValidScheduled = true;
  } else if (scheduled_criteria && scheduled_criteria !== "") {
    const scheduledCriteria = JSON.parse(scheduled_criteria);
    if (scheduledCriteria) {
      const { date_from, date_to, day, time_from, time_to } =
        scheduledCriteria;
      if (date_from && date_to && (day === "" || !day.length)) {
        const inBetween = checkValidMomentDates("inBetween", {
          date_from,
          date_to
        });
        const isSame = checkValidMomentDates("isSame", {
          date_from,
          date_to
        });
        entry.isValidScheduled = inBetween || isSame ? true : false;
      }
      if (
        day &&
        day.length &&
        (!date_from || date_from === "" || !date_to || date_to === "") &&
        (!time_from || !time_to || time_from === "" || time_to === "")
      ) {
        const weekDayName = moment().format("dddd");
        if (day.includes(weekDayName)) {
          entry.isValidScheduled = true;
        }
      }
      if (
        day &&
        day.length &&
        date_from &&
        date_to &&
        (!time_from || !time_to || time_from === "" || time_to === "")
      ) {
        const inBetween = checkValidMomentDates("inBetween", {
          date_from,
          date_to
        });
        const isSame = checkValidMomentDates("isSame", {
          date_from,
          date_to
        });
        const weekDayName = moment().format("dddd");
        if (day.includes(weekDayName) && (inBetween || isSame)) {
          entry.isValidScheduled = true;
        }
      }
      if (time_from && time_to) {
        if (
          (!day || !day.length) &&
          (!date_from || date_from === "" || !date_to || date_to === "")
        ) {
          const withinTime = checkValidMomentDates("withinTime", {
            time_from,
            time_to
          });
          if (withinTime) {
            entry.isValidScheduled = true;
          } else {
            entry.isValidScheduled = false;
          }
        } else if (
          !date_from ||
          date_from === "" ||
          date_from === "" ||
          !date_to
        ) {
          if (day && day.length) {
            const weekDayName = moment().format("dddd");
            const withinTime = checkValidMomentDates("withinTime", {
              time_from,
              time_to,
            });
            if (day.includes(weekDayName) && withinTime) {
              entry.isValidScheduled = true;
            }
          } else {
            entry.isValidScheduled = false;
          }
        } else if (day && day.length) {
          const inBetween = checkValidMomentDates("inBetween", {
            date_from,
            date_to
          });
          const isSame = checkValidMomentDates("isSame", {
            date_from,
            date_to
          });
          const weekDayName = moment().format("dddd");
          const withinTime = checkValidMomentDates("withinTime", {
            time_from,
            time_to
          });
          if (
            day.includes(weekDayName) &&
            (inBetween || isSame) &&
            withinTime
          ) {
            entry.isValidScheduled = true;
          }
        } else if (!day || !day.length) {
          const inBetween = checkValidMomentDates("inBetween", {
            date_from,
            date_to
          });
          const isSame = checkValidMomentDates("isSame", {
            date_from,
            date_to
          });
          const withinTime = checkValidMomentDates("withinTime", {
            time_from,
            time_to
          });
          if ((inBetween || isSame) && withinTime) {
            entry.isValidScheduled = true;
          } else {
            entry.isValidScheduled = false;
          }
        }
      }
    }
  }
  return entry;
}

function checkScheduledPlayList(playList: any) {
  const entries = playList?.map((entry: any) => {
    return getEntrySchedule(entry);
  });

  let scheduledEntries = entries.filter((entry: any) => entry.isValidScheduled);
  let notScheduledEntries = entries.filter(
    (entry: any) => !entry.isValidScheduled
  );
  const notValidScheduleFound = entries.find(
    (entry: any) => entry.isValidScheduled === false
  );
  notScheduledEntries?.forEach((entry: any) => {
    delete entry["isValidScheduled"];
  });
  scheduledEntries?.forEach((entry: any) => {
    delete entry["isValidScheduled"];
  });
  playList.entries = scheduledEntries;
  return { playListWithValidEntries: playList, notValidScheduleFound };
}
export async function fetchScreenDetailsByDuration(
  playlist_id: number,
  duration: number = 5000,
  doWait: boolean,
  screen_id?: string
): Promise<any> {
  doWait && (await wait(10 * 1000));
  let playListRes;
  if (playlist_id) {
    const params = getQueryParams();
    playListRes = await getPlaylistData(
      playlist_id,
      params.backendUrl,
      screen_id
    );
  }
  if (playListRes) {
    const playListLatest = await playListRes.json();
    const playlistResponse: PlaylistResponse = {
      status: ResponseType.SUCCESS,
      data: playListLatest,
    };
    const latestPlaylist = getPlaylistEntries(playlistResponse);
    const playlist = localStorage.getItem("playlist");
    const playlistHash = localStorage.getItem("playlistHash");
    let existingPlayList = [];
    if (playlist) {
      existingPlayList = JSON.parse(playlist);
    }
    // for v2. need to find a better check for v2 maybe
    if (!latestPlaylist.is_edited) {
      checkChangesToReload(
        playlistHash as string,
        CryptoJS.SHA256(JSON.stringify(playListLatest)).toString()
      );
      return;
    }
    if (latestPlaylist.convertedPlaylist?.length > 1) {
      if (
        latestPlaylist.convertedPlaylist?.length !== existingPlayList?.length &&
        latestPlaylist.is_edited === 0
      ) {
        // window.location.reload();
      }
      if (
        JSON.stringify(existingPlayList) !=
          JSON.stringify(latestPlaylist.convertedPlaylist) &&
        latestPlaylist.is_edited === 0
      ) {
        // window.location.reload();
      }
    }
  }
  return;
}

export const checkChangesToReload = (
  playlistLocalHash: string,
  latestPlayListHash: string
) => {
  if (playlistLocalHash !== latestPlayListHash) {
    window.location.reload();
  }
};

export async function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export type KeyValuePair = {
  key: string;
  value: string;
};

export const createObjectFromArray = (array: KeyValuePair[]) => {
  const result = {};

  for (const item of array) {
    result[item.key] = item.value;
  }

  return result;
};

export const getVengoEntriesByIntegrations = async (vengoIntegrations: any) => {
  if (!vengoIntegrations.length) {
    return;
  }
  const vengoEntries = await Promise.all(
    vengoIntegrations.map((integration) => {
      // call api here
      const paramObject = createObjectFromArray(
        integration?.ad_integration?.Params
      );
      return getVengoEntries(integration?.ad_integration?.url, paramObject);
    })
  );
  const jsonEntries = (
    await Promise.all(
      vengoEntries.map((entry) => {
        return entry.json();
      })
    )
  ).flat();

  jsonEntries.forEach((entry, index) => {
    if (entry) {
      entry.position = vengoIntegrations[index].position;
    } else {
      jsonEntries[index] = {
        position: vengoIntegrations[index].position,
      };
    }
  });
  return jsonEntries;
};
export async function uplodPulse(
  screenId: number,
  backend_url: string
): Promise<any> {
  console.log("%cUpdated Screen Pulse 📈", "color:green; font-size:15px");
  await wait(60000);
  await postPulse(screenId, backend_url);
  return uplodPulse(screenId, backend_url);
}

export const getDifferenceOfOnOffTimeByCurrentTime = (offTime, onTime) => {
  const currentTime = moment();

  // Parse the given time string and set it to today's date
  const givenOffDateTime = moment(offTime, "HH:mm:ss").set({
    year: currentTime.year(),
    month: currentTime.month(),
    date: currentTime.date(),
  });

  const givenOnDateTime = moment(onTime, "HH:mm:ss").set({
    year: currentTime.year(),
    month: currentTime.month(),
    date: currentTime.date(),
  });

  // Calculate and return the difference in seconds
  return {
    offTimeDifference: givenOffDateTime.diff(currentTime, "seconds"),
    onTimeDifference: givenOnDateTime.diff(currentTime, "seconds"),
  };
};
