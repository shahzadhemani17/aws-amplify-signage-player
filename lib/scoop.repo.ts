const headers = new Headers({
  Authorization: "Bearer ghfutrd754d6ufiytfg97tf968",
  "Content-Type": "application/json",
})

export const getPlaylistData = (playlist_id) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/playlists/${playlist_id}/entries`,
    {
      method: "GET",
      headers: headers
    }
  );
};

export const getScreenDetails = (screen_id) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/screens/${screen_id}`,
    {
      method: "GET",
      headers: headers
    }
  );
}

export async function postPulse(screenId: number) {console.log("pulse")
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/pulse/record/${screenId}`,
			{
				method: "PATCH",
				headers: headers
			}
		);
		console.log("response",response);
		return response;
	} catch (err) {
		console.log("Unexpected error occured during fetch",err);
		return err;
	}
}
