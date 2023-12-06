import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
// import { sleep, isScreenScheduleValid } from "../../helpers/player.helper";

import { EntriesModel } from "@models/playerModel";
import InlineWorker from "lib/InlineWorker";

export const ChildWorker = ({
  interval
}: any) => {

  useEffect(() => {
    const worker = new InlineWorker(
      setInterval(async () => {
        console.log("childinterval::", interval);

      }, 5 * 1000)
    )

    return () => {
      worker.terminate();
    };

  }, []);



      // Terminate the worker when the component is unmounted
    // window.addEventListener('message', (event) => {
    //   console.log("1stopped");
    //   if (event.data === 'stop-worker') {
    //     console.log("2stopped");
    //     worker.terminate();
    //   }
    // });
    


  return (
    <div>
      In Child
    </div>
  );
};
