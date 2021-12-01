import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3'
import ConnectWallet from './components/ConnectWallet';
import WalletInfo from './components/WalletInfo';
import Pool from './components/Pool/index'

import './App.css';

const getLibrary = (provider) => {
  return new Web3(provider)
};

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="App">
        <WalletInfo />
        <ConnectWallet />
        <Pool />
      </div>
    </Web3ReactProvider>
  );
}

export default App;
