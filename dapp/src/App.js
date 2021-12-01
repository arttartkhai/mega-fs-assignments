import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3'
import ConnectWallet from './components/ConnectWallet';
import Pool from './components/Pool/index'

import './App.css';

const getLibrary = (provider) => {
  return new Web3(provider)
};

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="App">
        <ConnectWallet />
        <Pool />
      </div>
    </Web3ReactProvider>
  );
}

export default App;
