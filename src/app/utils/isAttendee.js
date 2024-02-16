import { API } from "@Huddle01/server-sdk/api";

export const isAttendee = async (roomId, walletAddress) => {
  const api = new API({
    apiKey: process.env.API_KEY,
  });

  const meetingsList = await api.getRoomMeetings({
    roomId: roomId,
  });

  if (meetingsList?.data?.meetings) {
    for (const { meetingId } of meetingsList.data.meetings) {
      const partcipants = await api.getParticipants({
        meetingId,
      });

      for (const { walletAddress: address } of partcipants?.data
        ?.participants || []) {
        console.log({ address });
        if (address === walletAddress?.toLowerCase()) {
          console.log("Participant Found");
          return true;
        }
      }
    }
  } else {
    return false;
  }

  return false;
};
