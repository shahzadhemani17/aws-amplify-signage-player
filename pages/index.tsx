import type { NextPage, NextPageContext } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ResponseType, PlaylistResponse } from "@models/playlistResponseModel";
import { Player } from "src/modules/player";
import Amplify from "aws-amplify";
import awsConfig from "../src/aws-exports";
import {
  getPlaylistData,
  getScreenDetails,
  getVengoEntries,
} from "../lib/scoop.repo";

// configure amplify for cloud communication
// Amplify.configure(awsConfig);
export enum ErrorTypes {
  Screen_Not_Found_Error = "Screen_Not_Found_Error",
  Playlist_Not_Attached_Error = "Playlist_Not_Attached_Error",
}
const Home: NextPage = (props: any) => {
  //console.log("Props Response", props.playlistData);
  console.log("Props Response", props);

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
};
type KeyValuePair = {
  key: string;
  value: string;
};
const createObjectFromArray = (array: KeyValuePair[]) => {
  console.log("crash hota dekho", array);
  const result = {};

  for (const item of array) {
    result[item.key] = item.value;
  }

  return result;
};
const addVengoEntries = async (responseData: any) => {
  if (responseData?.props?.playlistData?.data?.entries) {
    const vengoIntegrations =
      responseData?.props?.playlistData?.data?.entries?.filter((entry) => {
        if (entry?.ad_integration?.integration_name === "vengo") {
          return entry;
        }
      });

    if (!vengoIntegrations.length) {
      return;
    }
    const vengoEntries = await Promise.all(
      vengoIntegrations.map((integration) => {
        // call api here
        const paramObject = createObjectFromArray(
          integration?.ad_integration?.Params
        );
        // console.log("paramObject............", paramObject);
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

    console.log("vengoEntries............4", jsonEntries);

    jsonEntries.forEach((entry, index) => {
      entry.position = vengoIntegrations[index].position;
    });
    return jsonEntries;
  }
};

const filterLocalEntries = (entries) => {
  return entries.filter((entry) => {
    if (entry?.ad_integration?.integration_name !== "vengo") {
      return entry;
    }
  });
};

export const getServerSideProps = async (context: NextPageContext) => {
  const backendUrl = context?.query.backend_url
    ? context?.query.backend_url
    : process.env.NEXT_PUBLIC_API_URL;
  console.log("backendurl", "public-url", backendUrl);
  if (context?.query.screen_id) {
    try {
      const screenDetailResponse = await getScreenDetails(
        context?.query.screen_id,
        backendUrl
      );

      const screenApiResponse = await screenDetailResponse.json();
      console.log("screenApiResponse...................1", screenApiResponse);

      if (
        !screenApiResponse?.data?.playlist_id &&
        !screenApiResponse?.playlist_id
      ) {
        return {
          props: {
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

      const playlistJsonResponse = await playlistResponse(playlistDataRsponse);

      const vengoEntries = await addVengoEntries(playlistJsonResponse);
      const localEntries = filterLocalEntries(
        playlistJsonResponse.props.playlistData?.data.entries
      );

      console.log("vengoEntryArray...........1", vengoEntries);

      const vengoEntryArray = vengoEntries;
      console.log("vengoEntryArray...........2", vengoEntryArray);

      // improve this
      if (typeof playlistJsonResponse.props.playlistData?.data === "string") {
        return {
          props: {
            playlistData: {
              status: ResponseType.ERROR,
              data: {},
              message: "Playlist_Not_Attached_Error",
            },
          },
        };
      }

      const playlistData = playlistJsonResponse?.props?.playlistData?.data;
      console.log("playlistData.......6", playlistData);

      if (playlistData?.entries?.length) {
        if (localEntries.length && vengoEntryArray?.length) {
          playlistData.entries = [...localEntries, ...vengoEntryArray];
        } else if (localEntries.length && !vengoEntryArray?.length) {
          playlistData.entries = [...localEntries];
        } else if (!localEntries.length && vengoEntryArray?.length) {
          playlistData.entries = [...vengoEntryArray];
        }
      }

      console.log("playlistData.......7", playlistData);

      return playlistJsonResponse;
    } catch (err) {
      console.log("crash ");
      return {
        props: { playlistData: { status: ResponseType.ERROR, data: {} } },
      };
    }
  } else if (context.query?.playlist_id && !context.query.screen_id) {
    try {
      const playlistDataResponse = await getPlaylistData(
        context?.query.playlist_id,
        backendUrl
      );
      return playlistResponse(playlistDataResponse);
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
