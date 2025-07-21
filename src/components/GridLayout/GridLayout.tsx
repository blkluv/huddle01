import { useLocalPeer, usePeerIds } from '@huddle01/react/hooks';
import { Role } from '@huddle01/server-sdk/auth';
import CoHosts from './ViewPorts/CoHosts';
import Hosts from './ViewPorts/Hosts';
import Speakers from './ViewPorts/Speakers';
import Listeners from './ViewPorts/Listeners';

type GridLayoutProps = {};

const GridLayout: React.FC<GridLayoutProps> = () => {
  const { peerIds } = usePeerIds({ roles: [Role.LISTENER] });
  const { role: localPeerRole } = useLocalPeer();

  return (    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex items-center justify-center gap-8 mb-8">
          <Hosts />
          <CoHosts />
          <Speakers />
        </div>
        <div className="text-white text-lg font-medium text-center mb-4">
          Listeners -{' '}
          {peerIds.length +
            (localPeerRole && localPeerRole === Role.LISTENER ? 1 : 0)}
        </div>
        <div className="flex items-center justify-center gap-8 w-full">
          <Listeners />
        </div>
      </div>
    </div>
  );
};
export default GridLayout;
