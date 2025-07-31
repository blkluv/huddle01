'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Components
import BottomBar from '@/components/BottomBar/BottomBar';
import Sidebar from '@/components/Sidebar/Sidebar';
import GridLayout from '@/components/GridLayout/GridLayout';
import Prompts from '@/components/common/Prompts';
import AcceptRequest from '@/components/Modals/AcceptRequest';
import Chat from '@/components/Chat/Chat';

// Huddle01 hooks
import {
  useRoom,
  useLocalPeer,
  usePeerIds,
  useHuddle01,
  useDataMessage,
} from '@huddle01/react/hooks';

// Store
import useStore from '@/store/slices';

// Types
import { Role } from '@huddle01/server-sdk/auth';

const Home = ({ params }: { params: { roomId: string } }) => {
  const { push } = useRouter();
  const { roomId } = params;

  const { state } = useRoom({
    onLeave: () => {
      push(`/${roomId}/lobby`);
    },
  });

  const [requestedPeerId, setRequestedPeerId] = useState('');

  const { showAcceptRequest, setShowAcceptRequest } = useStore();
  const addChatMessage = useStore((state) => state.addChatMessage);
  const addRequestedPeers = useStore((state) => state.addRequestedPeers);
  const removeRequestedPeers = useStore((state) => state.removeRequestedPeers);
  const requestedPeers = useStore((state) => state.requestedPeers);
  const avatarUrl = useStore((state) => state.avatarUrl);
  const userDisplayName = useStore((state) => state.userDisplayName);
  const isChatOpen = useStore((state) => state.isChatOpen);

  const { updateMetadata, metadata, peerId, role } = useLocalPeer<{
    displayName: string;
    avatarUrl: string;
    isHandRaised: boolean;
  }>();

  const { peerIds } = usePeerIds();
  const { huddleClient } = useHuddle01();

  useEffect(() => {
    if (state === 'idle') {
      push(`/${roomId}/lobby`);
      return;
    }

    if (userDisplayName && avatarUrl) {
      updateMetadata({
        displayName: userDisplayName,
        avatarUrl: avatarUrl,
        isHandRaised: metadata?.isHandRaised || false,
      });
    }
  }, [state, avatarUrl, userDisplayName, metadata?.isHandRaised, push, roomId]);

  useDataMessage({
    onMessage(payload, from, label) {
      if (label === 'requestToSpeak') {
        setShowAcceptRequest(true);
        setRequestedPeerId(from);
        addRequestedPeers(from);

        setTimeout(() => {
          setShowAcceptRequest(false);
        }, 5000);
      }

      if (label === 'chat' && from !== peerId) {
        try {
          const messagePayload = JSON.parse(payload);
          const newChatMessage = {
            name: messagePayload.name,
            text: messagePayload.message,
            is_user: false,
          };
          addChatMessage(newChatMessage);
        } catch (err) {
          console.error('Failed to parse chat message:', err);
        }
      }
    },
  });

  useEffect(() => {
    if (!requestedPeers.includes(requestedPeerId)) {
      setShowAcceptRequest(false);
    }
  }, [requestedPeers, requestedPeerId, setShowAcceptRequest]);

  return (
    <section className="bg-audio flex h-screen items-center justify-center w-full relative text-slate-100">
      <div className="flex items-center justify-center w-full">
        <GridLayout />
        <Sidebar />
        <div className="absolute right-4 bottom-20">
          {showAcceptRequest && <AcceptRequest peerId={requestedPeerId} />}
        </div>
      </div>
      {isChatOpen && <Chat />}
      <Prompts />
      <BottomBar />
    </section>
  );
};

export default Home;
