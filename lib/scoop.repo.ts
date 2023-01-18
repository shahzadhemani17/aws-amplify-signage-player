const headers = new Headers({
  Authorization: "Bearer ghfutrd754d6ufiytfg97tf968",
  "Content-Type": "application/json",
})

export const getPlaylistData = (playlist_id, backendUrl) => {
  return fetch(
    `${backendUrl}/playlists/${playlist_id}/entries`,
    {
      method: "GET",
      headers: headers
    }
  );
};

export const getScreenDetails = (screen_id, backendUrl) => {
  return fetch(
    `${backendUrl}/screens/${screen_id}`,
    {
      method: "GET",
      headers: headers
    }
  );
}

export const getQueryParams = () => {
  const params = new URL(location.href).searchParams;
  const backendUrl = params.get("backend_url");
  return {
    backendUrl
  };
};


export const getBackendUrl = (backendUrl) => {
  if (backendUrl) {
    return backendUrl
  }
  return process.env.NEXT_PUBLIC_API_URL;
}