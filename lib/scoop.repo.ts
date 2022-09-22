const headers = new Headers({
  Authorization: "Bearer ghfutrd754d6ufiytfg97tf968",
  "Content-Type": "application/json",
})

export const getPlaylistData = (playlist_id) =>{
  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/playlists/${playlist_id}/entries`,
    {
      method: "GET",
      headers: headers
    }
  );
}
