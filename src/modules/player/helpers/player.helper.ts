import { HtmlEnum, PlayerModel } from "@models/playerModel";
import { ResponseType } from "@models/playlistResponseModel";
import { PlaylistMessages } from "../player.constant";
import moment from "moment";

const populatePlayer = (
  duration: number,
  id: number,
  tag: string,
  url: string
) => {
  const player: PlayerModel = {
    id: id,
    tag: tag,
    url: url,
    duration: duration * 1000,
    visibility: false,
  };
  return player;
};

export const convertJSON = (playlist: any) => {
  const result: PlayerModel[] = [];
  playlist.entries.sort(
    (a: any, b: any) => parseFloat(a.position) - parseFloat(b.position)
  );
  playlist?.entries.map((entry: any) => {
    if (entry.is_web_url === true || entry.is_menu === true) {
      result.push(
        populatePlayer(
          entry.duration_in_seconds,
          entry.id,
          HtmlEnum.iFRAME,
          entry.weburl.url
        )
      );
    } else {
      entry.media.hash &&
        result.push(
          populatePlayer(
            entry.duration_in_seconds,
            entry.id,
            entry.media.content_type === "video"
              ? HtmlEnum.VIDEO
              : HtmlEnum.IMAGE,
            entry.media.hash
          )
        );
    }
  });
  return result;
};

export const getPlaylistEntries = (playlistData: any) => {
  let convertedPlaylist: PlayerModel[] = [];
  let transition: string = "";
  let message: string = "";

  if (playlistData.data.code === "not-found") {
    message = PlaylistMessages.PLAYLIST_NOT_EXISTS;
  } else if (
    Object.keys(playlistData.data).length === 0 &&
    playlistData.status === ResponseType.ERROR
  ) {
    message = PlaylistMessages.SOMETHING_WENT_WRONG;
  } else if (Object.keys(playlistData.data).length === 0) {
    message = PlaylistMessages.PROVIDE_PLAYLIST_ID;
  } else if (playlistData.data.entries.length !== 0) {
    const playlistClone = [...playlistData.data.entries];
    const scheduledEntries = checkScheduledPlayList(playlistClone);
    convertedPlaylist = convertJSON(scheduledEntries.playListWithValidEntries);
    transition = playlistData.data.transition;
  } else {
    message = PlaylistMessages.ENTRIES_NOT_FOUND;
  }
  return { convertedPlaylist, message, transition };
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

function checkScheduledPlayList(playList: any) {
  const entries = playList.map((entry: any) => {
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
            date_to,
          });
          const isSame = checkValidMomentDates("isSame", {
            date_from,
            date_to,
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
            date_to,
          });
          const isSame = checkValidMomentDates("isSame", {
            date_from,
            date_to,
          });
          const weekDayName = moment().format("dddd");
          if (day.includes(weekDayName) && (inBetween || isSame)) {
            entry.isValidScheduled = true;
          }
        }
        if (time_from && time_to) {
          if (!date_from || date_from === "" || date_from === "" || !date_to) {
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
              date_to,
            });
            const isSame = checkValidMomentDates("isSame", {
              date_from,
              date_to,
            });
            const weekDayName = moment().format("dddd");
            const withinTime = checkValidMomentDates("withinTime", {
              time_from,
              time_to,
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
              date_to,
            });
            const isSame = checkValidMomentDates("isSame", {
              date_from,
              date_to,
            });
            const withinTime = checkValidMomentDates("withinTime", {
              time_from,
              time_to,
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
  });

  let scheduledEntries = entries.filter((entry: any) => entry.isValidScheduled);
  const notValidScheduleFound = entries.find(
    (entry: any) => entry.isValidScheduled === false
  );
  scheduledEntries?.forEach((entry: any) => {
    delete entry["isValidScheduled"];
  });
  playList.entries = scheduledEntries;
  return { playListWithValidEntries: playList, notValidScheduleFound };
}