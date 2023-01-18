import type { NextPage, NextPageContext } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ResponseType, PlaylistResponse } from "@models/playlistResponseModel";
import { Player } from "src/modules/player";
import Amplify from 'aws-amplify';
import awsConfig from '../src/aws-exports';
import { getBackendUrl, getPlaylistData, getScreenDetails } from '../lib/scoop.repo';


// configure amplify for cloud communication
Amplify.configure(awsConfig);

const Home: NextPage = (props: any) => {
  //console.log("Props Response", props.playlistData);

  return (
    <div>
      <Head>
        <title>Skoop Web Player</title>
        <meta name="description" content="A Webapp for the Skoop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Player playlistData={props.playlistData} />
      </main>
    </div>
  );
};

export default Home;

const playlistResponse = async (playlistDataRsponse) => {
  const apiResponse = await playlistDataRsponse.json();
  const playlistResponse: PlaylistResponse = {
    status: ResponseType.SUCCESS,
    data: apiResponse,
  };
  return {
    props: {
      playlistData: playlistResponse,
    },
  };
}

export const getServerSideProps = async (context: NextPageContext) => {
  console.log("Request for playlist ");
  const backendUrl = getBackendUrl(context?.query.backend_url);
  console.log("backendurl", backendUrl);
  if (context?.query.screen_id) {
    try {
      const screenDetailResponse = await getScreenDetails(context?.query.screen_id, backendUrl);
      const apiResponse = await screenDetailResponse.json();
      const playlistDataRsponse = await getPlaylistData(apiResponse.playlist_id, backendUrl);
      return playlistResponse(playlistDataRsponse)
    } catch (err) {
      console.log("crash ");
      return {
        props: { playlistData: { status: ResponseType.ERROR, data: {} } },
      };
    }
  }
  else if (context.query?.playlist_id && !context.query.screen_id) {
    try {
      const playlistDataResponse = await getPlaylistData(context?.query.playlist_id, backendUrl);
      return playlistResponse(playlistDataResponse)
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
