'use server';
import IntroPage from '@/components/IntroPage/IntroPage';

interface RoomDetails {
  message: string;
  data: {
    roomId: string;
  };
}

const createRandomRoom = async () => {
  const res = await fetch('https://api.huddle01.com/api/v2/sdk/rooms/create-room', {
    method: 'POST',
    body: JSON.stringify({
    roomLocked: false,
     metadata: {
    title: 'Test Room',
  },
})
,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_KEY ?? '',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
  const errorText = await res.text();
  throw new Error(`API error: ${errorText}`);
}

  const data: RoomDetails = await res.json();
  const { roomId } = data.data;
  return roomId;
};

export default async function Home() {
  const roomId = await createRandomRoom();
  return <IntroPage roomId={roomId} />;
}
