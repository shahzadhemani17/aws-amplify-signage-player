import type { NextPage, NextPageContext } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ResponseType, PlaylistResponse } from "@models/playlistResponseModel";
import { Player } from "src/modules/player";
import {
  getPlaylistData,
  getQueryParams,
  getScreenDetails,
} from "../lib/scoop.repo";
import { PlaylistModel, PlaylistEntryModel } from "../models/playlist.model";
import { plainToInstance } from "class-transformer";
import { useState } from "react";
import { ScreenPlayer } from "../src/modules/screenPlayer";

// configure amplify for cloud communication
// Amplify.configure(awsConfig);
export enum ErrorTypes {
  Screen_Not_Found_Error = "Screen_Not_Found_Error",
  Playlist_Not_Attached_Error = "Playlist_Not_Attached_Error",
}
const Home: NextPage = (props: any) => {
  // console.log("API: Screen or Playlist Data Response", props);
  // const [playlistData] = useState(
  //   plainToInstance(PlaylistModel, props.playlistData.data)
  // );
  return (
    <div>
      <Head>
        <title>Skoop Web Player</title>
        <meta name="description" content="A Webapp for the Skoop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {props.screenId && (
          <ScreenPlayer
            playlistData={props.playlistData}
            screenId={props.screenId}
            backendUrl={props.backendUrl}
            screenData={props.screenData}
          />
        )}
      </main>
    </div>
  );
};

export default Home;

const setPagePropsData = async (
  playlistDataRsponse,
  screenDataResponse,
  screenId,
  backendUrl
) => {
  const apiResponse = await playlistDataRsponse.json();
  const playlistResponse: PlaylistResponse = {
    status: ResponseType.SUCCESS,
    data: apiResponse,
  };
  return {
    props: {
      playlistData: playlistResponse,
      screenData: screenDataResponse,
      screenId,
      backendUrl,
    },
  };
};

export const getServerSideProps = async (context: NextPageContext) => {
  const backendUrl = context?.query.backend_url
    ? context?.query.backend_url
    : process.env.NEXT_PUBLIC_API_URL;
  if (context?.query.screen_id) {
    try {
      const screenDetailResponse = await getScreenDetails(
        context?.query.screen_id,
        backendUrl
      );

      const screenApiResponse = await screenDetailResponse.json();

      if (
        !screenApiResponse?.data?.playlist_id &&
        !screenApiResponse?.playlist_id
      ) {
        return {
          props: {
            screen_id: context.query.screen_id,
            backend_url: backendUrl,
            screenData: screenApiResponse,
            playlistData: {
              status: ResponseType.ERROR,
              data: {},
              message: "Playlist_Not_Attached_Error",
            },
          },
        };
      }

      const playlistDataRsponse = await getPlaylistData(
        screenApiResponse?.playlist_id ?? screenApiResponse?.data?.playlist_id,
        backendUrl,
        context?.query.screen_id as string
      );

      // const playlistJsonResponse = await playlistResponse(
      //   playlistDataRsponse,
      //   context?.query.screen_id as string
      // );

      const playlistJsonResponse = await setPagePropsData(
        playlistDataRsponse,
        screenApiResponse,
        context.query.screen_id,
        backendUrl
      );
      // improve this
      if (typeof playlistJsonResponse.props.playlistData?.data === "string") {
        return {
          props: {
            screen_id: context.query.screen_id,
            backend_url: backendUrl,
            playlistData: {
              status: ResponseType.ERROR,
              data: {},
              message: "Playlist_Not_Attached_Error",
            },
          },
        };
      }

      const playlistData = playlistJsonResponse?.props?.playlistData?.data;

      return playlistJsonResponse;
    } catch (err) {
      console.log("crash ");
      return {
        props: {
          screen_id: context.query.screen_id,
          backend_url: backendUrl,
          playlistData: { status: ResponseType.ERROR, data: {} },
        },
      };
    }
  } else if (context.query?.playlist_id && !context.query.screen_id) {
    try {
      const playlistDataResponse = await getPlaylistData(
        context?.query.playlist_id,
        backendUrl
      );
      return setPagePropsData(playlistDataResponse, null, null, null);
    } catch (err) {
      console.log("crash ");
      return {
        props: { playlistData: { status: ResponseType.ERROR, data: {} } },
      };
    }
  }
  return {
    props: { playlistData: { status: ResponseType.SUCCESS, data: {} } },
  };
};
