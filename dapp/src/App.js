import { useState } from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';
import ConnectWallet from './components/ConnectWallet';
import Pool from './components/Pool/index';
import Modal from './components/Modal';

import './App.css';

const getLibrary = (provider) => {
  return new Web3(provider);
};

function App() {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [popupPayload, setPopupPayload] = useState({
    type: '',
    message: '',
  });

  const closePopup = () => {
    setIsOpenPopup(false);
    setPopupPayload('');
  };

  const openPopup = (payload) => {
    setPopupPayload(payload);
    setIsOpenPopup(true);
  };

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      {isOpenPopup && <Modal payload={popupPayload} closePopup={closePopup} />}
      <div className="App">
        <ConnectWallet />
        <Pool openPopup={openPopup} />
      </div>
    </Web3ReactProvider>
  );
}

export default App;
