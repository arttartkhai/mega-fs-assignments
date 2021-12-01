import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';

import { useEagerConnect, useInactiveListener } from '../hooks';
import connectorList, { resetWalletConnectConnector } from '../lib/connectors';

const ConnectWallet = () => {
  const [isConnecing, setIsConnecing] = useState(false);
  const { activate, deactivate, active, error } = useWeb3React();

  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager);

  const handleClick = (connectorName) => () => {
    setIsConnecing(true);
    activate(connectorList[connectorName]);
  };

  const handleDisconnect = () => {
    deactivate();
  };

  const handleRetry = () => {
    setIsConnecing(false);
    resetWalletConnectConnector(connectorList['WalletConnect']);
    deactivate();
  };

  useEffect(() => {
    if (active) {
      setIsConnecing(false);
    }
  }, [active]);

  return (
    <>
      {active && (
        // <button className="button-disconnect" onClick={handleDisconnect}>
        //   Disconnect Wallet
        // </button>
        <div className="flex w-full justify-end">
          <button
            data-modal-toggle="example"
            data-modal-action="open"
            class="bg-red-600 font-semibold text-white p-3 rounded-full hover:bg-red-700 focus:outline-none focus:ring shadow-lg hover:shadow-none transition-all duration-300 m-2"
            onClick={handleDisconnect}
          >
            Disconnect Wallet
          </button>
        </div>
      )}
      {!active && (
        <div className="flex w-full justify-center">
          <button
            data-modal-toggle="example"
            data-modal-action="open"
            class="bg-green-500 font-semibold text-white p-3 rounded-full hover:bg-green-700 focus:outline-none focus:ring shadow-lg hover:shadow-none transition-all duration-300 m-2"
            onClick={handleClick('MetaMask')}
            disabled={isConnecing}
          >
            Connect on MetaMask
          </button>

          {/* <button onClick={handleClick('MetaMask')} disabled={isConnecing}>
            Connect on MetaMask
          </button>
          <button onClick={handleClick('Portis')} disabled={isConnecing}>
            Connect on Portis
          </button>
          <button onClick={handleClick('WalletConnect')} disabled={isConnecing}>
            Connect on WalletConnect
          </button>
          <button onClick={handleClick('WalletLink')} disabled={isConnecing}>
            Connect on WalletLink
          </button> */}
        </div>
      )}
      {!active && error && <button onClick={handleRetry}>Retry</button>}
    </>
  );
};

export default ConnectWallet;
