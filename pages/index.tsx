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
import { PlaylistPlayer } from "../src/modules/playlistPlayer";
import { getScreenJsonApiResponse, setPagePropsData } from "src/modules/player/helpers/player.helper";

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
        {/* Conditionally render Screen Player if screen is attached */}
        {props.screenId && (
          <ScreenPlayer
            playlistData={props.playlistData}
            screenId={props.screenId}
            backendUrl={props.backendUrl}
            screenData={props.screenData}
          />
        )}

        {/* Conditionally render Playlist Player if screen is attached */}
        {props.playlistId && (
          <PlaylistPlayer playlistData={props.playlistData} />
        )}
      </main>
    </div>
  );
};

export default Home;

export const getServerSideProps = async (context: NextPageContext) => {
  const backendUrl = context?.query.backend_url || process.env.NEXT_PUBLIC_API_URL;

  try {
    if (context?.query.screen_id) {
      const screenApiResponse = await getScreenJsonApiResponse(backendUrl, context);
      if (!screenApiResponse?.data?.playlist_id && !screenApiResponse?.playlist_id) {
        return {
          props: {
            screenId: context.query.screen_id,
            backendUrl,
            screenData: screenApiResponse,
            playlistData: {
              status: ResponseType.ERROR,
              data: {},
              message: ErrorTypes.Playlist_Not_Attached_Error,
            },
          },
        };
      }

      const playlistDataResponse = await getPlaylistData(
        screenApiResponse?.playlist_id ?? screenApiResponse?.data?.playlist_id,
        backendUrl,
        context.query.screen_id as string
      );

      const playlistJsonResponse = await setPagePropsData(
        playlistDataResponse,
        screenApiResponse,
        context.query.screen_id,
        backendUrl,
        context?.query?.playlist_id
      );

      if (typeof playlistJsonResponse.props.playlistData?.data === 'string') {
        return {
          props: {
            screenId: context.query.screen_id,
            backendUrl,
            playlistData: {
              status: ResponseType.ERROR,
              data: {},
              message: ErrorTypes.Playlist_Not_Attached_Error,
            },
          },
        };
      }

      return playlistJsonResponse;
    } else if (context.query?.playlist_id && !context.query.screen_id) {
      const playlistDataResponse = await getPlaylistData(
        context?.query.playlist_id,
        backendUrl
      );
      return setPagePropsData(
        playlistDataResponse,
        null,
        null,
        null,
        context?.query?.playlist_id
      );
    }

    return {
      props: { playlistData: { status: ResponseType.SUCCESS, data: {} } },
    };
  } catch (error) {
    console.error('Error fetching data:', error);

    return {
      props: {
        screenId: context.query.screen_id || null,
        backendUrl,
        playlistData: { status: ResponseType.ERROR, data: {} },
      },
    };
  }
};