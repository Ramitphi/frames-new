import axios from "axios";

export const getMeeting = async (address) => {
  const { data } = await axios.post(
    "https://iriko.huddle01.media/api/v1/create-room",
    {
      title: "Huddle01-Link",
      hostWallets: [address],
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY,
      },
    }
  );

  return data.data.roomId;
};
