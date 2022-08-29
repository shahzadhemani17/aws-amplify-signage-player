import type { NextPage, NextPageContext } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ResponseType, PlaylistResponse } from "@models/playlistResponseModel";
import { Player } from "src/modules/player";
import Amplify from 'aws-amplify';
import awsConfig from '../src/aws-exports';


// configure amplify for cloud communication
Amplify.configure(awsConfig);

const Home: NextPage = (props: any) => {
  console.log("Props Response", props.playlistData);
  
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

export const getServerSideProps = async (context: NextPageContext) => {
  console.log("Request for playlist ");
  if (context.query?.playlist_id) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/playlists/${context.query?.playlist_id}/entries`,
        {
          method: "GET",
          headers: new Headers({
            Authorization: "Bearer ghfutrd754d6ufiytfg97tf968",
            "Content-Type": "application/json",
          }),
        }
      );
      const apiResponse = await res.json();
      const playlistResponse: PlaylistResponse = {
        status: ResponseType.SUCCESS,
        data: apiResponse,
      };
      return {
        props: {
          playlistData: playlistResponse,
        },
      };
    } catch (err) {
      return {
        props: { playlistData: { status: ResponseType.ERROR, data: {} } },
      };
    }
  }

  return {
    props: { playlistData: { status: ResponseType.SUCCESS, data: {} } },
  };
};
