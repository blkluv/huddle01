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

// Huddle01 Hooks
import {
  useRoom,
  useLocalPeer,
  usePeerIds,
  useHuddle01,
  useDataMessage,
} from '@huddle01/react/hooks';

// Store
import useStore from '@/store/slices';
import { toast } from 'react-hot-toast';

const RoomPage = ({ params }: { params: { roomId: string } }) => {
  const { push } = useRouter();
  const { roomId } = params;

  const { state } = useRoom({
    onLeave: () => push(`/${roomId}/lobby`),
  });

  const [requestedPeerId, setRequestedPeerId] = useState('');
  const { showAcceptRequest, setShowAcceptRequest } = useStore();

  const addChatMessage = useStore((s) => s.addChatMessage);
  const addRequestedPeers = useStore((s) => s.addRequestedPeers);
  const removeRequestedPeers = useStore((s) => s.removeRequestedPeers);
  const requestedPeers = useStore((s) => s.requestedPeers);
  const avatarUrl = useStore((s) => s.avatarUrl);
  const userDisplayName = useStore((s) => s.userDisplayName);
  const isChatOpen = useStore((s) => s.isChatOpen);

  const { updateMetadata, metadata, peerId } = useLocalPeer<{
    displayName: string;
    avatarUrl: string;
    isHandRaised: boolean;
  }>();

  const { peerIds } = usePeerIds();
  const { huddleClient } = useHuddle01();

  useEffect(() => {
    if (state === 'idle') {
      push(`/${roomId}/lobby`);
    } else {
      updateMetadata({
        displayName: userDisplayName,
        avatarUrl,
        isHandRaised: metadata?.isHandRaised || false,
      });
    }
  }, [state]);

  useDataMessage({
    onMessage(payload, from, label) {
      if (label === 'requestToSpeak') {
        setShowAcceptRequest(true);
        setRequestedPeerId(from);
        addRequestedPeers(from);
        setTimeout(() => setShowAcceptRequest(false), 5000);
      }

      if (label === 'chat' && from !== peerId) {
        try {
          const messagePayload = JSON.parse(payload);
          addChatMessage({
            name: messagePayload.name,
            text: messagePayload.message,
            is_user: false,
          });
        } catch (e) {
          console.error('Failed to parse chat payload', e);
        }
      }
    },
  });

  useEffect(() => {
    if (!requestedPeers.includes(requestedPeerId)) {
      setShowAcceptRequest(false);
    }
  }, [requestedPeers]);

  return (
    <section className="bg-audio flex h-screen items-center justify-center w-full relative text-slate-100">
      <div className="flex items-center justify-center w-full">
        <GridLayout />
        <Sidebar />
        {showAcceptRequest && (
          <div className="absolute right-4 bottom-20">
            <AcceptRequest peerId={requestedPeerId} />
          </div>
        )}
      </div>
      {isChatOpen && <Chat />}
      <Prompts />
      <BottomBar />
    </section>
  );
};

export default RoomPage;
