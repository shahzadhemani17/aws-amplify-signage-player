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

// configure amplify for cloud communication
// Amplify.configure(awsConfig);
export enum ErrorTypes {
  Screen_Not_Found_Error = "Screen_Not_Found_Error",
  Playlist_Not_Attached_Error = "Playlist_Not_Attached_Error",
}
const Home: NextPage = (props: any) => {
  console.log("Props Response", props);

  return (
    <div>
      <Head>
        <title>Skoop Web Player</title>
        <meta name="description" content="A Webapp for the Skoop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* <Player playlistData={props.playlistData} /> */}
        <Player
          playlistData={props.playlistData}
          screenId={props.screen_id}
          backendUrl={props.backend_url}
          screenData={props.screenData}
        />
      </main>
    </div>
  );
};

export default Home;

const playlistResponse = async (
  playlistDataRsponse,
  screenDataResponse,
  screen_id,
  backend_url
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
      screen_id,
      backend_url,
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

      const playlistJsonResponse = await playlistResponse(
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
      return playlistResponse(playlistDataResponse, null, null, null);
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
