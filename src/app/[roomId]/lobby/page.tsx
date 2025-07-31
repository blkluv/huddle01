'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { toast } from 'react-hot-toast';
import { BasicIcons } from '@/assets/BasicIcons';

// Components
import FeatCommon from '@/components/common/FeatCommon';
import AvatarWrapper from '@/components/common/AvatarWrapper';

// Store
import useStore from '@/store/slices';

// Huddle01
import { useRoom } from '@huddle01/react/hooks';

const Lobby = ({ params }: { params: { roomId: string } }) => {
  const { roomId } = params;

  const [isOpen, setIsOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const avatarUrl = useStore((s) => s.avatarUrl);
  const setAvatarUrl = useStore((s) => s.setAvatarUrl);
  const userDisplayName = useStore((s) => s.userDisplayName);
  const setUserDisplayName = useStore((s) => s.setUserDisplayName);

  const { joinRoom, state } = useRoom();
  const { push } = useRouter();

  const handleStartSpaces = async () => {
    if (state !== 'connected') {
      if (!userDisplayName.trim()) {
        toast.error('Display name is required!');
        return;
      }

      setIsJoining(true);
      try {
        const res = await fetch(`/token?roomId=${roomId}&name=${userDisplayName}`);
        const token = await res.text();
        await joinRoom({ roomId, token });
      } catch (err) {
        toast.error('Failed to join room.');
      } finally {
        setIsJoining(false);
      }
    } else {
      toast.error('Already connected to the room!');
    }
  };

  useEffect(() => {
    if (state === 'connected') {
      push(`/${roomId}`);
    }
  }, [state, roomId]);

  return (
    <main className="flex h-screen flex-col items-center justify-center bg-lobby text-slate-100">
      <div className="flex flex-col items-center gap-4 w-[26.25rem]">
        <div className="relative text-center">
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={125}
            height={125}
            className="maskAvatar object-contain"
            quality={100}
            priority
          />
          <video
            src={avatarUrl}
            muted
            loop
            className="maskAvatar absolute left-1/2 top-1/2 z-10 h-full w-full -translate-x-1/2 -translate-y-1/2"
          />
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-white absolute bottom-0 right-0 z-10"
          >
            {BasicIcons.edit}
          </button>

          <FeatCommon
            onClose={() => setIsOpen(false)}
            className={`absolute top-4 ${isOpen ? 'block' : 'hidden'}`}
          >
            <div className="grid grid-cols-3 gap-6 px-6 mt-5">
              {Array.from({ length: 20 }).map((_, i) => {
                const url = `/avatars/avatars/${i}.png`;
                return (
                  <AvatarWrapper
                    key={i}
                    isActive={avatarUrl === url}
                    onClick={() => setAvatarUrl(url)}
                  >
                    <Image
                      src={url}
                      alt={`Avatar ${i}`}
                      width={45}
                      height={45}
                      className="object-contain"
                    />
                  </AvatarWrapper>
                );
              })}
            </div>
          </FeatCommon>
        </div>

        <div className="flex flex-col w-full items-center">
          <label className="text-white mb-2">Set a display name</label>
          <div className="flex w-full items-center rounded-[10px] border px-3 text-white border-zinc-800 backdrop-blur focus-within:border-slate-600 gap-2">
            <Image
              alt="User icon"
              src="/images/user-icon.svg"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <input
              type="text"
              placeholder="Enter your name"
              value={userDisplayName}
              onChange={(e) => setUserDisplayName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStartSpaces()}
              className="flex-1 bg-transparent py-3 outline-none placeholder:text-slate-400 text-white"
            />
          </div>
        </div>

        <button
          className="flex items-center justify-center bg-[#246BFD] text-slate-100 rounded-md p-2 mt-2 w-full"
          onClick={handleStartSpaces}
          disabled={isJoining || !userDisplayName.trim()}
        >
          {isJoining ? 'Joining Spaces...' : 'Start Spaces'}
          {!isJoining && (
            <Image
              alt="Arrow right"
              src="/images/arrow-narrow-right.svg"
              width={24}
              height={24}
              className="ml-2"
            />
          )}
        </button>
      </div>
    </main>
  );
};

export default Lobby;
