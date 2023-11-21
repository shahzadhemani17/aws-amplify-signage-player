const headers = new Headers({
  Authorization: "Bearer ghfutrd754d6ufiytfg97tf968",
  "Content-Type": "application/json",
});

export const getPlaylistData = (
  playlist_id,
  backendUrl,
  screen_id?: string
) => {
  return fetch(
    `${backendUrl}/playlists/${playlist_id}/entries?screen_id=${screen_id}`,
    {
      method: "GET",
      headers: headers,
    }
  );
};

export const getVengoEntries = (url, params) => {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(params),
  });
};

export const sendVengoImpression = (url) => {
  return fetch(url, {
    method: "GET",
  });
};

export const getScreenDetails = (screen_id, backendUrl) => {
  return fetch(`${backendUrl}/screens/${screen_id}`, {
    method: "GET",
    headers: headers,
  });
};

export const getQueryParams = () => {
  const params = new URL(location.href).searchParams;
  const backendUrl = params.get("backend_url");
  return {
    backendUrl,
  };
};
