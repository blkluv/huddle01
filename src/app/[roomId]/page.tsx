// src/app/[roomId]/page.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateMetadata } from '@/lib/updateMetadata'; // adjust import path if needed

type PageProps = {
  params: {
    roomId: string;
  };
};

export default async function RoomPage({ params }: PageProps) {
  const { roomId } = params;

  // This function should not contain hooks because it's async
  // If you need to use hooks like useEffect, wrap logic in a child component

  return <Room roomId={roomId} />;
}

// Move useEffect and hook logic to a client component
'use client';

type RoomProps = {
  roomId: string;
};

function Room({ roomId }: RoomProps) {
  const { push } = useRouter();

  useEffect(() => {
    updateMetadata(roomId);
  }, [roomId]);

  return (
    <div>
      <h1>Room ID: {roomId}</h1>
    </div>
  );
}
