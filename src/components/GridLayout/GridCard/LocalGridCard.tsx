import React, { type FC, useState } from 'react';
import Image from 'next/image';

// Assets
import { BasicIcons } from '@/assets/BasicIcons';
import { NestedBasicIcons } from '@/assets/BasicIcons';
import { useLocalAudio } from '@huddle01/react/hooks';
import { useDataMessage, useLocalPeer } from '@huddle01/react/hooks';
import { getFallbackAvatar } from '@/utils/helpers';

const LocalGridCard: FC = () => {
  const [reaction, setReaction] = useState('');

  const {
    metadata,
    peerId: localPeerId,
    role,
  } = useLocalPeer<{
    displayName: string;
    avatarUrl: string;
    isHandRaised: boolean;
  }>();

  const {
    enableAudio,
    disableAudio,
    isAudioOn,
    stream: micStream,
  } = useLocalAudio();

  useDataMessage({
    onMessage(payload, from, label) {
      if (from === localPeerId) {
        if (label === 'reaction') {
          setReaction(payload);
          setTimeout(() => {
            setReaction('');
          }, 5000);
        }
      }
    },
  });

  return (
    <div className="relative items-center justify-center flex-col">
      <div className="relative">
        <Image
          src={metadata?.avatarUrl || getFallbackAvatar()}
          alt="default-avatar"
          width={100}
          height={100}
          quality={100}
          priority
          className="maskAvatar"
        />
      </div>

      <div className="mt-1 text-center">
        <div className="text-custom-5 text-base font-medium">
          {`${metadata?.displayName} (You)`}
        </div>
        <div className="text-custom-6 text-sm font-normal">{role}</div>
      </div>
      {/* Only show reaction, audio, and hand raise indicators, not duplicate controls */}
      <div className="absolute left-1/2 bottom-1/2 -translate-x-1/2 mb-2 text-4xl">
        {reaction}
      </div>
      {role && ['host, coHost, speaker'].includes(role) && (
        <div className="absolute right-0">{BasicIcons.audio}</div>
      )}
      {metadata?.isHandRaised && (
        <div className="absolute flex right-2 w-8 h-8 -top-1 rounded-full justify-center items-center bg-custom-8 text-xl border-custom-1 border-2">
          ✋
        </div>
      )}
    </div>
  );
};
export default React.memo(LocalGridCard);
