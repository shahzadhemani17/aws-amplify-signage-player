// MyWorker.worker.ts

import { getVengoEntriesByIntegrations } from "../src/modules/player/helpers/player.helper";

onmessage = (event: MessageEvent) => {
  const { action, data } = event.data;

  if (action === "fetchData") {
    console.log(`put put put put......`, data);
    fetchDataFromApi(data).then((result) => {
      postMessage({ action, data: result });
    });
  }
};

const fetchDataFromApi = async (data: any): Promise<any> => {
  console.log(`input data......`, data);
  return getVengoEntriesByIntegrations(data);
};
