import type { NextPage, NextPageContext } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { samplePlayerData } from "../src/seed-data";
import { useEffect } from "react";
import SamplePlayerContainer from "../src/SamplePlayerContainer";

const Home: NextPage = (props: any) => {
  useEffect(() => {
    console.log("API: Screen or Playlist Data Response", samplePlayerData);
  }, []);

  return (
    <div>
      <Head>
        <title>Skoop Web Player</title>
        <meta name="description" content="A Webapp for the Skoop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <SamplePlayerContainer entriesData={samplePlayerData}/>
      </main>
    </div>
  );
};

export default Home;
